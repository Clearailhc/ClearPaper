import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  PRIMITIVES,
  INDUSTRIES,
  OFFICIAL_SEVERITY,
  RULE_PRESETS,
  LEVEL_NAMES,
  aggregateNoisyOr,
  computeFactExposure,
  computeLatentMilPosterior,
  bayesDecision,
  csRpsSingle,
  computeBranchVoi,
  extractBranchLabelsFromText,
  type IndustryId,
} from './src/lib/jevc.ts';
import {
  SCIENTIFIC_FIGURES,
  renderScientificFigureSvg,
  type FigureStyleConfig,
} from './src/lib/figureGenerator.ts';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared server-side Gemini client with required User-Agent header
function getStudioGeminiClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function readJsonSafe<T = any>(relPath: string, fallback: T): T {
  try {
    const full = path.join(__dirname, relPath);
    if (fs.existsSync(full)) {
      return JSON.parse(fs.readFileSync(full, 'utf-8')) as T;
    }
  } catch (err) {
    console.warn(`Failed to read JSON ${relPath}:`, err);
  }
  return fallback;
}

function readTextSafe(relPath: string, fallback = '') {
  try {
    const full = path.join(__dirname, relPath);
    if (fs.existsSync(full)) {
      return fs.readFileSync(full, 'utf-8');
    }
  } catch (err) {
    console.warn(`Failed to read text ${relPath}:`, err);
  }
  return fallback;
}

function writeTextSafe(relPath: string, content: string) {
  const full = path.join(__dirname, relPath);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(full, content, 'utf-8');
}

function computeContentHash(content: string): string {
  return crypto.createHash('sha1').update(content, 'utf-8').digest('hex').slice(0, 12);
}

export interface PaperFileEntry {
  path: string;
  title: string;
  kind: 'tex' | 'bib' | 'md';
  order: number;
}

export interface PaperProjectMeta {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  venue: string;
  deadline: string;
  pageLimit: number;
  status: string;
  rootDir: string;
  files: PaperFileEntry[];
}

export interface SnapshotRecord {
  id: string;
  paperId: string;
  filePath: string;
  fileTitle: string;
  label: string;
  source: 'manual' | 'save' | 'ai-polish' | 'disk-sync';
  createdAt: string;
  content: string;
  words: number;
}

const PAPER_REGISTRY_PATH = 'paper_workspace_registry.json';
const SNAPSHOT_STORE_PATH = 'paper_snapshots_store.json';

const DEFAULT_PAPERS: PaperProjectMeta[] = [
  {
    id: 'paper_c',
    code: 'Paper C',
    title: 'LUX: Recovering Overexposed Visual Facts for Rule-Editable Decisions',
    subtitle: 'Parallel Fact Probing, Verdict Exposure Theory & Editable Noisy-OR Composition',
    venue: 'CVPR 2027',
    deadline: '2026-11-16 AoE',
    pageLimit: 8,
    status: 'Full Draft Complete · V36 Human Eval Ready',
    rootDir: 'paper_c/paper',
    files: [
      { path: 'paper_c/paper/sec/0_abstract.tex', title: '0. Abstract', kind: 'tex', order: 0 },
      { path: 'paper_c/paper/fig/teaser.tex', title: 'Fig 1. Teaser Strip', kind: 'tex', order: 1 },
      { path: 'paper_c/paper/sec/1_intro.tex', title: '1. Introduction', kind: 'tex', order: 2 },
      { path: 'paper_c/paper/sec/2_related.tex', title: '2. Related Work', kind: 'tex', order: 3 },
      { path: 'paper_c/paper/sec/3_theory.tex', title: '3. Overexposure Theory', kind: 'tex', order: 4 },
      { path: 'paper_c/paper/sec/4_method.tex', title: '4. Method: LUX', kind: 'tex', order: 5 },
      { path: 'paper_c/paper/sec/5_experiments.tex', title: '5. Experiments', kind: 'tex', order: 6 },
      { path: 'paper_c/paper/sec/6_discussion.tex', title: '6. Discussion & Limitations', kind: 'tex', order: 7 },
      { path: 'paper_c/paper/sec/X_suppl.tex', title: 'Appendix / Supplementary', kind: 'tex', order: 8 },
      { path: 'paper_c/paper/refs.bib', title: 'References (refs.bib)', kind: 'bib', order: 9 },
      { path: 'paper_c/paper/preamble.tex', title: 'Macros & Preamble (preamble.tex)', kind: 'tex', order: 10 },
      { path: 'paper_c/paper/main.tex', title: 'Master Document (main.tex)', kind: 'tex', order: 11 },
      { path: 'paper_c/paper/rebuttal.tex', title: 'Rebuttal Template', kind: 'tex', order: 12 },
      { path: 'paper_c/docs/findings_summary.md', title: 'Notes: Findings Summary', kind: 'md', order: 13 },
      { path: 'paper_c/docs/method_full_derivation.md', title: 'Notes: Full Derivation', kind: 'md', order: 14 },
    ],
  },
  {
    id: 'paper_a',
    code: 'Paper A',
    title: 'Calibrated Single-Pass Multimodal Event Extraction and Grounding with Counterfactual Visual Negative Training',
    subtitle: 'Top Bidirectional Interaction Block, Soft Trigger Marginalization & Counterfactual Calibration',
    venue: 'CVPR 2027',
    deadline: '2026-11-16 AoE',
    pageLimit: 8,
    status: 'Architecture Fixed · Writing In Progress',
    rootDir: 'paper_a/paper',
    files: [
      { path: 'paper_a/paper/sec/0_abstract.tex', title: '0. Abstract', kind: 'tex', order: 0 },
      { path: 'paper_a/paper/sec/1_intro.tex', title: '1. Introduction', kind: 'tex', order: 1 },
      { path: 'paper_a/paper/sec/2_related.tex', title: '2. Related Work', kind: 'tex', order: 2 },
      { path: 'paper_a/paper/sec/3_method.tex', title: '3. Methodology', kind: 'tex', order: 3 },
      { path: 'paper_a/paper/sec/4_experiments.tex', title: '4. Experiments (M2E2 & SWiG)', kind: 'tex', order: 4 },
      { path: 'paper_a/paper/sec/5_conclusion.tex', title: '5. Conclusion & Limitations', kind: 'tex', order: 5 },
      { path: 'paper_a/paper/refs.bib', title: 'References (refs.bib)', kind: 'bib', order: 6 },
      { path: 'designs/Jev_Industrial_3_Papers_Research_Pack/Paper_A_C_MEE_Multimodal_Event_Extraction.md', title: 'Blueprint: Paper A v2.0 Spec', kind: 'md', order: 7 },
    ],
  },
  {
    id: 'paper_b',
    code: 'Paper B',
    title: 'Overcoming Logical Inertia and Distractor Collapse: Polarity-Orthogonal and Set-Invariant Calibrated Decision Models for Industrial Fault Diagnosis',
    subtitle: 'Householder Polarity Reflection, alpha-Entmax Set Head & Conformal Abstention',
    venue: 'IEEE ICDE 2027 (Industry & Applications)',
    deadline: '2026-12-01 PT',
    pageLimit: 12,
    status: 'Industrial Data Confirmed · Drafting Sections',
    rootDir: 'paper_b/paper',
    files: [
      { path: 'paper_b/paper/sec/0_abstract.tex', title: '0. Abstract', kind: 'tex', order: 0 },
      { path: 'paper_b/paper/sec/1_intro.tex', title: '1. Introduction', kind: 'tex', order: 1 },
      { path: 'paper_b/paper/sec/2_related.tex', title: '2. Related Work', kind: 'tex', order: 2 },
      { path: 'paper_b/paper/sec/3_method.tex', title: '3. Householder & alpha-Entmax Method', kind: 'tex', order: 3 },
      { path: 'paper_b/paper/sec/4_experiments.tex', title: '4. Experiments (DiagnosticIQ & Industrial)', kind: 'tex', order: 4 },
      { path: 'paper_b/paper/sec/5_conclusion.tex', title: '5. Conclusion', kind: 'tex', order: 5 },
      { path: 'paper_b/paper/refs.bib', title: 'References (refs.bib)', kind: 'bib', order: 6 },
      { path: 'designs/Jev_Industrial_3_Papers_Research_Pack/Paper_B_Neuro_Symbolic_Industrial_PHM.md', title: 'Blueprint: Paper B v2.0 Spec', kind: 'md', order: 7 },
    ],
  },
];

