import React from 'react';
import katex from 'katex';

export interface BibEntry {
  key: string;
  type: string;
  author: string;
  title: string;
  venue: string;
  year: string;
  raw: string;
}

export interface DiagnosticIssue {
  id: string;
  severity: 'error' | 'warning' | 'info' | 'verified';
  category: 'syntax' | 'citation' | 'ref' | 'data-consistency' | 'todo';
  fileTitle: string;
  filePath: string;
  line?: number;
  message: string;
  suggestion?: string;
}

export interface DiffChunk {
  type: 'same' | 'added' | 'removed';
  text: string;
}

/**
 * Compute line-by-line diff for academic polishing & version snapshot comparison
 */
export function computeLineDiff(oldText: string, newText: string): DiffChunk[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const m = oldLines.length;
  const n = newLines.length;

  // LCS matrix for reasonable paragraph/section lengths
  if (m * n > 250000) {
    return [
      { type: 'removed', text: oldText },
      { type: 'added', text: newText },
    ];
  }

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (oldLines[i] === newLines[j]) {
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const result: DiffChunk[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (oldLines[i] === newLines[j]) {
      result.push({ type: 'same', text: oldLines[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: 'removed', text: oldLines[i] });
      i++;
    } else {
      result.push({ type: 'added', text: newLines[j] });
      j++;
    }
  }
  while (i < m) {
    result.push({ type: 'removed', text: oldLines[i++] });
  }
  while (j < n) {
    result.push({ type: 'added', text: newLines[j++] });
  }
  return result;
}

/**
 * Audit LaTeX syntax, BibTeX citations, cross-references, \TBD markers, and empirical numbers
 */
export function auditPaperManuscript(
  paperId: string,
  files: { path: string; title: string; kind: 'tex' | 'bib' | 'md'; content: string }[],
  bibEntries: BibEntry[]
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const bibKeys = new Set(bibEntries.map((b) => b.key));
  const definedLabels = new Set<string>();

  const texFiles = files.filter((f) => f.kind === 'tex');

  // Pass 1: Collect all \label{...} definitions across all .tex files
  for (const f of texFiles) {
    const labelRegex = /\\label\{([^}]+)\}/g;
    let m: RegExpExecArray | null;
    while ((m = labelRegex.exec(f.content)) !== null) {
      definedLabels.add(m[1].trim());
    }
  }

  // Ground truth empirical benchmarks for Paper C (LUX)
  const paperCBenchmarks = [
    {
      label: 'V36 Changed-Items LUX Accuracy (88.8% / 0.888)',
      regex: /\b(0\.888|88\.8\\%|89\\%)\b/,
      expected: '0.888 (88.8% or rounded 89% in abstract/intro)',
    },
    {
      label: 'V36 Direct-SFT + New Rule Prompt Accuracy (26.2% / 0.262)',
      regex: /\b(0\.262|26\.2\\%|26\\%)\b/,
      expected: '0.262 (26.2% or rounded 26% in abstract/intro)',
    },
    {
      label: 'Overexposure Clipped FP Multiplier (1.7--4.6x)',
      regex: /1\.7--4\.6/,
      expected: '1.7--4.6x across InspecSafe, MMAD, and BDD-OIA',
    },
    {
      label: 'Shared-Prefix Probe Latency (0.30s vs 0.29s)',
      regex: /0\.30\\?,?s|0\.297/,
      expected: '0.297s (0.30s) for LUX 15 probes vs 0.288s (0.29s) direct',
    },
  ];

  // Pass 2: Check each file for syntax, environments, citations, refs, and TBDs
  for (const f of texFiles) {
    const lines = f.content.split('\n');
    const envStack: { name: string; line: number }[] = [];

    lines.forEach((rawLine, idx) => {
      const lineNo = idx + 1;
      // Strip comments
      const line = rawLine.replace(/(^|[^\\])%.*$/, '$1');

      // 1. Check brace balance on single non-multiline lines if suspicious
      let openBraces = 0;
      for (let c = 0; c < line.length; c++) {
        if (line[c] === '{' && line[c - 1] !== '\\') openBraces++;
        if (line[c] === '}' && line[c - 1] !== '\\') openBraces--;
      }

      // 2. Track \begin{...} and \end{...}
      const beginRegex = /\\begin\{([^}]+)\}/g;
      let bm: RegExpExecArray | null;
      while ((bm = beginRegex.exec(line)) !== null) {
        envStack.push({ name: bm[1], line: lineNo });
      }

      const endRegex = /\\end\{([^}]+)\}/g;
      let em: RegExpExecArray | null;
      while ((em = endRegex.exec(line)) !== null) {
        const endName = em[1];
        const top = envStack.pop();
        if (!top) {
          issues.push({
            id: `${f.path}-L${lineNo}-unmatched-end`,
            severity: 'error',
            category: 'syntax',
            fileTitle: f.title,
            filePath: f.path,
            line: lineNo,
            message: `Unmatched \\end{${endName}} without corresponding \\begin{${endName}}`,
            suggestion: `Remove \\end{${endName}} or add matching \\begin{${endName}} above line ${lineNo}.`,
          });
        } else if (top.name !== endName) {
          issues.push({
            id: `${f.path}-L${lineNo}-mismatched-env`,
            severity: 'error',
            category: 'syntax',
            fileTitle: f.title,
            filePath: f.path,
            line: lineNo,
            message: `Environment mismatch: opened \\begin{${top.name}} on line ${top.line}, but closed with \\end{${endName}}`,
            suggestion: `Close \\end{${top.name}} before \\end{${endName}}.`,
          });
        }
      }

      // 3. Check \cite{...} keys against refs.bib
      const citeRegex = /\\cite\{([^}]+)\}/g;
      let cm: RegExpExecArray | null;
      while ((cm = citeRegex.exec(line)) !== null) {
        const keys = cm[1]
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean);
        for (const k of keys) {
          if (!bibKeys.has(k)) {
            issues.push({
              id: `${f.path}-L${lineNo}-cite-${k}`,
              severity: 'warning',
              category: 'citation',
              fileTitle: f.title,
              filePath: f.path,
              line: lineNo,
              message: `Citation key "${k}" is not defined in refs.bib`,
              suggestion: `Add @inproceedings{${k}, ...} to refs.bib or fix the citation key.`,
            });
          }
        }
      }

      // 4. Check \TBD{...} and \FIG{...}
      const tbdRegex = /\\(TBD|FIG)\{([^}]*)\}/g;
      let tm: RegExpExecArray | null;
      while ((tm = tbdRegex.exec(line)) !== null) {
        issues.push({
          id: `${f.path}-L${lineNo}-${tm[1]}-${tm.index}`,
          severity: tm[1] === 'TBD' ? 'warning' : 'info',
          category: 'todo',
          fileTitle: f.title,
          filePath: f.path,
          line: lineNo,
          message: `\\${tm[1]} marker: ${tm[2]}`,
          suggestion:
            tm[1] === 'FIG'
              ? 'Use the Figure Studio to generate or upload this figure and replace \\FIG{...} with \\includegraphics.'
              : 'Resolve this pending experimental or editorial item before final CVPR submission.',
        });
      }
    });

    if (envStack.length > 0) {
      for (const unclosed of envStack) {
        issues.push({
          id: `${f.path}-L${unclosed.line}-unclosed`,
          severity: 'error',
          category: 'syntax',
          fileTitle: f.title,
          filePath: f.path,
          line: unclosed.line,
          message: `Unclosed environment \\begin{${unclosed.name}} opened on line ${unclosed.line}`,
          suggestion: `Add \\end{${unclosed.name}} to close the block.`,
        });
      }
    }
  }

  // Pass 3: Check empirical data consistency for Paper C
  if (paperId === 'paper_c') {
    const fullConcatenated = texFiles.map((f) => f.content).join('\n');
    for (const bench of paperCBenchmarks) {
      const matched = bench.regex.test(fullConcatenated);
      issues.push({
        id: `data-check-${bench.label}`,
        severity: matched ? 'verified' : 'warning',
        category: 'data-consistency',
        fileTitle: 'All Sections (Data-Text Audit)',
        filePath: 'paper_c/paper/sec/5_experiments.tex',
        message: matched
          ? `Verified: ${bench.label} matches ground-truth JSON/V36 logs.`
          : `Missing or modified metric: ${bench.label}`,
        suggestion: matched ? undefined : `Expected value from experiment logs: ${bench.expected}`,
      });
    }
  }

  return issues;
}