function ensurePapersAndFiguresBootstrapped() {
  if (!fs.existsSync(path.join(__dirname, 'paper_a/paper/sec/0_abstract.tex'))) {
    writeTextSafe(
      'paper_a/paper/sec/0_abstract.tex',
      `\\begin{abstract}
Multimodal event extraction (MEE) requires jointly identifying event triggers, textual arguments, and visual argument regions from image-text pairs. Existing pipeline approaches rely on frozen object detectors and suffer from cascading errors, whereas autoregressive multimodal large language models (MLLMs) exhibit severe visual salience hijacking---hallucinating high-confidence events from benign scenes containing salient objects (e.g., police officers or tank trucks in routine traffic). Meanwhile, recent two-stage single-pass text encoders such as CalOn collapse on end-to-end M2E2 extraction (3.6\\% argument F1) due to serial trigger-to-argument error propagation. We propose \\textsc{CalMEE}, a calibrated single-pass multimodal event extraction and detector-free grounding framework built atop early-fusion backbones (Qwen3.5 and Gemma 4). Without altering causal Gated DeltaNet masks inside the backbone, \\textsc{CalMEE} attaches top-level bidirectional interaction layers, marginalizes softly over latent trigger distributions in a single forward pass, and regresses visual argument boxes via learnable spatial slot queries. Crucially, we introduce Counterfactual Visual Negative Training, which pairs event texts with hard normal-scene images and penalizes spurious visual confidence increments $\\Delta_{\\text{vis}}(u, I^{\\text{neg}}) > 0$. On M2E2 and SWiG, \\textsc{CalMEE} surpasses CAMEL in end-to-end multimedia argument F1 while cutting counterfactual visual false positives and expected calibration error (ECE) by over 50\\%.
\\end{abstract}\n`
    );
    writeTextSafe(
      'paper_a/paper/sec/1_intro.tex',
      `\\section{Introduction}
\\label{sec:intro}

Multimodal event extraction (MEE) aims to extract structured event records---triggers, event types, and multimodal argument roles grounded in both text spans and visual bounding boxes---from news and field reports~\\cite{li2020wase,camel2023}. Current paradigms face three structural bottlenecks:
\\begin{itemize}
\\item \\textbf{Detector-bound graph pipelines} (WASE~\\cite{li2020wase}, UniCL~\\cite{unicl2022}, CAMEL~\\cite{camel2023}) depend on pre-extracted Faster R-CNN regions and closed-set classification heads, capping end-to-end Multimedia Argument F1 at 33.2\\%.
\\item \\textbf{Autoregressive VLMs} suffer from \\emph{visual over-interpretation} (visual salience hijacking): seeing a salient entity such as a patrol vehicle in a calm street triggers false-positive \\texttt{Justice:Arrest-Jail} or \\texttt{Transport:Accident} predictions with extreme confidence.
\\item \\textbf{Two-step serial single-pass encoders} such as CalOn~\\cite{calon2026} discard visual inputs on M2E2 and split trigger detection and argument extraction into two serial forward passes, dropping from 30.9\\% Argument F1 (with gold triggers) to 3.6\\% end-to-end.
\\end{itemize}

\\paragraph{Our approach.} We present \\textsc{CalMEE}, which attaches $L_{\\text{bi}}=2\\sim 4$ bidirectional full-attention interaction blocks above the causal Qwen3.5 / Gemma 4 backbone, marginalizes over top-$K$ latent trigger distributions in a single forward pass, and calibrates cross-modal attribution via Counterfactual Visual Negative Training.

\\begin{figure*}[t]
\\centering
\\includegraphics[width=0.98\\textwidth]{fig/calmee_architecture.svg}
\\caption{\\textbf{Overview of \\textsc{CalMEE}.} Top bidirectional interaction layers above a causal early-fusion VLM enable single-pass soft trigger marginalization, spatial slot grounding, and counterfactual visual negative calibration ($\\Delta_{\\text{vis}}(u, I^{\\text{neg}}) \\le 0$).}
\\label{fig:calmee-arch}
\\end{figure*}

\\TBD{Complete Figure 1 ablation callout contrasting Two-Step Serial vs. Single-Pass Soft Marginalization + Counterfactual Visual Negative Calibration.}\n`
    );
    writeTextSafe(
      'paper_a/paper/sec/2_related.tex',
      `\\section{Related Work}
\\label{sec:related}

\\paragraph{Multimodal Event Extraction.} WASE~\\cite{li2020wase}, CLIP-Event, UniCL~\\cite{unicl2022}, and CAMEL~\\cite{camel2023} align textual dependency graphs with Faster R-CNN region proposals on M2E2. UMIE and MMUTF adapt generative MLLMs but incur high token latency and uncalibrated abstention probabilities.

\\paragraph{Schema-Conditioned Single-Pass Extraction.} OneIE and DyGIE++ established joint single-pass extraction in pure text. Recently, CalOn~\\cite{calon2026} and GLiNER2 introduced calibrated schema-conditioned extraction, but CalOn relies on two serial passes and text-only zero-shot transfer on M2E2.\n`
    );
    writeTextSafe(
      'paper_a/paper/sec/3_method.tex',
      `\\section{Methodology}
\\label{sec:method}

\\subsection{Early-Fusion Prefill and Top Bidirectional Interaction Block}
Given dynamic event schemas $\\mathcal{E} = \\{(e_m, d_m^{\\text{ev}}, \\mathcal{R}_m)\\}_{m=1}^M$, text tokens $X$, and visual tokens $V$, we preserve the internal causal masks of the 3:1 hybrid Gated DeltaNet / GQA layers in Qwen3.5 and attach $L_{\\text{bi}}$ unmasked bidirectional interaction blocks on top of the final hidden states $\\mathbf{H}^{(L)}$.

\\subsection{Latent Trigger Soft Marginalization and Spatial Slot Queries}
To eliminate two-step serial error propagation, we apply logit adjustment $z_{0,u}^{\\text{corr}} = z_{0,u}^{\\text{ev}} + \\log(1/\\omega)$ for negative downsampling weight $\\omega$ and marginalize argument role probabilities over the trigger distribution:
\\begin{equation}
P(r = k \\mid u, a) = \\sum_{m: r_k \\in \\mathcal{R}_m} P(e = m \\mid u) \\cdot P(r = k \\mid u, a, \\tilde{\\mathbf{e}}(u)).
\\end{equation}

\\subsection{Counterfactual Visual Negative Calibration}
For each event instance, we pair a hard counterfactual normal scene image $I^{\\text{neg}}$ and penalize spurious visual confidence gains $\\Delta_{\\text{vis}}(u, I^{\\text{neg}}) = \\max(0, p^{(T, I^{\\text{neg}})}(u) - p^{(T, \\varnothing)}(u))$:
\\begin{equation}
\\mathcal{L}_{\\text{total}} = \\mathcal{L}_{\\text{NLL}}^{\\text{adj}} + \\frac{\\beta}{2} \\|\\mathbf{p} - \\mathbf{y}\\|_2^2 + \\lambda_{\\text{cf}} \\sum_{u} \\Delta_{\\text{vis}}(u, I^{\\text{neg}})^2 + \\lambda_{\\text{box}} (\\mathcal{L}_{\\text{L1}} + \\mathcal{L}_{\\text{GIoU}}).
\\end{equation}\n`
    );
    writeTextSafe(
      'paper_a/paper/sec/4_experiments.tex',
      `\\section{Experiments}
\\label{sec:exp}

\\begin{table}[t]\\centering\\small
\\caption{\\textbf{Main results on M2E2} under both standard protocol (ACE2005 + SWiG training) and zero-shot protocol (aligned with CalOn).}
\\label{tab:m2e2}
\\begin{tabular}{llccc}\\toprule
Protocol & Model & Event F1 & Arg F1 (MM) & ECE $\\downarrow$\\\\\\midrule
Zero-Shot (Text) & CalOn-0.6B~\\cite{calon2026} & 9.2 & 3.6 & 0.660\\\\
Standard (MM) & WASE~\\cite{li2020wase} & 52.1 & 28.4 & --\\\\
Standard (MM) & CAMEL~\\cite{camel2023} & 57.5 & 33.2 & --\\\\
Standard (MM) & \\textsc{CalMEE} (Qwen3.5-9B) & \\textbf{60.4} & \\textbf{36.8} & \\textbf{0.048}\\\\\\bottomrule
\\end{tabular}
\\end{table}

\\TBD{Fill final Gemma 4 E4B cross-backbone numbers and SWiG IoU>=0.5 grounding table after 10/24 checkpoint evaluation.}\n`
    );
    writeTextSafe(
      'paper_a/paper/sec/5_conclusion.tex',
      `\\section{Conclusion}
\\label{sec:conclusion}

We presented \\textsc{CalMEE}, unifying single-pass latent trigger marginalization, detector-free spatial slot grounding, and counterfactual visual negative calibration to suppress visual salience hijacking in multimodal event extraction.\n`
    );
    writeTextSafe(
      'paper_a/paper/refs.bib',
      `@inproceedings{li2020wase, author={Manling Li and Alireza Zareian and Qi Zeng and Spencer Whitehead and Di Lu and Heng Ji and Shih-Fu Chang}, title={Cross-media Structured Common Space for Multimedia Event Extraction}, booktitle={ACL}, year={2020}}
@inproceedings{unicl2022, author={Qi Liu and others}, title={UniCL: Unified Contrastive Learning for Multimodal Event Extraction}, booktitle={ACL}, year={2022}}
@article{camel2023, author={Zilin Du and others}, title={CAMEL: Cross-Modal Augmentation and Alignment for Multimedia Event Extraction}, journal={arXiv:2306.08966}, year={2023}}
@article{calon2026, author={CalOn Authors}, title={CalOn: Calibrated One-Step Schema-Conditioned Information Extraction}, journal={arXiv:2610.17113}, year={2026}}\n`
    );
  }

  if (!fs.existsSync(path.join(__dirname, 'paper_b/paper/sec/0_abstract.tex'))) {
    writeTextSafe(
      'paper_b/paper/sec/0_abstract.tex',
      `\\begin{abstract}
Industrial fault diagnosis from sensor rules and maintenance work orders requires evaluating composite Boolean predicates and selecting standard operating procedures (SOPs) from candidate sets. Recent industrial benchmarks (DiagnosticIQ and FailureSensorIQ) expose two critical failure modes in frontier LLMs and single-pass decision models: (1) \\emph{Logical Inertia under Condition Inversion}, where flipping comparison operators ($<\\,\\leftrightarrow\\,>$) causes top models (e.g., Claude-Opus-4.6) to blindly select the original action 63.43\\% of the time with only 20.73\\% correct abstention; and (2) \\emph{Distractor Expansion Collapse}, where expanding candidates from 4 to 10 options causes accuracy to plummet from 60\\% to 5.74\\% with strong option-order bias. We propose \\textsc{PolarSet}, a neuro-symbolic calibrated decision architecture built on Qwen3.5 and ModernBERT. \\textsc{PolarSet} introduces a norm-preserving Householder Polarity Orthogonal Reflection operator $\\mathbf{H}(\\mathbf{u}_{\\text{op}}) = \\mathbf{I} - 2\\mathbf{u}_{\\text{op}}\\mathbf{u}_{\\text{op}}^\\top$ that algebraically separates mutually exclusive comparison predicates in embedding space, paired with a position-reset $\\alpha$-Entmax sparse competitive set head that guarantees 100\\% permutation invariance and exact zeroing of irrelevant distractors. Evaluated on real-world industrial maintenance data, DiagnosticIQ, and FailureSensorIQ, \\textsc{PolarSet} achieves sub-25ms single-pass inference while outperforming frontier LLMs in inversion abstention, 10-option retention, and conformal prediction set size.
\\end{abstract}\n`
    );
    writeTextSafe(
      'paper_b/paper/sec/1_intro.tex',
      `\\section{Introduction}
\\label{sec:intro}

In industrial prognostics and health management (PHM) for chillers, air handling units (AHUs), wind turbines, and rotary compressors, sensor alarm rules such as \\texttt{AHU Running AND (OAT - SAT > 5F) for 2 Hours} trigger automated fault diagnosis and maintenance recommendations~\\cite{diagnosticiq2026,failuresensoriq2025}.

Recent large-scale evaluations reveal two counter-intuitive vulnerabilities:
\\begin{itemize}
\\item \\textbf{Logical Inertia under Operator Inversion:} In DiagnosticIQ-Aug~\\cite{diagnosticiq2026}, inverting comparison operators ($<\\,\\leftrightarrow\\,>$) while adding a \\emph{None of the above} abstention option causes \\texttt{claude-opus-4-6} to repeat the original maintenance action on 63.43\\% of inverted rules. Because \\texttt{Temperature > 80F} and \\texttt{Temperature < 80F} share over 90\\% of their lexical tokens, their pretrained embeddings exhibit cosine similarity $>0.95$ (topological predicate collapse).
\\item \\textbf{Distractor Collapse and Order Sensitivity:} Expanding candidate SOPs from 4 to 10 causes 14 of 29 LLMs on DiagnosticIQ Pro to underperform unsupervised \\texttt{all-mpnet-base-v2} cosine similarity (38.89\\%), while sequence-concatenated pointer heads suffer severe permutation inconsistency (51.48\\% on DiagnosticIQ Pert).
\\end{itemize}

\\begin{figure*}[t]
\\centering
\\includegraphics[width=0.98\\textwidth]{fig/polarset_architecture.svg}
\\caption{\\textbf{Overview of \\textsc{PolarSet}.} Norm-preserving Householder reflection $\\mathbf{H}(\\mathbf{u}_{\\text{op}}) = \\mathbf{I} - 2\\mathbf{u}_{\\text{op}}\\mathbf{u}_{\\text{op}}^\\top$ separates inverted comparison predicates, while position-reset $\\alpha$-Entmax ensures 100\\% permutation invariance across 10+ candidate SOPs.}
\\label{fig:polarset-arch}
\\end{figure*}\n`
    );
    writeTextSafe(
      'paper_b/paper/sec/2_related.tex',
      `\\section{Related Work}
\\label{sec:related}

\\paragraph{Industrial Fault Diagnosis Benchmarks.} DiagnosticIQ~\\cite{diagnosticiq2026}, FailureSensorIQ~\\cite{failuresensoriq2025}, and AssetOpsBench evaluate rule-grounded decision making and conformal uncertainty quantification in industrial engineering.

\\paragraph{Single-Pass Prefill Decision Models.} Laya and Kev demonstrate fast single-token decision probing on ModernBERT and Qwen3.5, but concatenate candidate options sequentially with standard Softmax, suffering from order sensitivity and entropy dilution under large candidate sets.\n`
    );
    writeTextSafe(
      'paper_b/paper/sec/3_method.tex',
      `\\section{Methodology: Householder Polarity Reflection \\& $\\alpha$-Entmax Set Head}
\\label{sec:method}

\\subsection{Householder Polarity Orthogonal Reflection}
Given a DNF sensor rule $\\mathcal{TR}_{\\text{DNF}} = \\bigvee_{k=1}^K \\bigwedge_{j=1}^{m_k} c_{kj}$, we decompose each atomic predicate into a magnitude representation $\\mathbf{h}_{kj}^{\\text{mag}} \\in \\mathbb{R}^D$ and operator polarity $\\text{op}_{kj}$. For mutually inverse operators, we apply the symmetric orthogonal Householder reflection across hyperplane normal $\\mathbf{u}_{\\text{op}}$ ($\\|\\mathbf{u}_{\\text{op}}\\|_2 = 1$):
\\begin{equation}
\\mathbf{H}(\\mathbf{u}_{\\text{op}}) = \\mathbf{I} - 2 \\mathbf{u}_{\\text{op}} \\mathbf{u}_{\\text{op}}^\\top, \\quad \\tilde{\\mathbf{h}}_{kj} = \\mathbf{H}(\\mathbf{u}_{\\text{op}}) \\mathbf{h}_{kj}^{\\text{mag}}.
\\end{equation}
Because $\\mathbf{H}^\\top = \\mathbf{H}$ and $\\mathbf{H}^2 = \\mathbf{I}$, feature norms are strictly preserved ($\\|\\tilde{\\mathbf{h}}_{kj}\\|_2 = \\|\\mathbf{h}_{kj}^{\\text{mag}}\\|_2$) while normal projections flip sign exactly: $\\langle \\tilde{\\mathbf{h}}_{kj}^+, \\mathbf{u}_{\\text{op}} \\rangle = -\\langle \\tilde{\\mathbf{h}}_{kj}^-, \\mathbf{u}_{\\text{op}} \\rangle$.

\\subsection{Position-Reset Parallel Encoding and $\\alpha$-Entmax Sparse Competition}
All $N$ candidate actions $\\{o_1, \\dots, o_N\\}$ reset their RoPE starting index to $L_s + 1$ under a block-diagonal branch mask, and compete via Tsallis $\\alpha$-Entmax~\\cite{peters2019entmax}:
\\begin{equation}
\\mathbf{p} = \\alpha\\text{-}\\operatorname{entmax}(\\mathbf{z}) = \\operatorname*{argmax}_{\\mathbf{p} \\in \\Delta^N} \\left( \\mathbf{p}^\\top \\mathbf{z} + \\mathbf{H}_{\\alpha}^{\\text{Tsallis}}(\\mathbf{p}) \\right),
\\end{equation}
guaranteeing 100\\% permutation equivariance and exact sparse truncation of irrelevant distractors.\n`
    );
    writeTextSafe(
      'paper_b/paper/sec/4_experiments.tex',
      `\\section{Experiments}
\\label{sec:exp}

\\begin{table}[t]\\centering\\small
\\caption{\\textbf{DiagnosticIQ family and Logical Inversion results} across 4-option, 10-option (Pro), Order Permutation (Pert), and Operator Inversion (Aug).}
\\label{tab:diq}
\\begin{tabular}{lcccc}\\toprule
Model & D.IQ & Pro (10-opt) & Pert Consist. & Aug Abstain $\\uparrow$\\\\\\midrule
all-mpnet-base-v2 & 52.73 & 38.89 & 100.0 & 12.40\\\\
claude-opus-4-6~\\cite{diagnosticiq2026} & 73.59 & 59.81 & 68.20 & 20.73\\\\
Qwen3-8B SFT~\\cite{diagnosticiq2026} & 72.12 & 54.10 & 51.48 & 18.90\\\\
\\textsc{PolarSet} (Qwen3.5-4B) & \\textbf{78.40} & \\textbf{68.90} & \\textbf{100.0} & \\textbf{84.60}\\\\\\bottomrule
\\end{tabular}
\\end{table}

\\TBD{Add Table 5 with proprietary industrial work-order dataset evaluation and expert Cohen's kappa verification.}\n`
    );
    writeTextSafe(
      'paper_b/paper/sec/5_conclusion.tex',
      `\\section{Conclusion}
\\label{sec:conclusion}

\\textsc{PolarSet} resolves operator-inversion logical inertia and multi-distractor collapse in neuro-symbolic industrial fault diagnosis via Householder orthogonal reflection and position-reset $\\alpha$-Entmax set competition.\n`
    );
    writeTextSafe(
      'paper_b/paper/refs.bib',
      `@article{diagnosticiq2026, author={IBM Research and RPI}, title={DiagnosticIQ: Benchmarking Rule-Grounded Industrial Fault Diagnosis}, journal={arXiv:2605.08614}, year={2026}}
@inproceedings{failuresensoriq2025, author={IBM Research}, title={FailureSensorIQ: Multi-Choice Sensor Failure Reasoning Benchmark}, booktitle={NeurIPS Datasets and Benchmarks}, year={2025}}
@inproceedings{peters2019entmax, author={Ben Peters and Vlad Niculae and Andre F. T. Martins}, title={Sparse Sequence-to-Sequence Models}, booktitle={ACL}, year={2019}}\n`
    );
  }

  // Ensure default SVG scientific figures are generated on disk so \includegraphics works immediately
  for (const figSpec of SCIENTIFIC_FIGURES) {
    const paperRoot = figSpec.paperId === 'paper_c' ? 'paper_c/paper' : figSpec.paperId === 'paper_a' ? 'paper_a/paper' : 'paper_b/paper';
    const svgRelPath = `${paperRoot}/fig/${figSpec.fileName}`;
    if (!fs.existsSync(path.join(__dirname, svgRelPath))) {
      const svgContent = renderScientificFigureSvg(figSpec.id);
      writeTextSafe(svgRelPath, svgContent);
    }
  }
}

function loadPaperRegistry(): PaperProjectMeta[] {
  ensurePapersAndFiguresBootstrapped();
  const saved = readJsonSafe<PaperProjectMeta[] | null>(PAPER_REGISTRY_PATH, null);
  if (Array.isArray(saved) && saved.length > 0) {
    return saved;
  }
  writeTextSafe(PAPER_REGISTRY_PATH, JSON.stringify(DEFAULT_PAPERS, null, 2));
  return DEFAULT_PAPERS;
}

function savePaperRegistry(papers: PaperProjectMeta[]) {
  writeTextSafe(PAPER_REGISTRY_PATH, JSON.stringify(papers, null, 2));
}

function loadSnapshots(): SnapshotRecord[] {
  return readJsonSafe<SnapshotRecord[]>(SNAPSHOT_STORE_PATH, []);
}

function saveSnapshots(list: SnapshotRecord[]) {
  // Keep latest 120 snapshots to avoid unbounded growth
  const trimmed = list.slice(0, 120);
  writeTextSafe(SNAPSHOT_STORE_PATH, JSON.stringify(trimmed, null, 2));
}

function countWordsInTex(content: string): number {
  return content
    .replace(/%.*$/gm, '')
    .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?/g, ' ')
    .replace(/[{}~^_$&]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function recordSnapshot(
  paperId: string,
  filePath: string,
  fileTitle: string,
  content: string,
  label: string,
  source: SnapshotRecord['source'] = 'save'
): SnapshotRecord {
  const list = loadSnapshots();
  // Avoid duplicate consecutive snapshot with identical content
  const latestSameFile = list.find((s) => s.paperId === paperId && s.filePath === filePath);
  if (latestSameFile && latestSameFile.content === content && source !== 'manual') {
    return latestSameFile;
  }
  const snap: SnapshotRecord = {
    id: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    paperId,
    filePath,
    fileTitle,
    label,
    source,
    createdAt: new Date().toISOString(),
    content,
    words: countWordsInTex(content),
  };
  list.unshift(snap);
  saveSnapshots(list);
  return snap;
}

function parseBibtexEntries(bibContent: string) {
  const entries: { key: string; type: string; author: string; title: string; venue: string; year: string; raw: string }[] = [];
  const regex = /@(\w+)\s*\{\s*([^,\s]+)\s*,([\s\S]*?)(?=\n@\w+\s*\{|$)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(bibContent)) !== null) {
    const type = match[1].toLowerCase();
    const key = match[2].trim();
    const body = match[3];
    const extractField = (f: string) => {
      const m = new RegExp(`${f}\\s*=\\s*\\{([\\s\\S]*?)\\}(?=\\s*,|\\s*\\}|\\s*$)`, 'i').exec(body);
      return m ? m[1].replace(/[{}]/g, '').replace(/\s+/g, ' ').trim() : '';
    };
    entries.push({
      key,
      type,
      author: extractField('author'),
      title: extractField('title'),
      venue: extractField('booktitle') || extractField('journal') || extractField('publisher') || 'Preprint',
      year: extractField('year'),
      raw: match[0].trim(),
    });
  }
  return entries;
}

/**
 * Dual-Channel AI Execution Helper
 * Channel 1: 'studio' -> @google/genai SDK (process.env.GEMINI_API_KEY)
 * Channel 2: 'openai' -> Universal OpenAI-compatible HTTP endpoint (process.env.OPENAI_BASE_URL)
 */
async function callDualChannelAI(params: {
  channel: 'studio' | 'openai';
  modelName?: string;
  openaiBaseUrl?: string;
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
}): Promise<{ text: string; channelUsed: 'studio' | 'openai'; modelUsed: string; note?: string }> {
  const { channel, modelName, openaiBaseUrl, systemPrompt, userPrompt, jsonMode } = params;

  if (channel === 'openai') {
    const baseUrl = (openaiBaseUrl || process.env.OPENAI_BASE_URL || 'http://localhost:8000/v1').replace(/\/+$/, '');
    const apiKey = process.env.OPENAI_API_KEY || 'EMPTY';
    const targetModel = modelName || process.env.OPENAI_MODEL || 'Qwen3.5-122B-A10B';

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 18000);
      const resp = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!resp.ok) {
        const errBody = await resp.text();
        throw new Error(`OpenAI endpoint HTTP ${resp.status}: ${errBody.slice(0, 200)}`);
      }
      const data = (await resp.json()) as any;
      const content = data?.choices?.[0]?.message?.content || '';
      if (content) {
        return {
          text: content,
          channelUsed: 'openai',
          modelUsed: targetModel,
        };
      }
      throw new Error('Empty response from OpenAI-compatible endpoint');
    } catch (openaiErr: any) {
      // Automatically fall back to Built-in Studio Gemini if OpenAI endpoint is unreachable in cloud preview
      if (process.env.GEMINI_API_KEY) {
        const ai = getStudioGeminiClient();
        const fallbackModel = 'gemini-3.8-flash';
        const response = await ai.models.generateContent({
          model: fallbackModel,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3,
            ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
          },
        });
        return {
          text: response.text || '',
          channelUsed: 'studio',
          modelUsed: fallbackModel,
          note: `OpenAI endpoint (${baseUrl}) unreachable in cloud container (${openaiErr?.message || 'connection refused'}); automatically routed via Built-in Studio Gemini.`,
        };
      }
      throw openaiErr;
    }
  }

  // Default Channel: Studio Built-in Gemini
  const studioModel =
    modelName && modelName.startsWith('gemini-') && modelName !== 'gemini-4-argon'
      ? modelName
      : 'gemini-3.8-flash';
  const ai = getStudioGeminiClient();
  const response = await ai.models.generateContent({
    model: studioModel,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.3,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
  });

  return {
    text: response.text || '',
    channelUsed: 'studio',
    modelUsed: studioModel,
  };
}