/**
 * Safely render a LaTeX math string via KaTeX
 */
export function renderKatexHtml(mathTex: string, displayMode = false): string {
  const cleanedMath = mathTex
    .replace(/\\lux/g, '\\textsc{Lux}')
    .replace(/\\cref\{([^}]+)\}/g, '\\text{Ref }')
    .trim();
  try {
    return katex.renderToString(cleanedMath, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true,
    });
  } catch {
    return cleanedMath;
  }
}

export function renderInlineLatex(
  text: string,
  bibMap: Record<string, BibEntry>,
  onSelectCitation?: (key: string) => void
): React.ReactNode[] {
  if (!text) return [];

  const normalized = text
    .replace(/\\lux\\?\s*/g, '\\textsc{Lux} ')
    .replace(/\\eg\\?\s*/g, 'e.g., ')
    .replace(/\\ie\\?\s*/g, 'i.e., ')
    .replace(/\\etal\\?\s*/g, 'et al. ')
    .replace(/\\wrt\\?\s*/g, 'w.r.t. ')
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/``/g, '“')
    .replace(/''/g, '”')
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/~/g, ' ')
    .replace(/\\,/g, ' ');

  const tokenRegex =
    /(\\TBD\{[\s\S]*?\}|\\FIG\{[\s\S]*?\}|\\textbf\{[^{}]*\}|\\emph\{[^{}]*\}|\\textit\{[^{}]*\}|\\textsc\{[^{}]*\}|\\texttt\{[^{}]*\}|\\cite\{[^{}]*\}|\\(?:c|C)?ref\{[^{}]*\}|\$[^$]+\$)/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = tokenRegex.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(normalized.slice(lastIndex, match.index));
    }
    const tok = match[0];
    const k = `tok-${keyCounter++}`;

    if (tok.startsWith('\\TBD{')) {
      const inner = tok.slice(5, -1);
      nodes.push(
        <span
          key={k}
          className="inline-block bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30 px-1.5 py-0.5 rounded font-mono-code text-xs font-medium mx-0.5"
        >
          [TBD: {inner}]
        </span>
      );
    } else if (tok.startsWith('\\FIG{')) {
      const inner = tok.slice(5, -1);
      nodes.push(
        <span
          key={k}
          className="block my-3 p-3.5 bg-[#1E3A8A]/5 border border-dashed border-[#1E3A8A]/40 rounded-md text-xs text-[#1E3A8A] font-mono-code leading-relaxed break-inside-avoid"
        >
          <strong className="uppercase tracking-wider block mb-1 text-[11px]">
            Figure Blueprint (\FIG):
          </strong>
          {inner}
        </span>
      );
    } else if (tok.startsWith('\\textbf{')) {
      const inner = tok.slice(8, -1);
      nodes.push(
        <strong key={k} className="font-semibold text-[#111827]">
          {renderInlineLatex(inner, bibMap, onSelectCitation)}
        </strong>
      );
    } else if (tok.startsWith('\\emph{') || tok.startsWith('\\textit{')) {
      const inner = tok.slice(tok.indexOf('{') + 1, -1);
      nodes.push(
        <em key={k} className="italic">
          {renderInlineLatex(inner, bibMap, onSelectCitation)}
        </em>
      );
    } else if (tok.startsWith('\\textsc{')) {
      const inner = tok.slice(8, -1);
      nodes.push(
        <span key={k} className="uppercase tracking-wider text-[0.88em] font-semibold">
          {inner}
        </span>
      );
    } else if (tok.startsWith('\\texttt{')) {
      const inner = tok.slice(8, -1);
      nodes.push(
        <code key={k} className="font-mono-code text-[0.9em] bg-[#F3F4F6] px-1 py-0.5 rounded">
          {inner}
        </code>
      );
    } else if (tok.startsWith('\\cite{')) {
      const keys = tok
        .slice(6, -1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      nodes.push(
        <span key={k} className="inline-flex items-center gap-0.5 mx-0.5 font-mono-code text-xs">
          [
          {keys.map((ck, idx) => {
            const entry = bibMap[ck];
            const tooltip = entry
              ? `${entry.author} (${entry.year}): "${entry.title}" — ${entry.venue}`
              : `Undefined citation key: ${ck}`;
            return (
              <React.Fragment key={ck}>
                {idx > 0 && <span>, </span>}
                <button
                  type="button"
                  onClick={() => onSelectCitation && onSelectCitation(ck)}
                  title={tooltip}
                  className={`hover:underline font-medium cursor-pointer ${
                    entry ? 'text-[#1E3A8A]' : 'text-[#DC2626] underline decoration-wavy'
                  }`}
                >
                  {ck}
                </button>
              </React.Fragment>
            );
          })}
          ]
        </span>
      );
    } else if (/^\\(?:c|C)?ref\{/.test(tok)) {
      const refTarget = tok.slice(tok.indexOf('{') + 1, -1);
      const prefix = refTarget.startsWith('sec:')
        ? '§'
        : refTarget.startsWith('thm:')
        ? 'Theorem '
        : refTarget.startsWith('tab:')
        ? 'Table '
        : refTarget.startsWith('fig:')
        ? 'Fig. '
        : refTarget.startsWith('eq:')
        ? 'Eq. '
        : refTarget.startsWith('app:')
        ? 'App. '
        : 'Ref ';
      nodes.push(
        <span key={k} className="text-[#1E3A8A] font-medium font-mono-code text-xs">
          {prefix}
          {refTarget.replace(/^(sec|thm|tab|fig|eq|app):/, '')}
        </span>
      );
    } else if (tok.startsWith('$') && tok.endsWith('$')) {
      const mathBody = tok.slice(1, -1);
      const html = renderKatexHtml(mathBody, false);
      nodes.push(
        <span
          key={k}
          className="inline-block align-baseline mx-0.5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else {
      nodes.push(tok);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < normalized.length) {
    nodes.push(normalized.slice(lastIndex));
  }

  return nodes;
}

function renderLatexTable(
  tableTex: string,
  bibMap: Record<string, BibEntry>,
  onSelectCitation?: (key: string) => void,
  idx?: number
) {
  const captionMatch = /\\caption(?:\{([\s\S]*?)\}\n|\{([\s\S]*?)\}(?=\s*\\label|\s*\\resizebox|\s*\\begin\{tabular\}))/.exec(
    tableTex
  );
  const labelMatch = /\\label\{([^}]+)\}/.exec(tableTex);
  const tabularMatch = /\\begin\{tabular\}\{[^}]*\}([\s\S]*?)\\end\{tabular\}/.exec(tableTex);

  const captionRaw = captionMatch ? captionMatch[1] || captionMatch[2] || '' : '';
  const labelRaw = labelMatch ? labelMatch[1] : '';
  const tabularBody = tabularMatch ? tabularMatch[1] : '';

  const rawRows = tabularBody
    .replace(/\\toprule|\\midrule|\\bottomrule/g, '')
    .split(/\\\\/)
    .map((r) => r.trim())
    .filter(Boolean);

  return (
    <div
      key={`table-${idx}`}
      className="my-4 border-y-2 border-[#111827] bg-white overflow-hidden break-inside-avoid"
    >
      {captionRaw && (
        <div className="py-2 text-xs text-[#111827] leading-snug font-sans border-b border-[#E5E7EB]">
          <span className="font-semibold text-[#111827] mr-1.5">
            Table ({labelRaw || 'tab'}).
          </span>
          {renderInlineLatex(captionRaw, bibMap, onSelectCitation)}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px] font-mono-code">
          <tbody className="divide-y divide-[#E5E7EB]">
            {rawRows.map((rowStr, rIdx) => {
              const cells = rowStr.split('&').map((c) =>
                c
                  .replace(/\\multirow\{[^}]*\}\{[^}]*\}\{([^}]*)\}/g, '$1')
                  .replace(/\\multicolumn\{[^}]*\}\{[^}]*\}\{([^}]*)\}/g, '$1')
                  .trim()
              );
              return (
                <tr
                  key={rIdx}
                  className={
                    rIdx === 0
                      ? 'bg-[#F8F9FA] font-semibold text-[#111827] font-sans border-b border-[#111827]'
                      : 'hover:bg-[#F8F9FA]'
                  }
                >
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className="py-1.5 px-2.5">
                      {renderInlineLatex(cell, bibMap, onSelectCitation)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderLatexFigure(
  figTex: string,
  bibMap: Record<string, BibEntry>,
  assetUrlMap: Record<string, string>,
  onSelectCitation?: (key: string) => void,
  idx?: number
) {
  const isTwoCol = figTex.startsWith('\\begin{figure*}') || figTex.startsWith('\\begin{strip}');
  const includeMatch = /\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/.exec(figTex);
  const capMatch =
    /\\captionof\{figure\}\{([\s\S]*?)\}(?=\s*\\captionsetup|\s*\\label|\s*\\end)/.exec(figTex) ||
    /\\caption\{([\s\S]*?)\}(?=\s*\\label|\s*\\end)/.exec(figTex);
  const labelMatch = /\\label\{([^}]+)\}/.exec(figTex);

  const figPath = includeMatch ? includeMatch[1].trim() : '';
  const fileNameOnly = figPath.split('/').pop() || '';
  const resolvedUrl =
    assetUrlMap[figPath] ||
    assetUrlMap[fileNameOnly] ||
    (figPath.includes('teaser') ? assetUrlMap['fig1_teaser_overexposure.svg'] : '') ||
    (figPath.startsWith('/api/assets/') ? figPath : '');

  const captionText = capMatch ? capMatch[1].trim() : '';
  const labelText = labelMatch ? labelMatch[1].trim() : 'fig';

  return (
    <figure
      key={`fig-${idx}`}
      className={`my-4 p-3.5 bg-white border border-[#E5E7EB] rounded-md break-inside-avoid ${
        isTwoCol ? 'col-span-full' : ''
      }`}
    >
      {resolvedUrl ? (
        <div className="mb-2.5 bg-[#F8F9FA] p-2 rounded border border-[#E5E7EB] flex justify-center">
          <img
            src={resolvedUrl}
            alt={labelText}
            referrerPolicy="no-referrer"
            className="max-h-80 w-full object-contain rounded"
          />
        </div>
      ) : (
        <div className="p-3 bg-[#F8F9FA] border border-dashed border-[#9CA3AF] rounded text-xs font-mono-code text-[#4B5563] mb-2.5">
          <strong className="text-[#111827] block mb-1">
            {isTwoCol ? 'Two-Column Figure* / Strip' : 'Single-Column Figure'} ({figPath || labelText}):
          </strong>
          <span>Use the Figure &amp; Asset Studio tab to generate or upload `{figPath || 'figure'}` and preview it live here.</span>
        </div>
      )}
      {captionText && (
        <figcaption className="text-xs font-sans text-[#111827] leading-relaxed">
          <strong className="font-semibold text-[#111827] mr-1.5">
            Figure ({labelText}).
          </strong>
          {renderInlineLatex(captionText, bibMap, onSelectCitation)}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Map a rendered block or user-highlighted text selection from the Preview back to the exact LaTeX source span
 */
export function resolvePreviewSelectionToLatex(
  sourceLatex: string,
  rawBlockLatex: string,
  selectedRenderedText?: string
): { latexSnippet: string; startOffset: number; endOffset: number } {
  if (!sourceLatex) {
    return { latexSnippet: rawBlockLatex, startOffset: 0, endOffset: 0 };
  }

  // 1. Find rawBlockLatex inside sourceLatex
  let blockStart = sourceLatex.indexOf(rawBlockLatex);
  let blockEnd = blockStart >= 0 ? blockStart + rawBlockLatex.length : -1;

  if (blockStart < 0) {
    const blockLines = rawBlockLatex
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (blockLines.length > 0) {
      const firstLineIdx = sourceLatex.indexOf(blockLines[0]);
      if (firstLineIdx >= 0) {
        blockStart = firstLineIdx;
        const lastLine = blockLines[blockLines.length - 1];
        const lastLineIdx = sourceLatex.indexOf(lastLine, firstLineIdx);
        blockEnd =
          lastLineIdx >= 0
            ? lastLineIdx + lastLine.length
            : Math.min(sourceLatex.length, firstLineIdx + rawBlockLatex.length);
      }
    }
  }

  if (blockStart < 0) {
    blockStart = 0;
    blockEnd = sourceLatex.length;
  }

  const blockSlice = sourceLatex.slice(blockStart, blockEnd);
  const cleanSel = (selectedRenderedText || '').trim();

  // If no partial text was dragged-selected, return the whole block span
  if (!cleanSel || cleanSel.length < 3) {
    return {
      latexSnippet: blockSlice || rawBlockLatex,
      startOffset: blockStart,
      endOffset: blockEnd,
    };
  }

  // 2. Try direct substring match inside blockSlice
  const directIdx = blockSlice.indexOf(cleanSel);
  if (directIdx >= 0) {
    const startOffset = blockStart + directIdx;
    const endOffset = startOffset + cleanSel.length;
    return {
      latexSnippet: sourceLatex.slice(startOffset, endOffset),
      startOffset,
      endOffset,
    };
  }

  // 3. Fuzzy word-anchor match across inline LaTeX macros (\textbf, \emph, \cite, etc.)
  const words = cleanSel
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length >= 2);

  if (words.length >= 1) {
    const firstWord = words[0];
    const lastWord = words[words.length - 1];
    const firstIdx = blockSlice.toLowerCase().indexOf(firstWord.toLowerCase());
    if (firstIdx >= 0) {
      let subStart = firstIdx;
      // Expand left if immediately preceded by a LaTeX macro like \textbf{ or \emph{
      const prefixSlice = blockSlice.slice(Math.max(0, subStart - 16), subStart);
      const macroPrefixMatch = /\\[a-zA-Z]+\{$/.exec(prefixSlice);
      if (macroPrefixMatch) {
        subStart -= macroPrefixMatch[0].length;
      }

      let subEnd = firstIdx + firstWord.length;
      if (words.length > 1) {
        const searchFrom = Math.min(
          blockSlice.length,
          firstIdx + Math.max(firstWord.length, Math.floor(cleanSel.length * 0.5))
        );
        const lastIdx = blockSlice.toLowerCase().indexOf(lastWord.toLowerCase(), searchFrom);
        if (lastIdx >= 0) {
          subEnd = lastIdx + lastWord.length;
        } else {
          const fallbackLastIdx = blockSlice
            .toLowerCase()
            .indexOf(lastWord.toLowerCase(), firstIdx);
          if (fallbackLastIdx >= 0) {
            subEnd = fallbackLastIdx + lastWord.length;
          }
        }
      }

      // Balance closing braces if we included an opening macro brace
      let openBraces = 0;
      for (let i = subStart; i < subEnd; i++) {
        if (blockSlice[i] === '{' && blockSlice[i - 1] !== '\\') openBraces++;
        if (blockSlice[i] === '}' && blockSlice[i - 1] !== '\\') openBraces--;
      }
      while (openBraces > 0 && subEnd < blockSlice.length && blockSlice[subEnd] === '}') {
        subEnd++;
        openBraces--;
      }

      const startOffset = blockStart + subStart;
      const endOffset = blockStart + subEnd;
      return {
        latexSnippet: sourceLatex.slice(startOffset, endOffset),
        startOffset,
        endOffset,
      };
    }
  }

  return {
    latexSnippet: blockSlice || rawBlockLatex,
    startOffset: blockStart,
    endOffset: blockEnd,
  };
}

export const LatexDocumentPreview: React.FC<{
  content: string;
  bibEntries: BibEntry[];
  assetUrlMap?: Record<string, string>;
  twoColumn?: boolean;
  highlightedLatexSnippet?: string;
  onSelectCitation?: (key: string) => void;
  onSelectBlock?: (rawBlockLatex: string, blockKind: string, e: React.MouseEvent) => void;
  onSelectPreview?: (
    rawBlockLatex: string,
    blockKind: string,
    selectedRenderedText: string,
    coords: { x: number; y: number },
    isContextMenu: boolean
  ) => void;
}> = ({
  content,
  bibEntries,
  assetUrlMap = {},
  twoColumn = false,
  highlightedLatexSnippet,
  onSelectCitation,
  onSelectBlock,
  onSelectPreview,
}) => {
  const bibMap = React.useMemo(() => {
    const map: Record<string, BibEntry> = {};
    for (const b of bibEntries) map[b.key] = b;
    return map;
  }, [bibEntries]);

  const isBlockHighlighted = React.useCallback(
    (rawBlock: string) => {
      const needle = (highlightedLatexSnippet || '').trim();
      const hay = rawBlock.trim();
      if (!needle || !hay) return false;
      if (hay.includes(needle) || needle.includes(hay)) return true;
      const needleFirstLine = needle.split('\n')[0].trim();
      if (needleFirstLine.length > 12 && hay.includes(needleFirstLine)) return true;
      return false;
    },
    [highlightedLatexSnippet]
  );

  const handleMouseUpOnBlock = (
    rawBlock: string,
    blockKind: string,
    e: React.MouseEvent
  ) => {
    if (e.button !== 0) return;
    const sel = window.getSelection();
    const selText = sel ? sel.toString().trim() : '';
    if (selText.length >= 2) {
      e.stopPropagation();
      onSelectPreview?.(
        rawBlock,
        blockKind,
        selText,
        { x: e.clientX, y: e.clientY },
        false
      );
    }
  };

  const handleContextMenuOnBlock = (
    rawBlock: string,
    blockKind: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const sel = window.getSelection();
    const selText = sel ? sel.toString().trim() : '';
    if (onSelectPreview) {
      onSelectPreview(
        rawBlock,
        blockKind,
        selText,
        { x: e.clientX, y: e.clientY },
        true
      );
    } else {
      onSelectBlock?.(rawBlock, blockKind, e);
    }
  };

  const handleDoubleClickOnBlock = (
    rawBlock: string,
    blockKind: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const sel = window.getSelection();
    const selText = sel ? sel.toString().trim() : '';
    if (onSelectPreview) {
      onSelectPreview(
        rawBlock,
        blockKind,
        selText,
        { x: e.clientX, y: e.clientY },
        false
      );
    } else {
      onSelectBlock?.(rawBlock, blockKind, e);
    }
  };

  const cleaned = content
    .split('\n')
    .filter((line) => !line.trim().startsWith('%'))
    .map((line) => line.replace(/(^|[^\\])%.*$/, '$1'))
    .join('\n');

  const blockRegex =
    /(\\begin\{abstract\}[\s\S]*?\\end\{abstract\}|\\begin\{strip\}[\s\S]*?\\end\{strip\}|\\begin\{figure\*?\}[\s\S]*?\\end\{figure\*?\}|\\begin\{table\*?\}[\s\S]*?\\end\{table\*?\}|\\begin\{theorem\}[\s\S]*?\\end\{theorem\}|\\begin\{definition\}[\s\S]*?\\end\{definition\}|\\begin\{proposition\}[\s\S]*?\\end\{proposition\}|\\begin\{corollary\}[\s\S]*?\\end\{corollary\}|\\begin\{equation\*?\}[\s\S]*?\\end\{equation\*?\}|\\begin\{itemize\}[\s\S]*?\\end\{itemize\}|\\begin\{enumerate\}[\s\S]*?\\end\{enumerate\})/g;

  const segments: { type: 'text' | 'env'; value: string }[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(cleaned)) !== null) {
    if (match.index > lastIdx) {
      segments.push({ type: 'text', value: cleaned.slice(lastIdx, match.index) });
    }
    segments.push({ type: 'env', value: match[0] });
    lastIdx = blockRegex.lastIndex;
  }
  if (lastIdx < cleaned.length) {
    segments.push({ type: 'text', value: cleaned.slice(lastIdx) });
  }

  const renderTextParagraphs = (rawChunk: string, baseIdx: number) => {
    const lines = rawChunk.split('\n');
    const blocks: React.ReactNode[] = [];
    let paraBuffer: string[] = [];
    let pCount = 0;

    const flushPara = () => {
      const rawJoined = paraBuffer.join('\n').trim();
      const joined = paraBuffer.join(' ').replace(/\\noindent\b/g, '').trim();
      paraBuffer = [];
      if (!joined) return;

      const highlighted = isBlockHighlighted(rawJoined);
      const highlightCls = highlighted
        ? 'bg-[#0066CC]/[0.06] ring-1 ring-[#0066CC]/30'
        : 'hover:bg-black/[0.025]';

      const paraMatch = /^\\paragraph\{([^}]*)\}\s*([\s\S]*)$/.exec(joined);
      if (paraMatch) {
        blocks.push(
          <p
            key={`p-${baseIdx}-${pCount++}`}
            onMouseUp={(e) => handleMouseUpOnBlock(rawJoined, 'paragraph', e)}
            onContextMenu={(e) => handleContextMenuOnBlock(rawJoined, 'paragraph', e)}
            onDoubleClick={(e) => handleDoubleClickOnBlock(rawJoined, 'paragraph', e)}
            className={`text-[13.5px] text-[#111827] leading-[1.65] my-2.5 text-justify rounded px-1.5 py-0.5 -mx-1.5 transition-colors ${highlightCls}`}
          >
            <strong className="font-semibold text-[#111827] mr-2 font-sans text-xs uppercase tracking-wide">
              {renderInlineLatex(paraMatch[1], bibMap, onSelectCitation)}
            </strong>
            {renderInlineLatex(paraMatch[2], bibMap, onSelectCitation)}
          </p>
        );
      } else {
        blocks.push(
          <p
            key={`p-${baseIdx}-${pCount++}`}
            onMouseUp={(e) => handleMouseUpOnBlock(rawJoined, 'paragraph', e)}
            onContextMenu={(e) => handleContextMenuOnBlock(rawJoined, 'paragraph', e)}
            onDoubleClick={(e) => handleDoubleClickOnBlock(rawJoined, 'paragraph', e)}
            className={`text-[13.5px] text-[#111827] leading-[1.65] my-2.5 text-justify rounded px-1.5 py-0.5 -mx-1.5 transition-colors ${highlightCls}`}
          >
            {renderInlineLatex(joined, bibMap, onSelectCitation)}
          </p>
        );
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        flushPara();
        continue;
      }
      if (/^\\label\{[^}]+\}$/.test(trimmed)) {
        continue;
      }
      const secMatch = /^\\section\*?\{([^}]*)\}/.exec(trimmed);
      if (secMatch) {
        flushPara();
        const highlighted = isBlockHighlighted(trimmed);
        blocks.push(
          <h2
            key={`sec-${baseIdx}-${pCount++}`}
            onMouseUp={(e) => handleMouseUpOnBlock(trimmed, 'section', e)}
            onContextMenu={(e) => handleContextMenuOnBlock(trimmed, 'section', e)}
            onDoubleClick={(e) => handleDoubleClickOnBlock(trimmed, 'section', e)}
            className={`font-serif-editorial text-lg font-semibold text-[#111827] mt-5 mb-2 pb-1 border-b border-[#E5E7EB] break-after-avoid rounded px-1 -mx-1 transition-colors ${
              highlighted ? 'bg-[#0066CC]/[0.06] ring-1 ring-[#0066CC]/30' : ''
            }`}
          >
            {renderInlineLatex(secMatch[1], bibMap, onSelectCitation)}
          </h2>
        );
        continue;
      }
      const subsecMatch = /^\\subsection\*?\{([^}]*)\}/.exec(trimmed);
      if (subsecMatch) {
        flushPara();
        const highlighted = isBlockHighlighted(trimmed);
        blocks.push(
          <h3
            key={`subsec-${baseIdx}-${pCount++}`}
            onMouseUp={(e) => handleMouseUpOnBlock(trimmed, 'subsection', e)}
            onContextMenu={(e) => handleContextMenuOnBlock(trimmed, 'subsection', e)}
            onDoubleClick={(e) => handleDoubleClickOnBlock(trimmed, 'subsection', e)}
            className={`font-serif-editorial text-[15px] font-semibold text-[#111827] mt-4 mb-1.5 break-after-avoid rounded px-1 -mx-1 transition-colors ${
              highlighted ? 'bg-[#0066CC]/[0.06] ring-1 ring-[#0066CC]/30' : ''
            }`}
          >
            {renderInlineLatex(subsecMatch[1], bibMap, onSelectCitation)}
          </h3>
        );
        continue;
      }
      paraBuffer.push(trimmed);
    }
    flushPara();
    return blocks;
  };

  return (
    <div
      className={`font-serif-editorial text-[#111827] cvpr-print-sheet ${
        twoColumn ? 'md:columns-2 md:gap-7 space-y-2.5' : 'max-w-[74ch] mx-auto space-y-3'
      }`}
    >
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <React.Fragment key={idx}>{renderTextParagraphs(seg.value, idx)}</React.Fragment>;
        }

        const env = seg.value;
        const highlighted = isBlockHighlighted(env);

        if (env.startsWith('\\begin{abstract}')) {
          const inner = env.replace(/^\\begin\{abstract\}|\\end\{abstract\}$/g, '').trim();
          return (
            <div
              key={idx}
              onMouseUp={(e) => handleMouseUpOnBlock(env, 'abstract', e)}
              onContextMenu={(e) => handleContextMenuOnBlock(env, 'abstract', e)}
              onDoubleClick={(e) => handleDoubleClickOnBlock(env, 'abstract', e)}
              className={`my-4 p-4 bg-[#FBFBF9] border rounded-xl break-inside-avoid transition-all ${
                highlighted
                  ? 'border-[#0066CC]/45 ring-2 ring-[#0066CC]/20 bg-[#0066CC]/[0.03]'
                  : 'border-black/[0.07] hover:border-black/[0.15]'
              }`}
            >
              <div className="text-xs font-mono-code font-semibold text-[#1D1D1F] mb-1.5 text-center">
                Abstract
              </div>
              <p className="text-[13px] text-[#1D1D1F] leading-relaxed font-serif-editorial text-justify">
                {renderInlineLatex(inner, bibMap, onSelectCitation)}
              </p>
            </div>
          );
        }

        if (
          env.startsWith('\\begin{strip}') ||
          env.startsWith('\\begin{figure}') ||
          env.startsWith('\\begin{figure*}')
        ) {
          return (
            <div
              key={idx}
              onMouseUp={(e) => handleMouseUpOnBlock(env, 'figure', e)}
              onContextMenu={(e) => handleContextMenuOnBlock(env, 'figure', e)}
              onDoubleClick={(e) => handleDoubleClickOnBlock(env, 'figure', e)}
              className={`rounded-lg transition-all ${
                highlighted
                  ? 'ring-2 ring-[#0066CC]/40 bg-[#0066CC]/[0.03]'
                  : 'hover:ring-1 hover:ring-[#0066CC]/30'
              }`}
            >
              {renderLatexFigure(env, bibMap, assetUrlMap, onSelectCitation, idx)}
            </div>
          );
        }

        if (env.startsWith('\\begin{table}') || env.startsWith('\\begin{table*}')) {
          return (
            <div
              key={idx}
              onMouseUp={(e) => handleMouseUpOnBlock(env, 'table', e)}
              onContextMenu={(e) => handleContextMenuOnBlock(env, 'table', e)}
              onDoubleClick={(e) => handleDoubleClickOnBlock(env, 'table', e)}
              className={`rounded-lg transition-all ${
                highlighted
                  ? 'ring-2 ring-[#0066CC]/40 bg-[#0066CC]/[0.03]'
                  : 'hover:ring-1 hover:ring-[#0066CC]/30'
              }`}
            >
              {renderLatexTable(env, bibMap, onSelectCitation, idx)}
            </div>
          );
        }

        if (
          env.startsWith('\\begin{theorem}') ||
          env.startsWith('\\begin{definition}') ||
          env.startsWith('\\begin{proposition}') ||
          env.startsWith('\\begin{corollary}')
        ) {
          const typeMatch = /^\\begin\{(theorem|definition|proposition|corollary)\}(?:\[([^\]]*)\])?(?:\s*\\label\{([^}]*)\})?([\s\S]*?)\\end\{\1\}/.exec(
            env
          );
          const envName = typeMatch ? typeMatch[1] : 'theorem';
          const titleOpt = typeMatch ? typeMatch[2] : '';
          const labelOpt = typeMatch ? typeMatch[3] : '';
          const body = typeMatch ? typeMatch[4].trim() : env;

          return (
            <div
              key={idx}
              onMouseUp={(e) => handleMouseUpOnBlock(env, envName, e)}
              onContextMenu={(e) => handleContextMenuOnBlock(env, envName, e)}
              onDoubleClick={(e) => handleDoubleClickOnBlock(env, envName, e)}
              className={`my-3.5 p-3.5 bg-[#FBFBF9] border rounded-xl break-inside-avoid transition-all ${
                highlighted
                  ? 'border-[#0066CC]/45 ring-2 ring-[#0066CC]/20 bg-[#0066CC]/[0.03]'
                  : 'border-black/[0.07] hover:border-black/[0.16]'
              }`}
            >
              <div className="text-xs font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between font-sans">
                <span>
                  {envName.charAt(0).toUpperCase() + envName.slice(1)}
                  {titleOpt ? ` (${titleOpt})` : ''}
                </span>
                {labelOpt && <span className="font-mono-code text-[11px] text-[#86868B]">{labelOpt}</span>}
              </div>
              <div className="text-[13.5px] text-[#1D1D1F] italic leading-relaxed">
                {renderInlineLatex(body, bibMap, onSelectCitation)}
              </div>
            </div>
          );
        }

        if (env.startsWith('\\begin{equation')) {
          const labelMatch = /\\label\{([^}]+)\}/.exec(env);
          const inner = env
            .replace(/\\begin\{equation\*?\}|\\end\{equation\*?\}/g, '')
            .replace(/\\label\{[^}]+\}/g, '')
            .trim();
          const html = renderKatexHtml(inner, true);
          return (
            <div
              key={idx}
              onMouseUp={(e) => handleMouseUpOnBlock(env, 'equation', e)}
              onContextMenu={(e) => handleContextMenuOnBlock(env, 'equation', e)}
              onDoubleClick={(e) => handleDoubleClickOnBlock(env, 'equation', e)}
              className={`my-3 py-2.5 px-3 bg-[#F8F9FA] border rounded-md flex items-center justify-between gap-3 overflow-x-auto break-inside-avoid transition-all ${
                highlighted
                  ? 'border-[#0066CC]/45 ring-2 ring-[#0066CC]/20 bg-[#0066CC]/[0.03]'
                  : 'border-[#E5E7EB] hover:border-black/[0.2]'
              }`}
            >
              <div
                className="flex-1 overflow-x-auto text-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              {labelMatch && (
                <span className="font-mono-code text-xs text-[#4B5563] shrink-0">
                  ({labelMatch[1].replace(/^eq:/, '')})
                </span>
              )}
            </div>
          );
        }

        if (env.startsWith('\\begin{itemize}') || env.startsWith('\\begin{enumerate}')) {
          const isOrdered = env.startsWith('\\begin{enumerate}');
          const inner = env
            .replace(/^\\begin\{(itemize|enumerate)\}|\\end\{(itemize|enumerate)\}$/g, '')
            .trim();
          const items = inner
            .split(/\\item\b/)
            .map((s) => s.trim())
            .filter(Boolean);
          const ListTag = isOrdered ? 'ol' : 'ul';
          return (
            <ListTag
              key={idx}
              onMouseUp={(e) => handleMouseUpOnBlock(env, isOrdered ? 'enumerate' : 'itemize', e)}
              onContextMenu={(e) =>
                handleContextMenuOnBlock(env, isOrdered ? 'enumerate' : 'itemize', e)
              }
              onDoubleClick={(e) =>
                handleDoubleClickOnBlock(env, isOrdered ? 'enumerate' : 'itemize', e)
              }
              className={`my-2.5 pl-5 pr-2 py-1 rounded space-y-1 text-[13.5px] text-[#111827] transition-colors ${
                isOrdered ? 'list-decimal' : 'list-disc'
              } ${
                highlighted
                  ? 'bg-[#0066CC]/[0.06] ring-1 ring-[#0066CC]/30'
                  : 'hover:bg-black/[0.02]'
              }`}
            >
              {items.map((it, iIdx) => (
                <li key={iIdx} className="leading-relaxed">
                  {renderInlineLatex(it, bibMap, onSelectCitation)}
                </li>
              ))}
            </ListTag>
          );
        }

        return null;
      })}
    </div>
  );
};