async function detectTexEngines() {
  const localTectonic = path.join(__dirname, '.bin/tectonic');
  const hasLocalTectonic = fs.existsSync(localTectonic);
  let systemTectonic = '';
  let systemPdflatex = '';
  let systemBibtex = '';

  try {
    const { stdout } = await execAsync('which tectonic || true');
    systemTectonic = stdout.trim();
  } catch {}
  try {
    const { stdout } = await execAsync('which pdflatex || true');
    systemPdflatex = stdout.trim();
  } catch {}
  try {
    const { stdout } = await execAsync('which bibtex || true');
    systemBibtex = stdout.trim();
  } catch {}

  const tectonicPath = hasLocalTectonic ? localTectonic : systemTectonic;
  return {
    hasNativeCompiler: Boolean(tectonicPath || systemPdflatex),
    tectonicPath: tectonicPath || null,
    pdflatexPath: systemPdflatex || null,
    bibtexPath: systemBibtex || null,
    preferredEngine: tectonicPath ? 'tectonic' : systemPdflatex ? 'pdflatex' : 'katex-simulation',
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  ensurePapersAndFiguresBootstrapped();

  // API: Multi-Paper Writing Studio - List all papers, files, contents, hashes, and metrics
  app.get('/api/papers', (_req, res) => {
    const registry = loadPaperRegistry();
    const papersWithContent = registry.map((paper) => {
      const filesWithData = paper.files
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((f) => {
          const content = readTextSafe(f.path, '');
          const fullPath = path.join(__dirname, f.path);
          const mtimeMs = fs.existsSync(fullPath) ? fs.statSync(fullPath).mtimeMs : Date.now();
          const words = countWordsInTex(content);
          const tbdMatches = content.match(/\\TBD\{[^}]*\}/g) || [];
          const figMatches = content.match(/\\FIG\{[^}]*\}/g) || [];
          return {
            ...f,
            content,
            hash: computeContentHash(content),
            mtimeMs,
            words,
            chars: content.length,
            tbdCount: tbdMatches.length,
            figCount: figMatches.length,
          };
        });

      const bibFile = filesWithData.find((f) => f.kind === 'bib');
      const bibEntries = bibFile ? parseBibtexEntries(bibFile.content) : [];

      const coreTexFiles = filesWithData.filter(
        (f) =>
          f.kind === 'tex' &&
          !f.path.endsWith('main.tex') &&
          !f.path.endsWith('preamble.tex') &&
          !f.path.endsWith('rebuttal.tex') &&
          !f.path.endsWith('X_suppl.tex')
      );
      const totalWords = coreTexFiles.reduce((acc, f) => acc + f.words, 0);
      const totalTbds = filesWithData.reduce((acc, f) => acc + f.tbdCount, 0);
      const totalFigs = filesWithData.reduce((acc, f) => acc + f.figCount, 0);
      const estimatedPages = Number((totalWords / 680 + 1.4).toFixed(2));

      return {
        ...paper,
        files: filesWithData,
        bibEntries,
        stats: {
          totalWords,
          totalTbds,
          totalFigs,
          estimatedPages,
        },
      };
    });

    const masterPlan = readTextSafe(
      'designs/Jev_Industrial_3_Papers_Research_Pack/00_Master_Plan_and_Shared_Codebase.md',
      ''
    );

    res.json({
      papers: papersWithContent,
      masterPlan,
    });
  });

  // API: Disk Change Status Check (for seamless multi-turn collaboration with AI Studio chat)
  app.get('/api/papers/:paperId/disk-status', (req, res) => {
    const { paperId } = req.params;
    const registry = loadPaperRegistry();
    const paper = registry.find((p) => p.id === paperId);
    if (!paper) {
      res.status(404).json({ error: `Paper ${paperId} not found` });
      return;
    }

    const fileStates = paper.files.map((f) => {
      const content = readTextSafe(f.path, '');
      const fullPath = path.join(__dirname, f.path);
      const mtimeMs = fs.existsSync(fullPath) ? fs.statSync(fullPath).mtimeMs : 0;
      return {
        path: f.path,
        title: f.title,
        hash: computeContentHash(content),
        mtimeMs,
        words: countWordsInTex(content),
        content,
      };
    });

    res.json({
      paperId,
      checkedAt: new Date().toISOString(),
      files: fileStates,
    });
  });

  // API: Save edited file content to disk + auto-snapshot
  app.put('/api/papers/:paperId/files', (req, res) => {
    const { paperId } = req.params;
    const { filePath, content, snapshotLabel, snapshotSource = 'save' } = req.body || {};
    if (!filePath || typeof content !== 'string') {
      res.status(400).json({ error: 'filePath and string content are required' });
      return;
    }
    const normalized = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
    writeTextSafe(normalized, content);

    const registry = loadPaperRegistry();
    const paper = registry.find((p) => p.id === paperId);
    const fileMeta = paper?.files.find((f) => f.path === normalized);

    const snap = recordSnapshot(
      paperId,
      normalized,
      fileMeta?.title || path.basename(normalized),
      content,
      snapshotLabel || `Saved ${fileMeta?.title || path.basename(normalized)}`,
      snapshotSource
    );

    res.json({
      ok: true,
      filePath: normalized,
      hash: computeContentHash(content),
      savedAt: new Date().toISOString(),
      bytes: Buffer.byteLength(content, 'utf-8'),
      snapshot: snap,
    });
  });

  // API: Batch save multiple modified section files in one transaction from Continuous Manuscript Stream
  app.put('/api/papers/:paperId/files-batch', (req, res) => {
    const { paperId } = req.params;
    const { files, snapshotLabel, snapshotSource = 'save' } = req.body || {};
    if (!Array.isArray(files) || files.length === 0) {
      res.status(400).json({ error: 'files array is required' });
      return;
    }

    const registry = loadPaperRegistry();
    const paper = registry.find((p) => p.id === paperId);
    const savedResults: { filePath: string; hash: string; bytes: number }[] = [];
    const createdSnapshots: SnapshotRecord[] = [];

    for (const item of files) {
      if (!item?.filePath || typeof item?.content !== 'string') continue;
      const normalized = path.normalize(item.filePath).replace(/^(\.\.(\/|\\|$))+/, '');
      writeTextSafe(normalized, item.content);
      const fileMeta = paper?.files.find((f) => f.path === normalized);
      const snap = recordSnapshot(
        paperId,
        normalized,
        fileMeta?.title || path.basename(normalized),
        item.content,
        snapshotLabel || `Stream saved ${fileMeta?.title || path.basename(normalized)}`,
        snapshotSource
      );
      savedResults.push({
        filePath: normalized,
        hash: computeContentHash(item.content),
        bytes: Buffer.byteLength(item.content, 'utf-8'),
      });
      createdSnapshots.push(snap);
    }

    res.json({
      ok: true,
      savedCount: savedResults.length,
      savedAt: new Date().toISOString(),
      files: savedResults,
      snapshots: createdSnapshots,
    });
  });

  // API: Get and create Version Snapshots for a Paper
  app.get('/api/papers/:paperId/snapshots', (req, res) => {
    const { paperId } = req.params;
    const all = loadSnapshots().filter((s) => s.paperId === paperId);
    res.json({ snapshots: all });
  });

  app.post('/api/papers/:paperId/snapshots', (req, res) => {
    const { paperId } = req.params;
    const { filePath, fileTitle, content, label } = req.body || {};
    if (!filePath || typeof content !== 'string') {
      res.status(400).json({ error: 'filePath and content are required' });
      return;
    }
    const snap = recordSnapshot(
      paperId,
      filePath,
      fileTitle || path.basename(filePath),
      content,
      label || 'Manual Milestone Snapshot',
      'manual'
    );
    res.json({ ok: true, snapshot: snap });
  });

  // API: Create a new section file inside a paper project
  app.post('/api/papers/:paperId/files', (req, res) => {
    const { paperId } = req.params;
    const { title, fileName, kind = 'tex', initialContent } = req.body || {};
    const registry = loadPaperRegistry();
    const paper = registry.find((p) => p.id === paperId);
    if (!paper) {
      res.status(404).json({ error: `Paper ${paperId} not found` });
      return;
    }

    const cleanName = (fileName || 'new_section.tex').replace(/[^a-zA-Z0-9_.-]/g, '_');
    const subFolder = kind === 'tex' ? 'sec/' : '';
    const relPath = `${paper.rootDir}/${subFolder}${cleanName}`;
    const defaultBody =
      initialContent ??
      `\\section{${title || 'New Section'}}\n\\label{sec:${cleanName.replace(/\.tex$/, '')}}\n\nWrite your section content here...\n`;

    writeTextSafe(relPath, defaultBody);

    if (!paper.files.some((f) => f.path === relPath)) {
      paper.files.push({
        path: relPath,
        title: title || cleanName,
        kind: kind as 'tex' | 'bib' | 'md',
        order: paper.files.length,
      });
      savePaperRegistry(registry);
    }

    res.json({ ok: true, path: relPath });
  });

  // API: Create a new Paper Project in the Workspace
  app.post('/api/papers', (req, res) => {
    const { code, title, subtitle, venue, deadline, pageLimit = 8 } = req.body || {};
    const registry = loadPaperRegistry();
    const slug = `paper_${(code || `p${registry.length + 1}`).toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;
    const rootDir = `${slug}/paper`;

    const files: PaperFileEntry[] = [
      { path: `${rootDir}/sec/0_abstract.tex`, title: '0. Abstract', kind: 'tex', order: 0 },
      { path: `${rootDir}/sec/1_intro.tex`, title: '1. Introduction', kind: 'tex', order: 1 },
      { path: `${rootDir}/sec/2_related.tex`, title: '2. Related Work', kind: 'tex', order: 2 },
      { path: `${rootDir}/sec/3_method.tex`, title: '3. Method', kind: 'tex', order: 3 },
      { path: `${rootDir}/sec/4_experiments.tex`, title: '4. Experiments', kind: 'tex', order: 4 },
      { path: `${rootDir}/sec/5_conclusion.tex`, title: '5. Conclusion', kind: 'tex', order: 5 },
      { path: `${rootDir}/refs.bib`, title: 'References (refs.bib)', kind: 'bib', order: 6 },
    ];

    writeTextSafe(
      `${rootDir}/sec/0_abstract.tex`,
      `\\begin{abstract}\nDraft abstract for ${title || 'New Paper'}. State the core problem, theoretical insight, method, and quantitative results.\n\\end{abstract}\n`
    );
    writeTextSafe(
      `${rootDir}/sec/1_intro.tex`,
      `\\section{Introduction}\n\\label{sec:intro}\n\nIntroduce the problem context and key contributions.\n`
    );
    writeTextSafe(
      `${rootDir}/sec/2_related.tex`,
      `\\section{Related Work}\n\\label{sec:related}\n\nDiscuss prior literature and contrast with our approach.\n`
    );
    writeTextSafe(
      `${rootDir}/sec/3_method.tex`,
      `\\section{Methodology}\n\\label{sec:method}\n\nFormulate the mathematical model and training objective.\n`
    );
    writeTextSafe(
      `${rootDir}/sec/4_experiments.tex`,
      `\\section{Experiments}\n\\label{sec:exp}\n\nPresent benchmark evaluations and ablation studies.\n`
    );
    writeTextSafe(
      `${rootDir}/sec/5_conclusion.tex`,
      `\\section{Conclusion}\n\\label{sec:conclusion}\n\nSummarize findings, limitations, and future directions.\n`
    );
    writeTextSafe(`${rootDir}/refs.bib`, `% BibTeX references for ${title}\n`);

    const newPaper: PaperProjectMeta = {
      id: slug,
      code: code || `Paper ${registry.length + 1}`,
      title: title || 'Untitled Research Manuscript',
      subtitle: subtitle || 'Research Manuscript Draft',
      venue: venue || 'CVPR 2027',
      deadline: deadline || '2026-11-16 AoE',
      pageLimit: Number(pageLimit) || 8,
      status: 'New Draft Initialized',
      rootDir,
      files,
    };

    registry.push(newPaper);
    savePaperRegistry(registry);
    res.json({ ok: true, paper: newPaper });
  });

  // ============================================================================
  // API: Dual-Channel AI Gateway (Studio Gemini + Universal OpenAI-Compatible)
  // ============================================================================
  app.get('/api/ai/channels', (_req, res) => {
    res.json({
      studioAvailable: Boolean(process.env.GEMINI_API_KEY),
      studioModels: [
        { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (Studio Built-in · Fast Academic Polish)' },
        { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite (Low-Latency Proofreading)' },
      ],
      openaiConfig: {
        baseUrl: process.env.OPENAI_BASE_URL || 'http://localhost:8000/v1',
        defaultModel: process.env.OPENAI_MODEL || 'Qwen3.5-122B-A10B',
        presets: [
          { id: 'Qwen3.5-122B-A10B', label: 'vLLM · Qwen3.5-122B-A10B (H20 Cluster)' },
          { id: 'Qwen3.8-27B', label: 'vLLM · Qwen3.8-27B-Instruct' },
          { id: 'deepseek-r1', label: 'OpenAI-Compatible · DeepSeek-R1 / V3' },
          { id: 'gpt-5.4', label: 'OpenAI-Compatible · GPT-5.4 / o3' },
        ],
      },
    });
  });

  // ============================================================================
  // File-System Agent Helpers: Scan Project Directory & Retrieve Relevant Context
  // ============================================================================
  interface WorkspaceFileItem {
    name: string;
    relPath: string;
    ext: string;
    category: 'manuscript' | 'config' | 'experiment' | 'figure';
    sizeBytes: number;
    updatedAt: string;
    url: string;
  }

  function scanPaperWorkspaceFiles(paper: PaperProjectMeta): WorkspaceFileItem[] {
    const projectBaseDir = path.dirname(paper.rootDir); // e.g., 'paper_c'
    const items: WorkspaceFileItem[] = [];
    const visited = new Set<string>();

    const walkDir = (relDir: string, depth = 0) => {
      if (depth > 3) return;
      const fullDir = path.join(__dirname, relDir);
      if (!fs.existsSync(fullDir)) return;
      let entries: fs.Dirent[] = [];
      try {
        entries = fs.readdirSync(fullDir, { withFileTypes: true });
      } catch {
        return;
      }

      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'kit_reference') {
          continue;
        }
        const childRel = path.join(relDir, entry.name);
        if (entry.isDirectory()) {
          walkDir(childRel, depth + 1);
        } else if (entry.isFile()) {
          if (visited.has(childRel)) continue;
          visited.add(childRel);
          const ext = path.extname(entry.name).toLowerCase();
          const stat = fs.statSync(path.join(__dirname, childRel));

          let category: WorkspaceFileItem['category'] = 'experiment';
          if (childRel.includes('/sec/') && ext === '.tex') {
            category = 'manuscript';
          } else if (ext === '.tex' || ext === '.bib' || ext === '.sty' || ext === '.bst') {
            category = 'config';
          } else if (['.svg', '.png', '.jpg', '.jpeg', '.webp', '.pdf'].includes(ext)) {
            category = 'figure';
          } else if (['.md', '.json', '.csv', '.txt'].includes(ext)) {
            category = 'experiment';
          } else {
            continue;
          }

          items.push({
            name: entry.name,
            relPath: childRel,
            ext,
            category,
            sizeBytes: stat.size,
            updatedAt: new Date(stat.mtimeMs).toISOString(),
            url: `/api/assets/raw?path=${encodeURIComponent(childRel)}&t=${Math.floor(stat.mtimeMs)}`,
          });
        }
      }
    };

    walkDir(projectBaseDir, 0);
    return items;
  }

  function buildAgentFileSystemContext(
    paper: PaperProjectMeta,
    queryText: string,
    pinnedFiles: string[] = []
  ): { contextBlock: string; matchedFiles: string[] } {
    const allFiles = scanPaperWorkspaceFiles(paper);
    const pinnedSet = new Set(pinnedFiles);
    const queryLower = queryText.toLowerCase();
    const keywords = queryLower
      .split(/[^a-z0-9_\u4e00-\u9fa5]+/)
      .filter((w) => w.length >= 2);

    // Score experiment/docs/bib files by relevance to user prompt or @mention
    const candidateFiles = allFiles.filter(
      (f) =>
        (f.category === 'experiment' || f.ext === '.bib') &&
        f.sizeBytes < 120000
    );

    const scored = candidateFiles.map((f) => {
      let score = 0;
      const nameLower = f.name.toLowerCase();
      const pathLower = f.relPath.toLowerCase();

      if (pinnedSet.has(f.relPath) || pinnedSet.has(f.name)) {
        score += 100;
      }
      if (queryLower.includes(nameLower) || queryLower.includes(nameLower.replace(/\.[^.]+$/, ''))) {
        score += 50;
      }
      if (nameLower.includes('findings') || nameLower.includes('summary') || nameLower.includes('inspecsafe_report')) {
        score += 8;
      }
      if (f.ext === '.bib' && (queryLower.includes('cite') || queryLower.includes('引用') || queryLower.includes('文献'))) {
        score += 30;
      }
      for (const kw of keywords) {
        if (pathLower.includes(kw)) score += 6;
      }
      return { file: f, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.filter((s) => s.score > 0).slice(0, 4).map((s) => s.file);

    // Always include a lightweight directory index + top matched file contents
    const figList = allFiles
      .filter((f) => f.category === 'figure')
      .map((f) => f.relPath)
      .slice(0, 15)
      .join(', ');

    const snippets: string[] = [];
    const matchedPaths: string[] = [];

    for (const mf of topMatches) {
      const raw = readTextSafe(mf.relPath, '');
      if (raw) {
        matchedPaths.push(mf.relPath);
        snippets.push(`--- FILE: ${mf.relPath} ---\n${raw.slice(0, 3200)}`);
      }
    }

    const contextBlock = `[Workspace File-System Agent Context (${paper.code})]
Available Figures in Project: ${figList || 'None'}
${snippets.length > 0 ? `\nRelevant Project Files Retrieved Automatically:\n${snippets.join('\n\n')}` : ''}`;

    return { contextBlock, matchedFiles: matchedPaths };
  }

  // API: Get Unified Project File Tree (tex, figures, bib, experimental records & docs)
  app.get('/api/workspace/:paperId/tree', (req, res) => {
    const { paperId } = req.params;
    const registry = loadPaperRegistry();
    const paper = registry.find((p) => p.id === paperId) || registry[0];
    const items = scanPaperWorkspaceFiles(paper);
    res.json({
      paperId: paper.id,
      rootDir: paper.rootDir,
      projectDir: path.dirname(paper.rootDir),
      items,
    });
  });

  // API: Read or Save Any Text File in the Paper Workspace (.tex, .bib, .md, .json, .csv)
  app.get('/api/workspace/:paperId/file', (req, res) => {
    const relPath = String(req.query.path || '');
    const normalized = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.join(__dirname, normalized);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      res.status(404).json({ error: 'File not found' });
      return;
    }
    const content = readTextSafe(normalized, '');
    res.json({
      relPath: normalized,
      name: path.basename(normalized),
      ext: path.extname(normalized).toLowerCase(),
      content,
    });
  });

  app.put('/api/workspace/:paperId/file', (req, res) => {
    const { relPath, content } = req.body || {};
    if (!relPath || typeof content !== 'string') {
      res.status(400).json({ error: 'relPath and content are required' });
      return;
    }
    const normalized = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, '');
    writeTextSafe(normalized, content);
    res.json({
      ok: true,
      relPath: normalized,
      savedAt: new Date().toISOString(),
    });
  });

  // API: AI Academic Polish & File-System Context Agent
  app.post('/api/ai/polish', async (req, res) => {
    try {
      const {
        paperId = 'paper_c',
        sectionTitle = '',
        selectedText = '',
        mode = 'cvpr_polish',
        customPrompt = '',
        pinnedFiles = [],
        channel = 'studio',
        modelName = '',
        openaiBaseUrl = '',
      } = req.body || {};

      if (!selectedText || !selectedText.trim()) {
        res.status(400).json({ error: 'Please select or provide LaTeX text to polish.' });
        return;
      }

      const registry = loadPaperRegistry();
      const paper = registry.find((p) => p.id === paperId) || registry[0];
      const { contextBlock, matchedFiles } = buildAgentFileSystemContext(
        paper,
        `${customPrompt} ${sectionTitle} ${selectedText.slice(0, 600)}`,
        Array.isArray(pinnedFiles) ? pinnedFiles : []
      );

      const modeInstructions: Record<string, string> = {
        polish:
          'Polish this LaTeX passage for academic publication clarity, conciseness, active scholarly voice, and mathematical flow. Preserve ALL LaTeX commands (\\cite, \\cref, custom macros, equations, and quantitative metrics) strictly intact.',
        condense:
          'Condense this LaTeX passage by ~20% to tighten academic pacing while keeping 100% of the empirical numbers, citations (\\cite{...}), labels, and mathematical definitions intact.',
        rewrite:
          'Rewrite and restructure this LaTeX passage to improve logical flow, transition clarity, and readability while preserving all LaTeX citations, equations, and factual claims.',
        cvpr_polish:
          'Polish this LaTeX passage for academic publication clarity, conciseness, active scholarly voice, and mathematical flow. Preserve ALL LaTeX commands (\\cite, \\cref, custom macros, equations, and quantitative metrics) strictly intact.',
        compress_20:
          'Condense this LaTeX passage by ~20% to tighten academic pacing while keeping 100% of the empirical numbers, citations (\\cite{...}), labels, and mathematical definitions intact.',
        reviewer_defense:
          'Strengthen the argumentative rigor of this passage and preserve all LaTeX citations and numbers.',
        zh_to_en_academic:
          'Translate any Chinese drafting notes or mixed Chinese-English sentences into idiomatic, publication-ready LaTeX academic English, keeping all LaTeX environments, macros, and citations intact.',
        citation_match:
          'Analyze the selected LaTeX passage and the provided refs.bib entries in the Workspace Context. Insert appropriate \\cite{...} keys at the exact claims where prior work or baselines are discussed, and refine the academic phrasing. Do not invent citation keys that are not in refs.bib.',
        data_sync:
          'Cross-check all quantitative numbers, tables, and empirical claims in this LaTeX passage against the retrieved experimental logs in the Workspace Context. Update any outdated or placeholder numbers (\\TBD{...}) with verified metrics.',
        custom:
          customPrompt ||
          'Refine the provided LaTeX passage according to the author instruction and grounded project files while preserving macros and citations.',
      };

      const systemPrompt = `You are a Principal Academic LaTeX Editor and File-System-Aware Research Agent working on ${paper.code} (${paper.title}, section: ${sectionTitle}).
You have direct read access to the paper's Git repository files (experimental records, documentation, figures, and citations in refs.bib).
When the author asks to update numbers, verify claims, cite papers, or incorporate experimental conclusions, ground your LaTeX edits strictly in the provided Workspace File-System Context.
Return ONLY a valid JSON object with two keys:
1. "polishedText": The revised LaTeX source code (do NOT wrap in markdown code fences).
2. "rationale": A concise 1-2 sentence summary (in Chinese) explaining the key improvements and any project files referenced.`;

      const userPrompt = `${contextBlock}

Task Instruction: ${modeInstructions[mode] || modeInstructions.polish}
${customPrompt && mode !== 'custom' ? `Additional Author Note: ${customPrompt}\n` : ''}
Original LaTeX Passage:
${selectedText}`;

      const aiResult = await callDualChannelAI({
        channel: channel === 'openai' ? 'openai' : 'studio',
        modelName,
        openaiBaseUrl,
        systemPrompt,
        userPrompt,
        jsonMode: true,
      });

      let polishedText = selectedText;
      let rationale = '已完成学术润色并同步工程上下文。';

      try {
        const cleanedJson = aiResult.text
          .replace(/^```json\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim();
        const parsed = JSON.parse(cleanedJson);
        if (typeof parsed.polishedText === 'string' && parsed.polishedText.trim()) {
          polishedText = parsed.polishedText;
        } else if (typeof parsed.revisedLatex === 'string' && parsed.revisedLatex.trim()) {
          polishedText = parsed.revisedLatex;
        }
        if (typeof parsed.rationale === 'string' && parsed.rationale.trim()) {
          rationale = parsed.rationale;
        } else if (typeof parsed.explanation === 'string' && parsed.explanation.trim()) {
          rationale = parsed.explanation;
        }
      } catch {
        const rawStripped = aiResult.text
          .replace(/^```(?:latex|tex)?\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim();
        if (rawStripped) {
          polishedText = rawStripped;
        }
      }

      const wordsBefore = countWordsInTex(selectedText);
      const wordsAfter = countWordsInTex(polishedText);

      res.json({
        ok: true,
        originalText: selectedText,
        polishedText,
        revisedLatex: polishedText,
        rationale,
        explanation: rationale,
        wordsBefore,
        wordsAfter,
        matchedFiles,
        channelUsed: aiResult.channelUsed,
        modelUsed: aiResult.modelUsed,
        note: aiResult.note,
      });
    } catch (err: any) {
      console.error('AI Polish error:', err);
      res.status(500).json({
        error: err?.message || 'AI polishing request failed.',
      });
    }
  });

  // API: AI Scientific Diagram / Figure Generator & Multi-Turn Editor (SVG + LaTeX Wrapper)
  app.post('/api/ai/generate-figure', async (req, res) => {
    try {
      const {
        paperId = 'paper_c',
        prompt = '',
        existingSvg = '',
        fileName = '',
        caption = '',
        span = 'double',
        channel = 'studio',
        modelName = '',
        openaiBaseUrl = '',
      } = req.body || {};

      if (!prompt.trim()) {
        res.status(400).json({ error: 'Please provide a description or modification instruction for the figure.' });
        return;
      }

      const systemPrompt = `You are an expert CVPR / IEEE scientific illustrator creating clean, publication-grade vector SVG figures for academic LaTeX papers.
Generate a complete, valid, self-contained <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 280" width="100%" height="100%">...</svg> diagram.
Design rules:
- Use a crisp white/warm-paper background (#FFFFFF / #F8F9FA), slate borders (#CBD5E1), CVPR cobalt blue (#1E3A8A), emerald green (#059669), and crimson (#DC2626) accents.
- Include clear panel labels (a), (b), (c), mathematical notation, directional arrows, and quantitative callouts.
- Return ONLY a JSON object with keys:
  "svg": The complete <svg>...</svg> markup string,
  "suggestedCaption": A LaTeX \\caption{...} string,
  "summary": A 1-sentence summary in Chinese of what was drawn or modified.`;

      const userPrompt = `Paper ID: ${paperId}
Author Instruction: ${prompt}
${existingSvg ? `\nCurrent SVG to modify/refine:\n${existingSvg.slice(0, 6000)}` : ''}`;

      const aiResult = await callDualChannelAI({
        channel: channel === 'openai' ? 'openai' : 'studio',
        modelName,
        openaiBaseUrl,
        systemPrompt,
        userPrompt,
        jsonMode: true,
      });

      let svgOut = '';
      let suggestedCaption = caption || '\\textbf{Generated scientific diagram.} Overview of the proposed mechanism.';
      let summary = '已根据您的描述生成科研矢量配图。';

      try {
        const cleaned = aiResult.text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.svg && parsed.svg.includes('<svg')) {
          svgOut = parsed.svg;
        }
        if (parsed.suggestedCaption) {
          suggestedCaption = parsed.suggestedCaption;
        }
        if (parsed.summary) {
          summary = parsed.summary;
        }
      } catch {
        const svgMatch = /<svg[\s\S]*?<\/svg>/i.exec(aiResult.text);
        if (svgMatch) {
          svgOut = svgMatch[0];
        }
      }

      if (!svgOut) {
        svgOut = renderScientificFigureSvg('fig2_trace');
      }

      const registry = loadPaperRegistry();
      const paper = registry.find((p) => p.id === paperId) || registry[0];
      const cleanFile = (fileName || `ai_fig_${Date.now().toString().slice(-5)}.svg`).replace(/[^a-zA-Z0-9_.-]/g, '_');
      const finalFile = cleanFile.endsWith('.svg') ? cleanFile : `${cleanFile}.svg`;
      const relPath = `${paper.rootDir}/fig/${finalFile}`;
      writeTextSafe(relPath, svgOut);

      const envName = span === 'strip' ? 'strip' : span === 'double' ? 'figure*' : 'figure';
      const widthCmd = span === 'single' ? '\\linewidth' : '0.98\\textwidth';
      const labelSlug = finalFile.replace(/\.svg$/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
      const latexSnippet =
        envName === 'strip'
          ? `\\begin{strip}\\centering\n\\includegraphics[width=${widthCmd}]{fig/${finalFile}}\n\\captionof{figure}{${suggestedCaption}}\n\\label{fig:${labelSlug}}\n\\end{strip}`
          : `\\begin{${envName}}[t]\n\\centering\n\\includegraphics[width=${widthCmd}]{fig/${finalFile}}\n\\caption{${suggestedCaption}}\n\\label{fig:${labelSlug}}\n\\end{${envName}}`;

      res.json({
        ok: true,
        svg: svgOut,
        fileName: finalFile,
        relPath,
        assetUrl: `/api/assets/raw?path=${encodeURIComponent(relPath)}&t=${Date.now()}`,
        suggestedCaption,
        latexSnippet,
        summary,
        channelUsed: aiResult.channelUsed,
        modelUsed: aiResult.modelUsed,
        note: aiResult.note,
      });
    } catch (err: any) {
      console.error('AI figure generation error:', err);
      res.status(500).json({ error: err?.message || 'Failed to generate figure.' });
    }
  });

  // ============================================================================
  // API: Three-Mode Hybrid TeX Compiler Backend (Status, Auto-Install, Compile)
  // ============================================================================
  app.get('/api/tex/status', async (req, res) => {
    const paperId = String(req.query.paperId || 'paper_c');
    const registry = loadPaperRegistry();
    const paper = registry.find((p) => p.id === paperId) || registry[0];
    const engines = await detectTexEngines();
    const pdfRelPath = `${paper.rootDir}/main.pdf`;
    const pdfFullPath = path.join(__dirname, pdfRelPath);
    const hasCompiledPdf = fs.existsSync(pdfFullPath);
    const pdfStats = hasCompiledPdf ? fs.statSync(pdfFullPath) : null;

    res.json({
      ...engines,
      paperId: paper.id,
      pdfAvailable: hasCompiledPdf,
      pdfUrl: hasCompiledPdf ? `/api/tex/pdf/${paper.id}?t=${Math.floor(pdfStats!.mtimeMs)}` : null,
      pdfSizeBytes: pdfStats ? pdfStats.size : 0,
      pdfUpdatedAt: pdfStats ? new Date(pdfStats.mtimeMs).toISOString() : null,
      installGuide: {
        cloudAutoInstallSupported: true,
        condaCmd: 'conda install -c conda-forge tectonic -y',
        ubuntuCmd: 'sudo apt-get update && sudo apt-get install -y texlive-latex-base texlive-latex-extra texlive-fonts-recommended texlive-science latexmk',
        macCmd: 'brew install tectonic',
      },
    });
  });

  // API: One-Click Cloud Auto-Installer for Static Tectonic Binary (.bin/tectonic)
  app.post('/api/tex/install-tectonic', async (_req, res) => {
    try {
      const binDir = path.join(__dirname, '.bin');
      if (!fs.existsSync(binDir)) {
        fs.mkdirSync(binDir, { recursive: true });
      }
      const targetBin = path.join(binDir, 'tectonic');
      if (fs.existsSync(targetBin)) {
        const engines = await detectTexEngines();
        res.json({
          ok: true,
          message: 'Tectonic compiler is already installed in .bin/tectonic.',
          ...engines,
        });
        return;
      }

      const releaseUrl =
        'https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz';
      const cmd = `curl -L --fail --max-time 45 "${releaseUrl}" | tar -xz -C "${binDir}" && chmod +x "${targetBin}"`;
      await execAsync(cmd);

      const engines = await detectTexEngines();
      res.json({
        ok: true,
        message: 'Successfully installed static Tectonic LaTeX engine into .bin/tectonic!',
        ...engines,
      });
    } catch (err: any) {
      res.status(500).json({
        ok: false,
        error: `Automatic cloud download could not complete (${err?.message || 'network restricted'}). Instant KaTeX 2-Column CVPR Simulation and Browser Vector PDF Export remain active.`,
      });
    }
  });

  // API: Compile Paper LaTeX to Native PDF (via tectonic or pdflatex)
  app.post('/api/tex/compile-pdf', async (req, res) => {
    const { paperId = 'paper_c' } = req.body || {};
    const registry = loadPaperRegistry();
    const paper = registry.find((p) => p.id === paperId) || registry[0];
    const paperDir = path.join(__dirname, paper.rootDir);

    // Ensure main.tex exists for Paper A / Paper B if they don't have one yet
    const mainTexRel = `${paper.rootDir}/main.tex`;
    if (!fs.existsSync(path.join(__dirname, mainTexRel))) {
      const secInputs = paper.files
        .filter((f) => f.kind === 'tex' && f.path.includes('/sec/'))
        .sort((a, b) => a.order - b.order)
        .map((f) => `\\input{${f.path.replace(`${paper.rootDir}/`, '').replace(/\.tex$/, '')}}`)
        .join('\n');
      const generatedMain = `\\documentclass[10pt,twocolumn,letterpaper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath,amssymb,amsfonts,amsthm}
\\usepackage{booktabs}
\\usepackage{graphicx}
\\usepackage[colorlinks=true,allcolors=blue]{hyperref}
\\newcommand{\\TBD}[1]{\\textbf{[TBD: #1]}}
\\newcommand{\\FIG}[1]{\\textbf{[FIG: #1]}}
\\newcommand{\\lux}{\\textsc{LUX}}
\\newcommand{\\prism}{\\textsc{LUX}}
\\newtheorem{theorem}{Theorem}
\\newtheorem{definition}{Definition}
\\newtheorem{proposition}{Proposition}
\\newtheorem{corollary}{Corollary}

\\title{${paper.title}}
\\author{Anonymous ${paper.venue} Submission}
\\date{}

\\begin{document}
\\maketitle
${secInputs}
\\bibliographystyle{plain}
\\bibliography{refs}
\\end{document}
`;
      writeTextSafe(mainTexRel, generatedMain);
    }

    const engines = await detectTexEngines();
    if (!engines.hasNativeCompiler) {
      res.json({
        ok: false,
        compiled: false,
        engine: 'katex-simulation',
        log: `[SystemOne-Lab TeX Diagnostic]\nNo native CLI binary (tectonic / pdflatex) detected yet.\n• Click "One-Click Auto-Deploy Tectonic Engine" in the Compiler panel to download the static Linux x86_64 compiler into .bin/tectonic, OR\n• Use Instant KaTeX CVPR 2-Column Simulation + Print Vector PDF right away.`,
      });
      return;
    }

    try {
      let cmd = '';
      if (engines.tectonicPath) {
        cmd = `"${engines.tectonicPath}" -X compile main.tex --keep-logs`;
      } else if (engines.pdflatexPath) {
        cmd = `"${engines.pdflatexPath}" -interaction=nonstopmode main.tex`;
      }

      const { stdout, stderr } = await execAsync(cmd, {
        cwd: paperDir,
        timeout: 60000,
      });

      const pdfFullPath = path.join(paperDir, 'main.pdf');
      const hasPdf = fs.existsSync(pdfFullPath);
      const logContent = readTextSafe(`${paper.rootDir}/main.log`, '') || `${stdout}\n${stderr}`;

      res.json({
        ok: hasPdf,
        compiled: hasPdf,
        engine: engines.preferredEngine,
        pdfUrl: hasPdf ? `/api/tex/pdf/${paper.id}?t=${Date.now()}` : null,
        log: logContent.slice(-12000),
      });
    } catch (err: any) {
      const logContent =
        readTextSafe(`${paper.rootDir}/main.log`, '') ||
        `${err?.stdout || ''}\n${err?.stderr || ''}\n${err?.message || ''}`;
      const pdfFullPath = path.join(paperDir, 'main.pdf');
      const hasPdf = fs.existsSync(pdfFullPath);
      res.json({
        ok: hasPdf,
        compiled: hasPdf,
        engine: engines.preferredEngine,
        pdfUrl: hasPdf ? `/api/tex/pdf/${paper.id}?t=${Date.now()}` : null,
        log: logContent.slice(-12000),
        error: err?.message || 'Compilation exited with errors',
      });
    }
  });

  // Serve compiled main.pdf for in-browser PDF viewer
  app.get('/api/tex/pdf/:paperId', (req, res) => {
    const { paperId } = req.params;
    const registry = loadPaperRegistry();
    const paper = registry.find((p) => p.id === paperId) || registry[0];
    const pdfFullPath = path.join(__dirname, paper.rootDir, 'main.pdf');
    if (!fs.existsSync(pdfFullPath)) {
      res.status(404).send('PDF not compiled yet.');
      return;
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(pdfFullPath);
  });

  // ============================================================================
  // API: Figure & Asset Studio (Data-Driven SVG, Asset Upload, Raw File Serving)
  // ============================================================================
  app.get('/api/assets/raw', (req, res) => {
    const relPath = String(req.query.path || '');
    const normalized = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.join(__dirname, normalized);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      res.status(404).send('Asset not found');
      return;
    }
    const ext = path.extname(fullPath).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.json': 'application/json',
      '.csv': 'text/csv; charset=utf-8',
      '.md': 'text/plain; charset=utf-8',
      '.tex': 'text/plain; charset=utf-8',
    };
    if (mimeMap[ext]) {
      res.setHeader('Content-Type', mimeMap[ext]);
    }
    res.sendFile(fullPath);
  });

  // List all figures, uploaded images, data files, and docs for a paper
  app.get('/api/assets/:paperId', (req, res) => {
    const { paperId } = req.params;
    const registry = loadPaperRegistry();
    const paper = registry.find((p) => p.id === paperId) || registry[0];
    const figDir = path.join(__dirname, paper.rootDir, 'fig');
    const dataDir = path.join(__dirname, paper.rootDir, 'data');

    const collectFiles = (dir: string, subType: 'figure' | 'data') => {
      if (!fs.existsSync(dir)) return [];
      return fs
        .readdirSync(dir)
        .filter((name) => !name.startsWith('.'))
        .map((name) => {
          const full = path.join(dir, name);
          const stat = fs.statSync(full);
          if (stat.isDirectory()) return null;
          const relPath = path.relative(__dirname, full);
          const ext = path.extname(name).toLowerCase();
          return {
            name,
            relPath,
            texRelativePath: path.relative(path.join(__dirname, paper.rootDir), full),
            ext,
            subType,
            sizeBytes: stat.size,
            updatedAt: new Date(stat.mtimeMs).toISOString(),
            url: `/api/assets/raw?path=${encodeURIComponent(relPath)}&t=${Math.floor(stat.mtimeMs)}`,
          };
        })
        .filter(Boolean);
    };

    const assets = [...collectFiles(figDir, 'figure'), ...collectFiles(dataDir, 'data')];
    res.json({
      paperId: paper.id,
      rootDir: paper.rootDir,
      assets,
      scientificPresets: SCIENTIFIC_FIGURES,
    });
  });

  // Save/update a parameterized scientific SVG figure to <paperRoot>/fig/
  app.post('/api/figures/save-svg', (req, res) => {
    const {
      paperId = 'paper_c',
      figId = 'fig1_teaser',
      style,
      customFileName,
      caption,
      span = 'double',
    } = req.body || {};

    const registry = loadPaperRegistry();
    const paper = registry.find((p) => p.id === paperId) || registry[0];
    const spec = SCIENTIFIC_FIGURES.find((f) => f.id === figId) || SCIENTIFIC_FIGURES[0];
    const svgContent = renderScientificFigureSvg(figId, style as FigureStyleConfig);
    const fileName = customFileName || spec.fileName;
    const relPath = `${paper.rootDir}/fig/${fileName}`;
    writeTextSafe(relPath, svgContent);

    const finalSpan = span || spec.defaultSpan;
    const finalCaption = caption || spec.defaultCaption;
    const envName = finalSpan === 'strip' ? 'strip' : finalSpan === 'double' ? 'figure*' : 'figure';
    const widthCmd = finalSpan === 'single' ? '\\linewidth' : '0.98\\textwidth';

    const latexSnippet =
      envName === 'strip'
        ? `\\begin{strip}\\centering\n\\includegraphics[width=${widthCmd}]{fig/${fileName}}\n\\captionof{figure}{${finalCaption}}\n\\label{${spec.label}}\n\\end{strip}`
        : `\\begin{${envName}}[t]\n\\centering\n\\includegraphics[width=${widthCmd}]{fig/${fileName}}\n\\caption{${finalCaption}}\n\\label{${spec.label}}\n\\end{${envName}}`;

    res.json({
      ok: true,
      fileName,
      relPath,
      url: `/api/assets/raw?path=${encodeURIComponent(relPath)}&t=${Date.now()}`,
      svg: svgContent,
      latexSnippet,
    });
  });

  // Upload user image, schematic, CSV/JSON experimental data, or document
  app.post('/api/assets/upload', (req, res) => {
    const {
      paperId = 'paper_c',
      fileName = 'uploaded_asset.png',
      base64Data = '',
      textContent = '',
      caption = '',
      span = 'single',
    } = req.body || {};

    const registry = loadPaperRegistry();
    const paper = registry.find((p) => p.id === paperId) || registry[0];
    const cleanName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const ext = path.extname(cleanName).toLowerCase();
    const isImageOrPdf = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.pdf'].includes(ext);
    const subFolder = isImageOrPdf ? 'fig' : 'data';
    const relPath = `${paper.rootDir}/${subFolder}/${cleanName}`;
    const fullPath = path.join(__dirname, relPath);

    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (base64Data) {
      const stripped = base64Data.replace(/^data:[^;]+;base64,/, '');
      fs.writeFileSync(fullPath, Buffer.from(stripped, 'base64'));
    } else {
      fs.writeFileSync(fullPath, textContent, 'utf-8');
    }

    let latexSnippet = '';
    if (isImageOrPdf) {
      const envName = span === 'strip' ? 'strip' : span === 'double' ? 'figure*' : 'figure';
      const widthCmd = span === 'single' ? '\\linewidth' : '0.96\\textwidth';
      const cap = caption || `\\textbf{${cleanName.replace(/_/g, '\\_')}.} Detailed view and experimental analysis.`;
      const labelSlug = cleanName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
      latexSnippet =
        envName === 'strip'
          ? `\\begin{strip}\\centering\n\\includegraphics[width=${widthCmd}]{fig/${cleanName}}\n\\captionof{figure}{${cap}}\n\\label{fig:${labelSlug}}\n\\end{strip}`
          : `\\begin{${envName}}[t]\n\\centering\n\\includegraphics[width=${widthCmd}]{fig/${cleanName}}\n\\caption{${cap}}\n\\label{fig:${labelSlug}}\n\\end{${envName}}`;
    } else if (ext === '.csv' && textContent) {
      // Auto-convert uploaded CSV into a LaTeX Booktabs Table!
      const rows = textContent
        .trim()
        .split(/\r?\n/)
        .slice(0, 20)
        .map((line: string) => line.split(',').map((cell: string) => cell.trim()));
      if (rows.length > 0) {
        const cols = rows[0].length;
        const colSpec = 'l' + 'c'.repeat(Math.max(1, cols - 1));
        const headerRow = rows[0].join(' & ') + '\\\\\\midrule';
        const bodyRows = rows
          .slice(1)
          .map((r: string[]) => r.join(' & ') + '\\\\')
          .join('\n');
        latexSnippet = `\\begin{table}[t]\\centering\\small\n\\caption{\\textbf{Experimental data imported from ${cleanName.replace(/_/g, '\\_')}.}}\n\\label{tab:${cleanName.replace(/\.csv$/, '')}}\n\\begin{tabular}{${colSpec}}\\toprule\n${headerRow}\n${bodyRows}\\bottomrule\n\\end{tabular}\n\\end{table}`;
      }
    }

    res.json({
      ok: true,
      name: cleanName,
      relPath,
      texRelativePath: `${subFolder}/${cleanName}`,
      url: `/api/assets/raw?path=${encodeURIComponent(relPath)}&t=${Date.now()}`,
      latexSnippet,
    });
  });

  // API: Overview & Taxonomy & V36 Blind Human Benchmark
  app.get('/api/overview', (_req, res) => {
    const fig1Story = readJsonSafe('paper_c/results/fig1_industrial/story.json', {});
    const fig1Cases = readJsonSafe('paper_c/results/fig1_industrial/cases.json', []);
    const mentionFreq = readJsonSafe('paper_c/configs/mention_freq.json', {});

    res.json({
      title: 'LUX: Recovering Overexposed Visual Facts for Rule-Editable Decisions',
      venue: 'CVPR 2027 Submission · SystemOne-Lab Research Pack (Paper C)',
      primitives: PRIMITIVES,
      industries: INDUSTRIES,
      officialSeverity: OFFICIAL_SEVERITY,
      rulePresets: RULE_PRESETS,
      levelNames: LEVEL_NAMES,
      mentionFreq,
      v36Benchmark: [
        { system: 'LUX (V42) s0 [Proposed]', changedHuman: 0.888, changedDerived: 0.860, all128Human: 0.891, r1: 0.958, r2: 0.767, r3: 1.000, category: 'lux' },
        { system: 'LUX (V42) s1 [Proposed]', changedHuman: 0.879, changedDerived: 0.860, all128Human: 0.898, r1: 0.938, r2: 0.767, r3: 1.000, category: 'lux' },
        { system: 'Verdict-Only SFT (V34)', changedHuman: 0.850, changedDerived: 0.794, all128Human: 0.875, r1: 0.958, r2: 0.721, r3: 0.875, category: 'fanout' },
        { system: 'LUX Zero-Shot (Untrained Base)', changedHuman: 0.832, changedDerived: 0.785, all128Human: 0.844, r1: 0.958, r2: 0.651, r3: 0.938, category: 'fanout' },
        { system: 'LUX Level-Fill SFT s0', changedHuman: 0.804, changedDerived: 0.748, all128Human: 0.836, r1: 0.958, r2: 0.605, r3: 0.875, category: 'fanout' },
        { system: 'Direct-SFT + 200 Relabelled (New Prompt)', changedHuman: 0.673, changedDerived: 0.579, all128Human: 0.719, r1: 0.896, r2: 0.395, r3: 0.750, category: 'direct' },
        { system: 'Direct-SFT Retrained on Relabelled Train', changedHuman: 0.570, changedDerived: 0.514, all128Human: 0.641, r1: 0.812, r2: 0.442, r3: 0.188, category: 'direct' },
        { system: 'Rule-Conditioned Direct-SFT (New Rule in Prompt)', changedHuman: 0.449, changedDerived: 0.421, all128Human: 0.523, r1: 0.417, r2: 0.349, r3: 0.812, category: 'direct' },
        { system: 'Zero-Shot Direct (New Rule in Prompt)', changedHuman: 0.421, changedDerived: 0.393, all128Human: 0.492, r1: 0.583, r2: 0.372, r3: 0.062, category: 'direct' },
        { system: 'Direct-SFT (New Rule in Prompt)', changedHuman: 0.262, changedDerived: 0.168, all128Human: 0.383, r1: 0.167, r2: 0.233, r3: 0.625, category: 'direct' },
        { system: 'Direct-SFT (Old Prompt)', changedHuman: 0.215, changedDerived: 0.131, all128Human: 0.344, r1: 0.062, r2: 0.233, r3: 0.625, category: 'direct' },
      ],
      fig1Story,
      fig1Cases,
    });
  });

  // API: Empirical Figures 2-5 Data
  app.get('/api/figures', (_req, res) => {
    const fig2Trace = readJsonSafe('paper_c/results/figdata/fig2_trace.json', {});
    const fig3Calib = readJsonSafe('paper_c/results/figdata/fig3_calibration_stats.json', {});
    const fig4Dynamics = readJsonSafe('paper_c/results/figdata/fig4_training_dynamics.json', {});
    const fig5RuleEdits = readJsonSafe('paper_c/results/figdata/fig5_rule_edits_and_cases.json', {});

    res.json({
      fig2Trace,
      fig3Calib,
      fig4Dynamics,
      fig5RuleEdits,
    });
  });

  // API: Live Scene Evaluation & Counterfactual Rule Simulator
  app.post('/api/evaluate-scene', (req, res) => {
    const {
      industry = 'coal_conveyor',
      pBranch = [],
      oldSeverityRow,
      newSeverityRow,
      eta = 5.0,
      observedVerdict = 3,
      descriptionText = '',
      s2Sens = 0.94,
      s2Spec = 0.96,
    } = req.body || {};

    const indKey = (INDUSTRIES.some((i) => i.id === industry) ? industry : 'coal_conveyor') as IndustryId;
    const baseSev = Array.isArray(oldSeverityRow) && oldSeverityRow.length === 15
      ? oldSeverityRow
      : OFFICIAL_SEVERITY[indKey];
    const editedSev = Array.isArray(newSeverityRow) && newSeverityRow.length === 15
      ? newSeverityRow
      : baseSev;
    const probs = Array.isArray(pBranch) && pBranch.length === 15
      ? pBranch.map((v: number) => Math.max(0, Math.min(1, Number(v) || 0)))
      : new Array(15).fill(0.01);

    const oldOrdinalProbs = aggregateNoisyOr(probs, baseSev);
    const newOrdinalProbs = aggregateNoisyOr(probs, editedSev);

    const oldDecision = bayesDecision(oldOrdinalProbs, eta);
    const newDecision = bayesDecision(newOrdinalProbs, eta);

    const oldArgmax = oldOrdinalProbs.indexOf(Math.max(...oldOrdinalProbs));
    const newArgmax = newOrdinalProbs.indexOf(Math.max(...newOrdinalProbs));

    const exposureOld = computeFactExposure(probs, baseSev);
    const exposureNew = computeFactExposure(probs, editedSev);

    const extractedMentions = descriptionText ? extractBranchLabelsFromText(descriptionText) : {};
    const mVec = PRIMITIVES.map((prim) => (extractedMentions[prim.id] === 1 ? 1 : 0));
    const cVec = new Array(15).fill(0.85);

    const posteriorQ = computeLatentMilPosterior(
      probs,
      cVec,
      mVec,
      baseSev,
      Number(observedVerdict) || 0
    );

    const voiResult = computeBranchVoi(probs, editedSev, eta, s2Sens, s2Spec);
    const csRps = csRpsSingle(newOrdinalProbs, Number(observedVerdict) || 0, eta);

    res.json({
      oldOrdinalProbs,
      newOrdinalProbs,
      oldDecision,
      newDecision,
      oldArgmax,
      newArgmax,
      exposureOld,
      exposureNew,
      extractedMentions,
      posteriorQ,
      voi: voiResult.voi,
      baseRisk: voiResult.baseRisk,
      topBranchIdx: voiResult.topBranchIdx,
      csRps,
    });
  });

  const port = Number(process.env.PORT) || 3000;
  const distPath = path.join(__dirname, 'dist');
  const isDevMode = process.env.NODE_ENV === 'development' || process.argv.some((arg) => arg.includes('tsx'));

  if ((process.env.NODE_ENV === 'production' || !isDevMode) && fs.existsSync(path.join(distPath, 'index.html'))) {
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    app.listen(port, '0.0.0.0', () => {
      console.log(`SystemOne-Lab Paper Studio & LUX Workbench running on http://0.0.0.0:${port}`);
    });
  } else {
    let viteMiddleware: any = null;
    app.use((req, res, next) => {
      if (viteMiddleware) {
        return viteMiddleware(req, res, next);
      }
      if (fs.existsSync(path.join(distPath, 'index.html'))) {
        return express.static(distPath)(req, res, next);
      }
      res.status(200).send('<!doctype html><html><head><meta http-equiv="refresh" content="1"></head><body style="background:#FBFBF9"></body></html>');
    });

    app.listen(port, '0.0.0.0', () => {
      console.log(`SystemOne-Lab Paper Studio & LUX Workbench running on http://0.0.0.0:${port}`);
    });

    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    viteMiddleware = vite.middlewares;
  }
}

startServer();
