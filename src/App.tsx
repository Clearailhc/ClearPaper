import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Save,
  Plus,
  Check,
  Columns2,
  Upload,
  Image as ImageIcon,
  Terminal,
  RefreshCw,
  Wand2,
  Printer,
  Settings2,
  X,
  Maximize2,
  Minimize2,
  Eye,
  PenTool,
  CornerDownLeft,
  FolderTree,
  Sparkles,
  MoreHorizontal,
  Globe,
  Columns,
  FileText,
  FileCode2,
  Pin,
  Copy,
  Scissors,
} from 'lucide-react';
import {
  LatexDocumentPreview,
  BibEntry,
  resolvePreviewSelectionToLatex,
} from './lib/latexRenderer';

// --- Bilingual UI Dictionary ---
type UILang = 'zh' | 'en';

const I18N: Record<UILang, Record<string, string>> = {
  zh: {
    workspaceFiles: '工程文件夹与上下文 (Git Tracked)',
    tabChapters: '章节 (.tex)',
    tabExperiments: '实验与记录',
    tabFigures: '配图 (fig/)',
    tabConfig: '文献与导言',
    modeSplit: '无界双栏（左源码 · 右排版）',
    modeZen: '沉浸写作（居中手稿）',
    modeReview: '审阅画布（全屏论文）',
    save: '保存至磁盘 (Cmd+S)',
    saving: '保存中...',
    compilePdf: '编译 / 导出 PDF',
    compiling: '编译中...',
    printPdf: '打印双栏 PDF',
    settings: '语言、AI 通道与编译器',
    words: '词',
    pages: '页',
    unsaved: '未存',
    edited: '已改',
    returnStream: '返回连续手稿长卷',
    editingFile: '正在查看 / 编辑工程文件',
    polishSection: 'AI 协作本节',
    liveTypeset: '实时双栏排版',
    compiledPdf: '原生编译 PDF',
    twoCol: '切换单/双栏排版',
    fullscreenReview: '切换全屏审阅',
    spotlightPlaceholder: '输入指令（支持 @引用工程文件，或在源码/预览区划词、右键唤起 AI）...',
    spotlightSelectedPlaceholder: '针对同源选中内容：输入修改指令（支持 @引用文件）...',
    presetPolish: '润色',
    presetCondense: '精简',
    presetRewrite: '改写',
    quickPresets: '常用动作',
    switchChannel: '切换 AI 通道 (Studio / vLLM)',
    selectedWords: '同源已选',
    activeContext: '当前章节',
    pinnedContext: '已挂载上下文',
    applyToTex: '写回 .tex',
    discardDiff: '关闭',
    languageLabel: '界面语言 / Language',
    aiChannelTitle: 'AI 模型通道',
    studioBuiltin: 'Studio 内置通道',
    openaiCustom: 'OpenAI / vLLM 通道',
    baseUrlLabel: 'OpenAI 兼容接口地址',
    modelIdLabel: '模型标识 (Model ID)',
    texEngineTitle: 'TeX 编译引擎',
    detectedEngine: '当前引擎',
    installTectonic: '一键安装 Tectonic 原生编译器',
    installingTectonic: '安装中...',
    uploadFile: '上传实验记录 (.md/.json/.csv) 或配图',
    newNote: '新建实验记录 (.md)',
    pinForAi: '作为上下文挂载给 LLM',
    copyLatexPath: '复制 LaTeX 代码',
    filesReferenced: '自动检索文件',
    ctxHeaderSelection: '同源选中',
    ctxHeaderSection: '整节内容',
    ctxCustomPrompt: '告诉 AI 如何修改这段内容... (支持 @引用文件)',
    dropOverlayTitle: '松开鼠标即可导入工程文件夹',
    dropOverlaySub: '实验记录 (.md/.json/.csv) 将自动挂载为 LLM 上下文，图片将存入 fig/ 并生成引用',
    previewHint: '划词、双击或右键任意位置，自动与左侧源码双向同源定位并唤起 AI',
    syncedFromPreview: '已从预览同源定位',
  },
  en: {
    workspaceFiles: 'Workspace Files & Context (Git Tracked)',
    tabChapters: 'Chapters',
    tabExperiments: 'Experiments',
    tabFigures: 'Figures',
    tabConfig: 'Bib & Config',
    modeSplit: 'Seamless Split (Source & Typeset)',
    modeZen: 'Zen Writing (Distraction-Free)',
    modeReview: 'Paper Review (Full-Screen Sheet)',
    save: 'Save to Disk (Cmd+S)',
    saving: 'Saving...',
    compilePdf: 'Compile PDF',
    compiling: 'Compiling...',
    printPdf: 'Print Two-Column PDF',
    settings: 'Language, AI Channel & Compiler',
    words: 'words',
    pages: 'pp',
    unsaved: 'unsaved',
    edited: 'edited',
    returnStream: 'Return to Continuous Manuscript',
    editingFile: 'Viewing / Editing Workspace File',
    polishSection: 'AI Assist Section',
    liveTypeset: 'Live Typeset',
    compiledPdf: 'Compiled PDF',
    twoCol: 'Toggle 1-Col / 2-Col',
    fullscreenReview: 'Toggle Full-Screen Review',
    spotlightPlaceholder: 'Ask AI (type @ to mention files, or select/right-click in source or preview)...',
    spotlightSelectedPlaceholder: 'For synced selection: type instruction (@ to mention files)...',
    presetPolish: 'Polish',
    presetCondense: 'Condense',
    presetRewrite: 'Rewrite',
    quickPresets: 'Quick Actions',
    switchChannel: 'Switch AI Channel (Studio / vLLM)',
    selectedWords: 'Synced Selection',
    activeContext: 'Section',
    pinnedContext: 'Pinned files',
    applyToTex: 'Write to .tex',
    discardDiff: 'Dismiss',
    languageLabel: 'Interface Language / 界面语言',
    aiChannelTitle: 'AI Execution Channel',
    studioBuiltin: 'Studio Built-in',
    openaiCustom: 'OpenAI / vLLM',
    baseUrlLabel: 'OpenAI-Compatible Base URL',
    modelIdLabel: 'Model Identifier',
    texEngineTitle: 'TeX Compilation Engine',
    detectedEngine: 'Active Engine',
    installTectonic: 'One-Click Install Tectonic Engine',
    installingTectonic: 'Installing...',
    uploadFile: 'Upload Experiment Log (.md/.json/.csv) or Figure',
    newNote: 'New Experiment Note (.md)',
    pinForAi: 'Pin to LLM Context',
    copyLatexPath: 'Copy LaTeX Snippet',
    filesReferenced: 'Auto-retrieved',
    ctxHeaderSelection: 'Synced Selection',
    ctxHeaderSection: 'Full Section',
    ctxCustomPrompt: 'Ask AI how to edit this selection... (@ to mention file)',
    dropOverlayTitle: 'Drop File into Paper Workspace',
    dropOverlaySub: 'Experiment logs (.md/.json/.csv) auto-pin to LLM context; figures save to fig/',
    previewHint: 'Select text, double-click, or right-click to bidirectionally sync with LaTeX source & invoke AI',
    syncedFromPreview: 'Synced from Preview',
  },
};

// Minimalist Apple-style Icon Button with instant hover tooltip pill
const IconActionButton: React.FC<{
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  tooltip: string;
  badge?: string | number;
  tooltipPosition?: 'bottom' | 'top';
  children: React.ReactNode;
}> = ({
  onClick,
  active = false,
  disabled = false,
  tooltip,
  badge,
  tooltipPosition = 'bottom',
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={tooltip}
      className={`group relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 focus:outline-none ${
        active
          ? 'bg-[#1D1D1F] text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
          : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.04]'
      } ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
    >
      {children}
      {badge !== undefined && badge !== 0 && badge !== '' && (
        <span
          className={`ml-0.5 text-[10px] font-mono-code leading-none ${
            active ? 'text-white/80' : 'text-[#86868B]'
          }`}
        >
          {badge}
        </span>
      )}
      <span
        className={`pointer-events-none absolute ${
          tooltipPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        } left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#1D1D1F]/90 backdrop-blur-md text-white text-[11px] font-medium whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-50 shadow-sm`}
      >
        {tooltip}
      </span>
    </button>
  );
};

// --- Types ---
interface PaperFile {
  path: string;
  title: string;
  kind: 'tex' | 'bib' | 'md';
  order: number;
  content: string;
  hash?: string;
  mtimeMs?: number;
  words: number;
  chars: number;
  tbdCount: number;
  figCount: number;
}

interface PaperProject {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  venue: string;
  deadline: string;
  pageLimit: number;
  status: string;
  rootDir: string;
  files: PaperFile[];
  bibEntries: BibEntry[];
  stats: {
    totalWords: number;
    totalTbds: number;
    totalFigs: number;
    estimatedPages: number;
  };
}

interface WorkspaceFileItem {
  name: string;
  relPath: string;
  ext: string;
  category: 'manuscript' | 'config' | 'experiment' | 'figure';
  sizeBytes: number;
  updatedAt: string;
  url: string;
}

interface DiffLine {
  type: 'same' | 'removed' | 'added';
  text: string;
}

function computeSimpleLineDiff(oldStr: string, newStr: string): DiffLine[] {
  const oldLines = oldStr.split('\n');
  const newLines = newStr.split('\n');
  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      result.push({ type: 'same', text: oldLines[i] });
      i++;
      j++;
    } else if (
      j + 1 < newLines.length &&
      i < oldLines.length &&
      oldLines[i] === newLines[j + 1]
    ) {
      result.push({ type: 'added', text: newLines[j] });
      j++;
    } else if (
      i + 1 < oldLines.length &&
      j < newLines.length &&
      oldLines[i + 1] === newLines[j]
    ) {
      result.push({ type: 'removed', text: oldLines[i] });
      i++;
    } else {
      if (i < oldLines.length) {
        result.push({ type: 'removed', text: oldLines[i] });
        i++;
      }
      if (j < newLines.length) {
        result.push({ type: 'added', text: newLines[j] });
        j++;
      }
    }
  }
  return result;
}

// Auto-growing borderless textarea with Bidirectional Homologous Selection & Unified Floating Card support
const AutoGrowSectionTextarea: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onFocus: () => void;
  externalSelection?: { start: number; end: number; triggerTs: number } | null;
  onSelectText: (
    selected: string,
    start: number,
    end: number,
    coords?: { x: number; y: number }
  ) => void;
  onContextMenuRequest: (
    selected: string,
    start: number,
    end: number,
    e: React.MouseEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
}> = ({
  value,
  onChange,
  onFocus,
  externalSelection,
  onSelectText,
  onContextMenuRequest,
  placeholder,
}) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(110, el.scrollHeight)}px`;
  }, [value]);

  // Programmatically highlight the homologous LaTeX range when selected from the Preview pane
  useEffect(() => {
    const el = ref.current;
    if (!el || !externalSelection) return;
    const { start, end } = externalSelection;
    if (end > start && start >= 0 && end <= el.value.length) {
      try {
        el.setSelectionRange(start, end);
      } catch {}
    }
  }, [externalSelection]);

  const handleMouseUp = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    if (end > start) {
      onSelectText(el.value.slice(start, end), start, end, {
        x: e.clientX,
        y: e.clientY,
      });
    } else {
      onSelectText('', start, end);
    }
  };

  const handleKeyUp = () => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    if (end > start) {
      onSelectText(el.value.slice(start, end), start, end);
    } else {
      onSelectText('', start, end);
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const sel = end > start ? el.value.slice(start, end) : el.value;
    onContextMenuRequest(sel, start, end, e);
  };

  return (
    <textarea
      ref={ref}
      value={value}
      onFocus={onFocus}
      onChange={(e) => onChange(e.target.value)}
      onMouseUp={handleMouseUp}
      onKeyUp={handleKeyUp}
      onContextMenu={handleContextMenu}
      rows={4}
      spellCheck={false}
      placeholder={placeholder}
      className="w-full resize-none overflow-hidden bg-transparent font-mono-code text-[13.5px] leading-[1.9] text-[#1D1D1F] placeholder:text-[#C7C7CC] focus:outline-none selection:bg-[#0066CC]/20 selection:text-[#0066CC]"
    />
  );
};

export function App() {
  // Interface Language ('zh' | 'en') persisted in localStorage
  const [uiLang, setUiLang] = useState<UILang>(() => {
    try {
      const saved = localStorage.getItem('lux_studio_lang');
      return saved === 'en' ? 'en' : 'zh';
    } catch {
      return 'zh';
    }
  });

  const t = useCallback(
    (key: string) => I18N[uiLang][key] || I18N.en[key] || key,
    [uiLang]
  );

  const handleSetLang = (lang: UILang) => {
    setUiLang(lang);
    try {
      localStorage.setItem('lux_studio_lang', lang);
    } catch {}
  };

  // Pure 3-State Canvas Mode: 'split' | 'zen' | 'review'
  const [canvasMode, setCanvasMode] = useState<'split' | 'zen' | 'review'>('split');

  // Top-Left Unified Workspace Drawer & Top-Right Settings Drawer
  const [showWorkspaceDrawer, setShowWorkspaceDrawer] = useState<boolean>(false);
  const [workspaceTab, setWorkspaceTab] = useState<
    'manuscript' | 'experiment' | 'figure' | 'config'
  >('manuscript');
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);

  // Multi-Paper & File-System State
  const [papers, setPapers] = useState<PaperProject[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState<string>('paper_c');
  const [activeSectionPath, setActiveSectionPath] = useState<string>(
    'paper_c/paper/sec/0_abstract.tex'
  );
  const [fileDrafts, setFileDrafts] = useState<Record<string, string>>({});
  const [fileHashes, setFileHashes] = useState<Record<string, string>>({});
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFileItem[]>([]);
  const [pinnedContextFiles, setPinnedContextFiles] = useState<string[]>([]);

  // Active Non-Chapter Workspace File
  const [openedWorkspaceFile, setOpenedWorkspaceFile] = useState<{
    relPath: string;
    name: string;
    ext: string;
    category: WorkspaceFileItem['category'];
    content?: string;
    url?: string;
  } | null>(null);

  const [savingFile, setSavingFile] = useState(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [isDraggingOverCanvas, setIsDraggingOverCanvas] = useState(false);

  // Preview Options
  const [previewRenderTarget, setPreviewRenderTarget] = useState<'cvpr_sim' | 'native_pdf'>(
    'cvpr_sim'
  );
  const [twoColumnPreview, setTwoColumnPreview] = useState<boolean>(true);

  // Dual-Channel AI State
  const [aiChannel, setAiChannel] = useState<'studio' | 'openai'>('studio');
  const [studioModel] = useState<string>('gemini-3.8-flash');
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState<string>('http://localhost:8000/v1');
  const [openaiModel, setOpenaiModel] = useState<string>('Qwen3.5-122B-A10B');

  // Unified Bidirectional Homologous Selection & Floating Prompt-First Card
  const [selectedSnippet, setSelectedSnippet] = useState<{
    filePath: string;
    sectionTitle: string;
    text: string;
    start: number;
    end: number;
    origin?: 'source' | 'preview';
    triggerTs?: number;
  } | null>(null);

  const [agentContextMenu, setAgentContextMenu] = useState<{
    x: number;
    y: number;
    filePath: string;
    sectionTitle: string;
    targetText: string;
    isSelection: boolean;
    blockKind?: string;
    origin?: 'source' | 'preview';
  } | null>(null);
  const [contextMenuInput, setContextMenuInput] = useState<string>('');
  const floatingInputRef = useRef<HTMLInputElement | null>(null);

  // 3. Bottom Spotlight & @File Autocomplete
  const [spotlightInput, setSpotlightInput] = useState<string>('');
  const [spotlightLoading, setSpotlightLoading] = useState<boolean>(false);
  const [showSpotlightPresets, setShowSpotlightPresets] = useState<boolean>(false);
  const [spotlightResult, setSpotlightResult] = useState<{
    filePath: string;
    sectionTitle: string;
    originalText: string;
    revisedText: string;
    explanation: string;
    wordsBefore: number;
    wordsAfter: number;
    matchedFiles: string[];
    channelUsed: string;
    modelUsed: string;
  } | null>(null);
  const [spotlightStatusMsg, setSpotlightStatusMsg] = useState<string | null>(null);

  // Native PDF Compiler State
  const [compilerStatus, setCompilerStatus] = useState<{
    hasNativeCompiler: boolean;
    tectonicPath: string | null;
    pdflatexPath: string | null;
    preferredEngine: string;
  } | null>(null);
  const [installingTectonic, setInstallingTectonic] = useState(false);
  const [compilingPdf, setCompilingPdf] = useState(false);
  const [pdfCompileResult, setPdfCompileResult] = useState<{
    ok: boolean;
    compiled?: boolean;
    pdfUrl: string | null;
    engine?: string;
    log?: string;
  } | null>(null);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previewRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const spotlightInputRef = useRef<HTMLInputElement | null>(null);

  // Close context menu on Escape or click outside
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAgentContextMenu(null);
        setShowSpotlightPresets(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        spotlightInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Load Papers
  const fetchPapers = useCallback(async () => {
    try {
      const res = await fetch('/api/papers').then((r) => r.json());
      if (res?.papers) {
        setPapers(res.papers);
        const drafts: Record<string, string> = {};
        const hashes: Record<string, string> = {};
        res.papers.forEach((p: PaperProject) => {
          p.files.forEach((f: PaperFile) => {
            drafts[f.path] = f.content;
            if (f.hash) hashes[f.path] = f.hash;
          });
        });
        setFileDrafts((prev) => ({ ...drafts, ...prev }));
        setFileHashes((prev) => ({ ...hashes, ...prev }));
      }
    } catch (err) {
      console.error('Failed to load papers:', err);
    }
  }, []);

  // Load File-System Tree for active paper
  const fetchWorkspaceTree = useCallback(async (paperId: string) => {
    try {
      const res = await fetch(`/api/workspace/${paperId}/tree`).then((r) => r.json());
      if (res?.items) {
        setWorkspaceFiles(res.items);
      }
    } catch (e) {
      console.error('Failed to load workspace tree:', e);
    }
  }, []);

  const fetchCompilerStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/tex/status').then((r) => r.json());
      setCompilerStatus(res);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
    fetchCompilerStatus();
    fetch('/api/ai/channels')
      .then((r) => r.json())
      .then((data) => {
        if (data?.openaiConfig?.baseUrl) setOpenaiBaseUrl(data.openaiConfig.baseUrl);
        if (data?.openaiConfig?.defaultModel) setOpenaiModel(data.openaiConfig.defaultModel);
      })
      .catch(() => {});
  }, [fetchPapers, fetchCompilerStatus]);

  useEffect(() => {
    fetchWorkspaceTree(selectedPaperId);
    setOpenedWorkspaceFile(null);
  }, [selectedPaperId, fetchWorkspaceTree]);

  // Disk Change Watcher (Git & Agent File-System Sync)
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/papers/${selectedPaperId}/disk-status`).then((r) =>
          r.json()
        );
        if (!res?.files) return;
        let updatedCount = 0;
        const newDrafts: Record<string, string> = {};
        const newHashes: Record<string, string> = {};

        for (const diskFile of res.files) {
          const knownHash = fileHashes[diskFile.path];
          if (knownHash && diskFile.hash !== knownHash) {
            newDrafts[diskFile.path] = diskFile.content;
            newHashes[diskFile.path] = diskFile.hash;
            updatedCount++;
          }
        }

        if (updatedCount > 0) {
          setFileDrafts((prev) => ({ ...prev, ...newDrafts }));
          setFileHashes((prev) => ({ ...prev, ...newHashes }));
          setSaveBanner(`↻ ${updatedCount}`);
          setTimeout(() => setSaveBanner(null), 2500);
          fetchWorkspaceTree(selectedPaperId);
        }
      } catch {}
    }, 6000);
    return () => clearInterval(timer);
  }, [selectedPaperId, fileHashes, fetchWorkspaceTree]);

  const currentPaper = useMemo(
    () => papers.find((p) => p.id === selectedPaperId) || papers[0] || null,
    [papers, selectedPaperId]
  );

  // Continuous Manuscript Stream chapters (`sec/*.tex`)
  const manuscriptSections = useMemo(() => {
    if (!currentPaper) return [];
    return currentPaper.files
      .filter(
        (f) =>
          f.kind === 'tex' &&
          !f.path.endsWith('main.tex') &&
          !f.path.endsWith('preamble.tex') &&
          !f.path.endsWith('rebuttal.tex')
      )
      .sort((a, b) => a.order - b.order);
  }, [currentPaper]);

  const activeSectionMeta = useMemo(() => {
    if (!currentPaper) return null;
    return (
      currentPaper.files.find((f) => f.path === activeSectionPath) ||
      manuscriptSections[0] ||
      currentPaper.files[0] ||
      null
    );
  }, [currentPaper, activeSectionPath, manuscriptSections]);

  // Dirty files tracking
  const dirtyFilesList = useMemo(() => {
    if (!currentPaper) return [];
    return currentPaper.files.filter((f) => {
      const draft = fileDrafts[f.path];
      return typeof draft === 'string' && draft !== f.content;
    });
  }, [currentPaper, fileDrafts]);

  // Detect `@` file mention query in Spotlight input
  const atMentionQuery = useMemo(() => {
    const match = /(?:^|\s)@([a-zA-Z0-9_.-]*)$/.exec(spotlightInput);
    if (!match) return null;
    return match[1].toLowerCase();
  }, [spotlightInput]);

  const atMentionCandidates = useMemo(() => {
    if (atMentionQuery === null) return [];
    return workspaceFiles
      .filter(
        (f) =>
          f.category !== 'manuscript' &&
          (f.name.toLowerCase().includes(atMentionQuery) ||
            f.relPath.toLowerCase().includes(atMentionQuery))
      )
      .slice(0, 6);
  }, [workspaceFiles, atMentionQuery]);

  // Save All Modified Files directly to Git-backed Disk
  const handleSaveManuscriptStream = useCallback(
    async (overrideFile?: { filePath: string; content: string }) => {
      if (!currentPaper) return;
      setSavingFile(true);
      try {
        if (
          openedWorkspaceFile &&
          openedWorkspaceFile.category !== 'figure' &&
          typeof openedWorkspaceFile.content === 'string'
        ) {
          await fetch(`/api/workspace/${currentPaper.id}/file`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              relPath: openedWorkspaceFile.relPath,
              content: openedWorkspaceFile.content,
            }),
          });
        }

        const filesToSave: { filePath: string; content: string }[] = [];
        if (overrideFile) {
          filesToSave.push(overrideFile);
        }

        currentPaper.files.forEach((f) => {
          if (overrideFile && f.path === overrideFile.filePath) return;
          const draft = fileDrafts[f.path];
          if (typeof draft === 'string' && draft !== f.content) {
            filesToSave.push({ filePath: f.path, content: draft });
          }
        });

        if (filesToSave.length === 0 && activeSectionMeta) {
          const contentToSave =
            fileDrafts[activeSectionMeta.path] ?? activeSectionMeta.content ?? '';
          filesToSave.push({ filePath: activeSectionMeta.path, content: contentToSave });
        }

        const resp = await fetch(`/api/papers/${currentPaper.id}/files-batch`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files: filesToSave,
          }),
        });
        const data = await resp.json();
        if (data?.ok) {
          const updatedHashes: Record<string, string> = {};
          (data.files || []).forEach((item: { filePath: string; hash: string }) => {
            updatedHashes[item.filePath] = item.hash;
          });
          setFileHashes((prev) => ({ ...prev, ...updatedHashes }));
          setSaveBanner('✓');
          await fetchPapers();
          await fetchWorkspaceTree(currentPaper.id);
          setTimeout(() => setSaveBanner(null), 2000);
        }
      } catch (e) {
        console.error('Failed to save manuscript stream:', e);
      } finally {
        setSavingFile(false);
      }
    },
    [
      currentPaper,
      fileDrafts,
      activeSectionMeta,
      openedWorkspaceFile,
      fetchPapers,
      fetchWorkspaceTree,
    ]
  );

  // Keyboard shortcut Cmd/Ctrl+S
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveManuscriptStream();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSaveManuscriptStream]);

  // Scroll to a specific chapter smoothly
  const scrollToSection = (filePath: string) => {
    setOpenedWorkspaceFile(null);
    setActiveSectionPath(filePath);
    setTimeout(() => {
      const editorEl = sectionRefs.current[filePath];
      if (editorEl) {
        editorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      const previewEl = previewRefs.current[filePath];
      if (previewEl) {
        previewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 30);
  };

  // Open any file from the Workspace Drawer
  const handleOpenWorkspaceFile = async (item: WorkspaceFileItem) => {
    if (item.category === 'manuscript') {
      scrollToSection(item.relPath);
      setShowWorkspaceDrawer(false);
      return;
    }

    if (item.category === 'figure') {
      setOpenedWorkspaceFile({
        relPath: item.relPath,
        name: item.name,
        ext: item.ext,
        category: 'figure',
        url: item.url,
      });
      setShowWorkspaceDrawer(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/workspace/${selectedPaperId}/file?path=${encodeURIComponent(item.relPath)}`
      ).then((r) => r.json());
      if (typeof res?.content === 'string') {
        setOpenedWorkspaceFile({
          relPath: item.relPath,
          name: item.name,
          ext: item.ext,
          category: item.category,
          content: res.content,
        });
        setShowWorkspaceDrawer(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create a new Markdown Experiment Record / Conclusion file in `<paper>/results/`
  const handleCreateExperimentNote = async () => {
    if (!currentPaper) return;
    const baseDir = currentPaper.rootDir.split('/')[0] || 'paper_c';
    const fileName = `exp_note_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${Date.now()
      .toString()
      .slice(-3)}.md`;
    const relPath = `${baseDir}/results/${fileName}`;
    const initialContent = `# Experiment Record & Findings (${currentPaper.code})\n\n## 1. Setup & Hypothesis\n- Model / Backbone:\n- Dataset:\n\n## 2. Quantitative Results\n| Method | Metric 1 | Metric 2 |\n|---|---|---|\n| Baseline | - | - |\n| Proposed | - | - |\n\n## 3. Key Takeaways for Manuscript\n- \n`;

    await fetch(`/api/workspace/${currentPaper.id}/file`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ relPath, content: initialContent }),
    });
    await fetchWorkspaceTree(currentPaper.id);
    setOpenedWorkspaceFile({
      relPath,
      name: fileName,
      ext: '.md',
      category: 'experiment',
      content: initialContent,
    });
    setShowWorkspaceDrawer(false);
  };

  // Toggle Pinning a file for explicit LLM Context
  const togglePinContextFile = (relPath: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPinnedContextFiles((prev) =>
      prev.includes(relPath) ? prev.filter((p) => p !== relPath) : [...prev, relPath]
    );
  };

  // Asset URL Map for Live Typeset Preview
  const assetUrlMap = useMemo(() => {
    const map: Record<string, string> = {};
    workspaceFiles
      .filter((f) => f.category === 'figure')
      .forEach((a) => {
        map[a.name] = a.url;
        map[a.relPath] = a.url;
        map[`fig/${a.name}`] = a.url;
      });
    return map;
  }, [workspaceFiles]);

  // Live Word & Page Stats
  const livePaperStats = useMemo(() => {
    if (!currentPaper) {
      return { totalWords: 0, estimatedPages: 0 };
    }
    let totalWords = 0;
    manuscriptSections.forEach((f) => {
      const text = fileDrafts[f.path] ?? f.content ?? '';
      const stripped = text
        .replace(/%.*$/gm, ' ')
        .replace(/\\(begin|end)\{[^}]+\}/g, ' ')
        .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?(?:\{([^}]*)\})?/g, ' $1 ')
        .replace(/[{}~^_$&]/g, ' ')
        .trim();
      const words = stripped ? stripped.split(/\s+/).length : 0;
      if (!f.path.endsWith('X_suppl.tex')) {
        totalWords += words;
      }
    });
    const estimatedPages = Number((totalWords / 680 + 1.4).toFixed(2));
    return { totalWords, estimatedPages };
  }, [currentPaper, manuscriptSections, fileDrafts]);

  // Trigger AI Agent via Spotlight or Unified Floating Selection Card
  const handleRunSpotlightCommand = async (
    presetMode?:
      | 'polish'
      | 'condense'
      | 'rewrite'
      | 'cvpr_polish'
      | 'compress_20'
      | 'reviewer_defense'
      | 'zh_to_en_academic'
      | 'citation_match'
      | 'data_sync'
      | 'custom',
    overrideInstruction?: string,
    overrideTarget?: {
      filePath: string;
      sectionTitle: string;
      text: string;
    }
  ) => {
    const rawCommand = (overrideInstruction ?? spotlightInput).trim();
    setShowSpotlightPresets(false);
    setAgentContextMenu(null);

    // If user asks to draw/generate an SVG figure directly in Spotlight
    if (
      !presetMode &&
      /^(生成配图|配图|画图|绘制|draw figure|generate figure)/i.test(rawCommand) &&
      !selectedSnippet?.text &&
      !overrideTarget
    ) {
      setSpotlightLoading(true);
      try {
        const resp = await fetch('/api/ai/generate-figure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paperId: selectedPaperId,
            prompt: rawCommand,
            channel: aiChannel,
            modelName: aiChannel === 'studio' ? studioModel : openaiModel,
            openaiBaseUrl,
          }),
        });
        const data = await resp.json();
        if (data?.ok && data?.relPath) {
          await fetchWorkspaceTree(selectedPaperId);
          setOpenedWorkspaceFile({
            relPath: data.relPath,
            name: data.fileName,
            ext: '.svg',
            category: 'figure',
            url: data.assetUrl,
          });
          setSpotlightInput('');
          setSpotlightStatusMsg(`✓ ${data.fileName}`);
          setTimeout(() => setSpotlightStatusMsg(null), 3500);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSpotlightLoading(false);
      }
      return;
    }

    const targetFilePath =
      overrideTarget?.filePath ||
      selectedSnippet?.filePath ||
      activeSectionMeta?.path ||
      manuscriptSections[0]?.path ||
      '';
    const targetSectionTitle =
      overrideTarget?.sectionTitle ||
      selectedSnippet?.sectionTitle ||
      activeSectionMeta?.title ||
      'Manuscript Section';
    const fullSectionText = fileDrafts[targetFilePath] ?? '';
    const textToPolish =
      overrideTarget?.text ||
      (selectedSnippet && selectedSnippet.text.trim().length > 0
        ? selectedSnippet.text
        : fullSectionText);

    if (!textToPolish.trim()) return;

    const modeToUse = presetMode || 'custom';
    const promptToUse =
      modeToUse === 'custom'
        ? rawCommand ||
          'Polish this LaTeX section for CVPR publication clarity and ground in project experimental files.'
        : rawCommand;

    setSpotlightLoading(true);
    try {
      const resp = await fetch('/api/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperId: selectedPaperId,
          sectionTitle: targetSectionTitle,
          selectedText: textToPolish,
          mode: modeToUse,
          customPrompt: promptToUse,
          pinnedFiles: pinnedContextFiles,
          channel: aiChannel,
          modelName: aiChannel === 'studio' ? studioModel : openaiModel,
          openaiBaseUrl,
        }),
      });
      const data = await resp.json();
      if (data?.revisedLatex) {
        setSpotlightResult({
          filePath: targetFilePath,
          sectionTitle: targetSectionTitle,
          originalText: data.originalText,
          revisedText: data.revisedLatex,
          explanation: data.explanation || data.rationale,
          wordsBefore: data.wordsBefore,
          wordsAfter: data.wordsAfter,
          matchedFiles: data.matchedFiles || [],
          channelUsed: data.channelUsed,
          modelUsed: data.modelUsed,
        });
        setSpotlightInput('');
        setContextMenuInput('');
      }
    } catch (e) {
      console.error('AI Spotlight polish failed:', e);
    } finally {
      setSpotlightLoading(false);
    }
  };

  const handleAcceptSpotlightDiff = async () => {
    if (!spotlightResult) return;
    const { filePath, originalText, revisedText } = spotlightResult;
    const currentText = fileDrafts[filePath] ?? '';
    let updatedContent = currentText;

    if (currentText.includes(originalText)) {
      updatedContent = currentText.replace(originalText, revisedText);
    } else {
      updatedContent = revisedText;
    }

    setFileDrafts((prev) => ({ ...prev, [filePath]: updatedContent }));
    await handleSaveManuscriptStream({ filePath, content: updatedContent });
    setSpotlightResult(null);
    setSelectedSnippet(null);
  };

  // Native PDF Compilation Handler
  const handleCompileNativePdf = async () => {
    if (!currentPaper) return;
    setCompilingPdf(true);
    try {
      await handleSaveManuscriptStream();
      const resp = await fetch('/api/tex/compile-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperId: currentPaper.id }),
      });
      const data = await resp.json();
      setPdfCompileResult(data);
      if (data?.pdfUrl) {
        setPreviewRenderTarget('native_pdf');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCompilingPdf(false);
    }
  };

  const handleInstallTectonic = async () => {
    setInstallingTectonic(true);
    try {
      const resp = await fetch('/api/tex/install-tectonic', { method: 'POST' });
      const data = await resp.json();
      if (data?.ok) {
        await fetchCompilerStatus();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInstallingTectonic(false);
    }
  };

  // Process any uploaded or dropped file (.md, .json, .csv, .svg, .png, .pdf)
  const processIncomingFile = async (file: File) => {
    if (!currentPaper) return;
    setUploadingAsset(true);
    try {
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      const isText = ['.md', '.json', '.csv', '.txt', '.bib', '.tex'].includes(ext);

      if (isText) {
        const textContent = await file.text();
        const baseDir = currentPaper.rootDir.split('/')[0] || 'paper_c';
        const targetRel = `${baseDir}/results/${file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
        await fetch(`/api/workspace/${currentPaper.id}/file`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            relPath: targetRel,
            content: textContent,
          }),
        });
        await fetchWorkspaceTree(currentPaper.id);
        setPinnedContextFiles((prev) =>
          prev.includes(targetRel) ? prev : [...prev, targetRel]
        );
        setSaveBanner(`✓ @${file.name}`);
        setTimeout(() => setSaveBanner(null), 2500);
      } else {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Data = String(reader.result || '');
          const resp = await fetch('/api/assets/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paperId: currentPaper.id,
              fileName: file.name,
              base64Data,
            }),
          });
          const data = await resp.json();
          if (data?.ok) {
            await fetchWorkspaceTree(currentPaper.id);
            setSaveBanner(`✓ fig/${data.name}`);
            setTimeout(() => setSaveBanner(null), 2500);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingAsset(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processIncomingFile(file);
  };

  // Global Canvas Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingOverCanvas) setIsDraggingOverCanvas(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOverCanvas(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverCanvas(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) await processIncomingFile(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseDown={(e) => {
        // Close floating card on mouse down outside the floating card
        if (agentContextMenu && !(e.target as HTMLElement)?.closest?.('.agent-floating-card')) {
          setAgentContextMenu(null);
        }
      }}
      className="h-screen flex flex-col bg-[#FBFBF9] text-[#1D1D1F] overflow-hidden select-none relative"
    >
      {/* =====================================================================
          DRAG-AND-DROP FULL-SCREEN TRANSLUCENT OVERLAY
      ===================================================================== */}
      {isDraggingOverCanvas && (
        <div className="fixed inset-3 rounded-3xl bg-white/85 backdrop-blur-2xl border-2 border-dashed border-[#0066CC]/50 z-50 flex flex-col items-center justify-center pointer-events-none">
          <Upload className="w-8 h-8 text-[#0066CC] mb-3" />
          <div className="text-sm font-semibold text-[#1D1D1F]">
            {t('dropOverlayTitle')}
          </div>
          <div className="text-xs text-[#86868B] mt-1">{t('dropOverlaySub')}</div>
        </div>
      )}

      {/* =====================================================================
          UNIFIED PROMPT-FIRST FLOATING CARD (Shared by Source & Preview Selection / Right-Click)
      ===================================================================== */}
      {agentContextMenu && (
        <div
          style={{
            left: Math.min(window.innerWidth - 360, Math.max(14, agentContextMenu.x - 140)),
            top: Math.min(window.innerHeight - 130, Math.max(52, agentContextMenu.y + 12)),
          }}
          onClick={(e) => e.stopPropagation()}
          className="agent-floating-card fixed z-50 w-[340px] bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.16)] p-2.5 select-text no-print"
        >
          {/* Row 1: Prompt-First Natural Language Input */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/[0.04] border border-black/[0.04] focus-within:border-[#0066CC]/40 focus-within:bg-white transition-all">
            <Sparkles className="w-3.5 h-3.5 text-[#0066CC] shrink-0" />
            <input
              ref={floatingInputRef}
              type="text"
              autoFocus={agentContextMenu.origin !== 'source'}
              value={contextMenuInput}
              onChange={(e) => setContextMenuInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && contextMenuInput.trim()) {
                  e.preventDefault();
                  handleRunSpotlightCommand('custom', contextMenuInput, {
                    filePath: agentContextMenu.filePath,
                    sectionTitle: agentContextMenu.sectionTitle,
                    text: agentContextMenu.targetText,
                  });
                }
              }}
              placeholder={t('ctxCustomPrompt')}
              className="flex-1 bg-transparent text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (contextMenuInput.trim()) {
                  handleRunSpotlightCommand('custom', contextMenuInput, {
                    filePath: agentContextMenu.filePath,
                    sectionTitle: agentContextMenu.sectionTitle,
                    text: agentContextMenu.targetText,
                  });
                } else {
                  handleRunSpotlightCommand('polish', undefined, {
                    filePath: agentContextMenu.filePath,
                    sectionTitle: agentContextMenu.sectionTitle,
                    text: agentContextMenu.targetText,
                  });
                }
              }}
              className="w-6 h-6 rounded-lg bg-[#1D1D1F] text-white hover:bg-black/80 flex items-center justify-center shrink-0 transition-colors"
            >
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </div>

          {/* Row 2: Only 3 Universal High-Frequency Actions (Polish · Condense · Rewrite) + Copy & Word Count */}
          <div className="mt-2 pt-1.5 border-t border-black/[0.05] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  handleRunSpotlightCommand('polish', undefined, {
                    filePath: agentContextMenu.filePath,
                    sectionTitle: agentContextMenu.sectionTitle,
                    text: agentContextMenu.targetText,
                  })
                }
                className="px-2 py-1 rounded-lg text-[#1D1D1F] hover:bg-[#0066CC] hover:text-white font-medium flex items-center gap-1 transition-colors"
              >
                <Wand2 className="w-3 h-3 opacity-80" />
                <span>{t('presetPolish')}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleRunSpotlightCommand('condense', undefined, {
                    filePath: agentContextMenu.filePath,
                    sectionTitle: agentContextMenu.sectionTitle,
                    text: agentContextMenu.targetText,
                  })
                }
                className="px-2 py-1 rounded-lg text-[#1D1D1F] hover:bg-[#0066CC] hover:text-white font-medium flex items-center gap-1 transition-colors"
              >
                <Scissors className="w-3 h-3 opacity-80" />
                <span>{t('presetCondense')}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleRunSpotlightCommand('rewrite', undefined, {
                    filePath: agentContextMenu.filePath,
                    sectionTitle: agentContextMenu.sectionTitle,
                    text: agentContextMenu.targetText,
                  })
                }
                className="px-2 py-1 rounded-lg text-[#1D1D1F] hover:bg-[#0066CC] hover:text-white font-medium flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3 opacity-80" />
                <span>{t('presetRewrite')}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[#86868B] font-mono-code text-[10px]">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(agentContextMenu.targetText);
                  setSaveBanner('✓ Copied');
                  setTimeout(() => setSaveBanner(null), 1500);
                  setAgentContextMenu(null);
                }}
                title={t('copyLatexPath')}
                className="p-1 rounded hover:bg-black/[0.05] hover:text-[#1D1D1F] transition-colors"
              >
                <Copy className="w-3 h-3" />
              </button>
              <span>{agentContextMenu.targetText.trim().split(/\s+/).length}w</span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ULTRA-MINIMALIST APPLE HEADER (44px, Zero Redundant Buttons)
      ===================================================================== */}
      <header className="h-11 px-4 bg-[#FBFBF9]/85 backdrop-blur-xl border-b border-black/[0.05] flex items-center justify-between shrink-0 z-30 no-print">
        {/* Left: Workspace Files Drawer Toggle + Paper Switcher + Quiet Stats */}
        <div className="flex items-center gap-2 min-w-0">
          <IconActionButton
            onClick={() => setShowWorkspaceDrawer(!showWorkspaceDrawer)}
            active={showWorkspaceDrawer}
            tooltip={t('workspaceFiles')}
          >
            <FolderTree className="w-4 h-4" />
          </IconActionButton>

          <select
            value={selectedPaperId}
            onChange={(e) => {
              const newId = e.target.value;
              setSelectedPaperId(newId);
              const nextPaper = papers.find((p) => p.id === newId);
              const firstSec = nextPaper?.files.find(
                (f) => f.kind === 'tex' && !f.path.endsWith('main.tex')
              );
              if (firstSec) setActiveSectionPath(firstSec.path);
            }}
            className="text-xs font-medium text-[#1D1D1F] bg-transparent hover:bg-black/[0.04] px-2 py-1 rounded-md cursor-pointer focus:outline-none transition-colors truncate max-w-[260px] sm:max-w-[360px]"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} · {p.title}
              </option>
            ))}
          </select>

          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#86868B] font-mono-code">
            <span aria-hidden="true">·</span>
            <span>
              {livePaperStats.totalWords} {t('words')}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              ~{livePaperStats.estimatedPages}/{currentPaper?.pageLimit || 8} {t('pages')}
            </span>
            {dirtyFilesList.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#0066CC]">
                  {dirtyFilesList.length} {t('unsaved')}
                </span>
              </>
            )}
            {saveBanner && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700">{saveBanner}</span>
              </>
            )}
          </div>
        </div>

        {/* Center: Pure 3-State Focus Mode Dock (Seamless Split / Zen Writing / Paper Review) */}
        <div className="flex items-center gap-0.5 p-0.5 bg-black/[0.04] rounded-xl">
          <IconActionButton
            onClick={() => setCanvasMode('split')}
            active={canvasMode === 'split'}
            tooltip={t('modeSplit')}
          >
            <Columns2 className="w-3.5 h-3.5" />
          </IconActionButton>
          <IconActionButton
            onClick={() => setCanvasMode('zen')}
            active={canvasMode === 'zen'}
            tooltip={t('modeZen')}
          >
            <PenTool className="w-3.5 h-3.5" />
          </IconActionButton>
          <IconActionButton
            onClick={() => setCanvasMode('review')}
            active={canvasMode === 'review'}
            tooltip={t('modeReview')}
          >
            <Eye className="w-3.5 h-3.5" />
          </IconActionButton>
        </div>

        {/* Right: Distilled to Essential 3 Actions (Save, Compile/Export PDF, Settings) */}
        <div className="flex items-center gap-1">
          <IconActionButton
            onClick={() => handleSaveManuscriptStream()}
            disabled={savingFile}
            tooltip={savingFile ? t('saving') : t('save')}
          >
            <Save className="w-3.5 h-3.5" />
          </IconActionButton>

          <IconActionButton
            onClick={handleCompileNativePdf}
            disabled={compilingPdf}
            tooltip={compilingPdf ? t('compiling') : t('compilePdf')}
          >
            {compilingPdf ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0066CC]" />
            ) : (
              <Terminal className="w-3.5 h-3.5" />
            )}
          </IconActionButton>

          <IconActionButton onClick={() => window.print()} tooltip={t('printPdf')}>
            <Printer className="w-3.5 h-3.5" />
          </IconActionButton>

          <IconActionButton
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            active={showSettingsDrawer}
            tooltip={t('settings')}
          >
            <Settings2 className="w-3.5 h-3.5" />
          </IconActionButton>
        </div>
      </header>

      {/* =====================================================================
          MAIN WORKSPACE BODY
      ===================================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* TOP-LEFT UNIFIED WORKSPACE DRAWER (All .tex, Experiments/Docs, Figures, BibTeX) */}
        {showWorkspaceDrawer && (
          <div className="absolute top-2 left-4 w-84 bg-white/95 backdrop-blur-2xl border border-black/[0.07] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-40 p-4 select-text no-print flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-black/[0.05]">
              <span className="text-xs font-semibold text-[#1D1D1F]">
                {t('workspaceFiles')}
              </span>
              <button
                onClick={() => setShowWorkspaceDrawer(false)}
                className="p-1 text-[#86868B] hover:text-[#1D1D1F] rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4-Category Filter Tabs inside Drawer */}
            <div className="grid grid-cols-4 gap-0.5 p-0.5 bg-black/[0.04] rounded-lg mb-3 text-[11px]">
              {(
                [
                  ['manuscript', t('tabChapters')],
                  ['experiment', t('tabExperiments')],
                  ['figure', t('tabFigures')],
                  ['config', t('tabConfig')],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setWorkspaceTab(key)}
                  className={`py-1 px-1.5 rounded-md font-medium truncate transition-all ${
                    workspaceTab === key
                      ? 'bg-white text-[#1D1D1F] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
              {workspaceTab === 'manuscript' &&
                manuscriptSections.map((sec, idx) => {
                  const isActive =
                    sec.path === activeSectionPath && !openedWorkspaceFile;
                  const draft = fileDrafts[sec.path] ?? sec.content ?? '';
                  const isDirty = draft !== sec.content;
                  return (
                    <button
                      key={sec.path}
                      onClick={() => {
                        scrollToSection(sec.path);
                        setShowWorkspaceDrawer(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-black/[0.06] text-[#1D1D1F] font-medium'
                          : 'text-[#515154] hover:bg-black/[0.03] hover:text-[#1D1D1F]'
                      }`}
                    >
                      <span className="truncate">
                        §{idx} · {sec.title.replace(/^\d+\.\s*/, '')}
                      </span>
                      <span className="font-mono-code text-[10px] text-[#86868B] shrink-0 ml-2">
                        {isDirty ? t('edited') : `${sec.words}w`}
                      </span>
                    </button>
                  );
                })}

              {workspaceTab !== 'manuscript' &&
                workspaceFiles
                  .filter((f) => f.category === workspaceTab)
                  .map((item) => {
                    const isPinned = pinnedContextFiles.includes(item.relPath);
                    const isOpened = openedWorkspaceFile?.relPath === item.relPath;
                    return (
                      <div
                        key={item.relPath}
                        onClick={() => handleOpenWorkspaceFile(item)}
                        className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          isOpened
                            ? 'bg-black/[0.06] text-[#1D1D1F] font-medium'
                            : 'text-[#515154] hover:bg-black/[0.03] hover:text-[#1D1D1F]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {item.category === 'figure' ? (
                            <ImageIcon className="w-3.5 h-3.5 text-[#86868B] shrink-0" />
                          ) : (
                            <FileCode2 className="w-3.5 h-3.5 text-[#86868B] shrink-0" />
                          )}
                          <div className="truncate">
                            <div className="truncate font-mono-code text-[11px]">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-[#86868B] truncate">
                              {item.relPath}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {item.category === 'figure' ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const snippet = `\\includegraphics[width=\\linewidth]{fig/${item.name}}`;
                                navigator.clipboard.writeText(snippet);
                                setSaveBanner('✓ Copied');
                                setTimeout(() => setSaveBanner(null), 1800);
                              }}
                              title={t('copyLatexPath')}
                              className="p-1 rounded text-[#86868B] hover:text-[#1D1D1F] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => togglePinContextFile(item.relPath, e)}
                              title={t('pinForAi')}
                              className={`p-1 rounded transition-opacity ${
                                isPinned
                                  ? 'text-[#0066CC] opacity-100'
                                  : 'text-[#86868B] opacity-0 group-hover:opacity-100 hover:text-[#1D1D1F]'
                              }`}
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
            </div>

            {/* Bottom Upload & New Experiment Record Actions */}
            <div className="mt-3 pt-3 border-t border-black/[0.05] flex items-center gap-1.5">
              <input
                ref={uploadInputRef}
                type="file"
                accept=".md,.json,.csv,.txt,.bib,.tex,.svg,.png,.jpg,.jpeg,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => uploadInputRef.current?.click()}
                disabled={uploadingAsset}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-black/[0.04] hover:bg-black/[0.07] text-[11px] font-medium text-[#1D1D1F] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3 h-3" />
                <span className="truncate">
                  {uploadingAsset ? '...' : t('uploadFile')}
                </span>
              </button>
              <button
                onClick={handleCreateExperimentNote}
                title={t('newNote')}
                className="p-1.5 rounded-lg bg-black/[0.04] hover:bg-black/[0.07] text-[#1D1D1F] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            SPATIAL MODES: SEAMLESS SPLIT / ZEN WRITING / PAPER REVIEW
        ===================================================================== */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT OR CENTER: CONTINUOUS MANUSCRIPT STREAM OR OPENED WORKSPACE FILE */}
          {(canvasMode === 'split' || canvasMode === 'zen') && (
            <div
              className={`h-full overflow-y-auto select-text transition-all ${
                canvasMode === 'zen' ? 'w-full' : 'w-1/2'
              }`}
            >
              <div
                className={`mx-auto px-8 sm:px-14 pt-10 pb-40 ${
                  canvasMode === 'zen' ? 'max-w-3xl' : 'max-w-2xl'
                }`}
              >
                {/* Whisper-Quiet Manuscript Header */}
                <div className="pb-7 mb-8 border-b border-black/[0.05]">
                  <div className="text-[11px] text-[#86868B] mb-1.5 font-mono-code">
                    {currentPaper?.venue} · {currentPaper?.code}
                  </div>
                  <h1
                    className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] tracking-tight leading-snug font-serif-editorial"
                    style={{ textWrap: 'balance' }}
                  >
                    {currentPaper?.title}
                  </h1>

                  {/* If viewing/editing an experiment log, bib file, or figure from the folder */}
                  {openedWorkspaceFile && (
                    <div className="mt-4 flex items-center justify-between py-2 px-3 bg-black/[0.03] rounded-xl text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono-code text-[#1D1D1F] truncate">
                          {openedWorkspaceFile.relPath}
                        </span>
                      </div>
                      <button
                        onClick={() => setOpenedWorkspaceFile(null)}
                        className="text-[#0066CC] hover:underline font-medium shrink-0 ml-3"
                      >
                        {t('returnStream')}
                      </button>
                    </div>
                  )}
                </div>

                {/* Opened Workspace File View OR Continuous Manuscript Stream */}
                {openedWorkspaceFile ? (
                  openedWorkspaceFile.category === 'figure' ? (
                    <div className="space-y-4">
                      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 flex items-center justify-center">
                        <img
                          src={openedWorkspaceFile.url}
                          alt={openedWorkspaceFile.name}
                          className="max-h-[60vh] object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-black/[0.05] font-mono-code text-xs text-[#515154]">
                        <span>
                          \includegraphics[width=\linewidth]&#123;fig/{openedWorkspaceFile.name}
                          &#125;
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `\\includegraphics[width=\\linewidth]{fig/${openedWorkspaceFile.name}}`
                            );
                            setSaveBanner('✓ Copied');
                            setTimeout(() => setSaveBanner(null), 1800);
                          }}
                          className="text-[#0066CC] hover:underline"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <AutoGrowSectionTextarea
                        value={openedWorkspaceFile.content ?? ''}
                        onChange={(val) =>
                          setOpenedWorkspaceFile((prev) =>
                            prev ? { ...prev, content: val } : null
                          )
                        }
                        onFocus={() => {}}
                        onSelectText={(text, start, end, coords) => {
                          if (text.trim().length > 0) {
                            setSelectedSnippet({
                              filePath: openedWorkspaceFile.relPath,
                              sectionTitle: openedWorkspaceFile.name,
                              text,
                              start,
                              end,
                              origin: 'source',
                              triggerTs: Date.now(),
                            });
                            if (coords) {
                              setAgentContextMenu({
                                x: coords.x,
                                y: coords.y,
                                filePath: openedWorkspaceFile.relPath,
                                sectionTitle: openedWorkspaceFile.name,
                                targetText: text,
                                isSelection: true,
                                origin: 'source',
                              });
                            }
                          } else {
                            setSelectedSnippet(null);
                          }
                        }}
                        onContextMenuRequest={(sel, start, end, e) => {
                          e.preventDefault();
                          setAgentContextMenu({
                            x: e.clientX,
                            y: e.clientY,
                            filePath: openedWorkspaceFile.relPath,
                            sectionTitle: openedWorkspaceFile.name,
                            targetText: sel,
                            isSelection: end > start,
                            origin: 'source',
                          });
                        }}
                      />
                    </div>
                  )
                ) : (
                  <div className="space-y-12">
                    {manuscriptSections.map((sec, idx) => {
                      const content = fileDrafts[sec.path] ?? sec.content ?? '';
                      const isDirty = content !== sec.content;
                      const isFocused = activeSectionPath === sec.path;
                      const isSyncedFromPreview =
                        selectedSnippet?.filePath === sec.path &&
                        selectedSnippet?.origin === 'preview';

                      return (
                        <div
                          key={sec.path}
                          ref={(el) => {
                            sectionRefs.current[sec.path] = el;
                          }}
                          className={`group relative rounded-xl transition-all ${
                            isSyncedFromPreview
                              ? 'bg-[#0066CC]/[0.03] ring-1 ring-[#0066CC]/25 px-3 py-2 -mx-3'
                              : ''
                          }`}
                        >
                          {/* Minimal Hairline Section Anchor */}
                          <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-black/[0.04]">
                            <button
                              onClick={() => scrollToSection(sec.path)}
                              className="flex items-center gap-2 text-left focus:outline-none"
                            >
                              <span
                                className={`text-xs font-medium transition-colors ${
                                  isFocused ? 'text-[#1D1D1F]' : 'text-[#86868B]'
                                }`}
                              >
                                §{idx} · {sec.title.replace(/^\d+\.\s*/, '')}
                              </span>
                              <span className="font-mono-code text-[10px] text-[#C7C7CC] opacity-0 group-hover:opacity-100 transition-opacity">
                                {sec.path.split('/').pop()}
                              </span>
                              {isSyncedFromPreview && (
                                <span className="text-[10px] text-[#0066CC] font-medium">
                                  · {t('syncedFromPreview')}
                                </span>
                              )}
                            </button>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {isDirty && (
                                <span className="text-[10px] text-[#0066CC]">
                                  {t('edited')}
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSectionPath(sec.path);
                                  setAgentContextMenu({
                                    x: e.clientX,
                                    y: e.clientY,
                                    filePath: sec.path,
                                    sectionTitle: sec.title,
                                    targetText: content,
                                    isSelection: false,
                                    origin: 'source',
                                  });
                                }}
                                title={t('polishSection')}
                                className="p-1 rounded text-[#86868B] hover:text-[#0066CC] hover:bg-black/[0.03] transition-colors"
                              >
                                <Wand2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Seamless Auto-Growing Chapter Source Editor */}
                          <AutoGrowSectionTextarea
                            value={content}
                            onFocus={() => setActiveSectionPath(sec.path)}
                            externalSelection={
                              isSyncedFromPreview && selectedSnippet
                                ? {
                                    start: selectedSnippet.start,
                                    end: selectedSnippet.end,
                                    triggerTs: selectedSnippet.triggerTs || 0,
                                  }
                                : null
                            }
                            onChange={(val) =>
                              setFileDrafts((prev) => ({
                                ...prev,
                                [sec.path]: val,
                              }))
                            }
                            onSelectText={(selected, start, end, coords) => {
                              if (selected.trim().length > 0) {
                                setActiveSectionPath(sec.path);
                                setSelectedSnippet({
                                  filePath: sec.path,
                                  sectionTitle: sec.title,
                                  text: selected,
                                  start,
                                  end,
                                  origin: 'source',
                                  triggerTs: Date.now(),
                                });
                                // Scroll the right preview section into view so both panes stay synced
                                const previewEl = previewRefs.current[sec.path];
                                if (previewEl) {
                                  previewEl.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'nearest',
                                  });
                                }
                                if (coords) {
                                  setAgentContextMenu({
                                    x: coords.x,
                                    y: coords.y,
                                    filePath: sec.path,
                                    sectionTitle: sec.title,
                                    targetText: selected,
                                    isSelection: true,
                                    origin: 'source',
                                  });
                                }
                              } else if (selectedSnippet?.filePath === sec.path) {
                                setSelectedSnippet(null);
                              }
                            }}
                            onContextMenuRequest={(sel, start, end, e) => {
                              e.preventDefault();
                              setActiveSectionPath(sec.path);
                              if (end > start) {
                                setSelectedSnippet({
                                  filePath: sec.path,
                                  sectionTitle: sec.title,
                                  text: sel,
                                  start,
                                  end,
                                  origin: 'source',
                                  triggerTs: Date.now(),
                                });
                              }
                              const previewEl = previewRefs.current[sec.path];
                              if (previewEl) {
                                previewEl.scrollIntoView({
                                  behavior: 'smooth',
                                  block: 'nearest',
                                });
                              }
                              setAgentContextMenu({
                                x: e.clientX,
                                y: e.clientY,
                                filePath: sec.path,
                                sectionTitle: sec.title,
                                targetText: sel,
                                isSelection: end > start,
                                origin: 'source',
                              });
                            }}
                            placeholder={`LaTeX (${sec.title})...`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RIGHT OR FULL: SEAMLESS PAPER CANVAS PREVIEW */}
          {(canvasMode === 'split' || canvasMode === 'review') && (
            <div
              className={`group/preview h-full overflow-y-auto select-text transition-all ${
                canvasMode === 'review' ? 'w-full' : 'w-1/2'
              } bg-[#F4F4F1]/55`}
            >
              {/* Whisper-quiet floating icon controls on top-right of preview */}
              <div className="sticky top-3 z-20 px-6 flex items-center justify-between pointer-events-none no-print">
                <span className="text-[10px] text-[#86868B] opacity-0 group-hover/preview:opacity-80 transition-opacity bg-white/75 backdrop-blur-md px-2.5 py-1 rounded-lg">
                  {t('previewHint')}
                </span>

                <div className="pointer-events-auto flex items-center gap-0.5 bg-white/80 backdrop-blur-xl border border-black/[0.05] rounded-xl p-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] opacity-30 group-hover/preview:opacity-100 transition-opacity duration-200">
                  <IconActionButton
                    onClick={() => setPreviewRenderTarget('cvpr_sim')}
                    active={previewRenderTarget === 'cvpr_sim'}
                    tooltip={t('liveTypeset')}
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </IconActionButton>
                  <IconActionButton
                    onClick={() => {
                      setPreviewRenderTarget('native_pdf');
                      if (!pdfCompileResult?.pdfUrl) {
                        handleCompileNativePdf();
                      }
                    }}
                    active={previewRenderTarget === 'native_pdf'}
                    tooltip={t('compiledPdf')}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                  </IconActionButton>
                  {previewRenderTarget === 'cvpr_sim' && (
                    <IconActionButton
                      onClick={() => setTwoColumnPreview(!twoColumnPreview)}
                      active={twoColumnPreview}
                      tooltip={t('twoCol')}
                    >
                      <Columns className="w-3.5 h-3.5" />
                    </IconActionButton>
                  )}
                  <IconActionButton
                    onClick={() =>
                      setCanvasMode(canvasMode === 'review' ? 'split' : 'review')
                    }
                    tooltip={t('fullscreenReview')}
                  >
                    {canvasMode === 'review' ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </IconActionButton>
                </div>
              </div>

              {previewRenderTarget === 'native_pdf' ? (
                <div className="h-[calc(100%-3rem)] px-6 pb-24 flex flex-col">
                  {pdfCompileResult?.pdfUrl ? (
                    <iframe
                      src={pdfCompileResult.pdfUrl}
                      className="w-full flex-1 rounded-xl border border-black/[0.06] bg-white shadow-sm"
                      title="Compiled Paper PDF"
                    />
                  ) : (
                    <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-black/[0.06] text-center space-y-4">
                      <p className="text-sm font-semibold text-[#1D1D1F]">
                        {t('texEngineTitle')} ({compilerStatus?.preferredEngine || 'Tectonic'})
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        {!compilerStatus?.hasNativeCompiler && (
                          <button
                            onClick={handleInstallTectonic}
                            disabled={installingTectonic}
                            className="px-4 py-2 rounded-lg text-xs font-medium bg-[#1D1D1F] text-white hover:bg-black/80"
                          >
                            {installingTectonic
                              ? t('installingTectonic')
                              : t('installTectonic')}
                          </button>
                        )}
                        <button
                          onClick={() => setPreviewRenderTarget('cvpr_sim')}
                          className="px-4 py-2 rounded-lg text-xs font-medium bg-black/[0.05] text-[#1D1D1F] hover:bg-black/[0.08]"
                        >
                          {t('liveTypeset')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-6 sm:px-10 pt-1 pb-40">
                  <div
                    className={`cvpr-print-sheet mx-auto bg-white rounded-[14px] shadow-[0_6px_32px_rgba(0,0,0,0.035)] border border-black/[0.04] px-9 py-11 transition-all ${
                      twoColumnPreview ? 'max-w-[960px]' : 'max-w-[720px]'
                    }`}
                  >
                    {/* CVPR Conference Masthead */}
                    <div className="text-center pb-6 mb-7 border-b border-black/[0.07]">
                      <div className="text-[10px] font-mono-code text-[#86868B] mb-2">
                        {currentPaper?.venue} · PAPER ID: {currentPaper?.code}
                      </div>
                      <h1
                        className="text-xl sm:text-[23px] font-semibold text-[#1D1D1F] font-serif-editorial leading-snug max-w-3xl mx-auto"
                        style={{ textWrap: 'balance' }}
                      >
                        {currentPaper?.title}
                      </h1>
                      <div className="mt-2 text-xs text-[#6E6E73] font-serif-editorial italic">
                        Anonymous Submission
                      </div>
                    </div>

                    {/* Continuous Rendered Manuscript Sections */}
                    <div
                      className={
                        twoColumnPreview
                          ? 'columns-1 lg:columns-2 gap-8 [column-fill:balance]'
                          : ''
                      }
                    >
                      {manuscriptSections.map((sec) => {
                        const content = fileDrafts[sec.path] ?? sec.content ?? '';
                        const isFocused = activeSectionPath === sec.path;
                        return (
                          <div
                            key={sec.path}
                            ref={(el) => {
                              previewRefs.current[sec.path] = el;
                            }}
                            onClick={() => setActiveSectionPath(sec.path)}
                            className={`mb-6 break-inside-avoid-column rounded-lg transition-colors cursor-pointer ${
                              isFocused ? 'bg-[#0066CC]/[0.015]' : ''
                            }`}
                          >
                            <LatexDocumentPreview
                              content={content}
                              bibEntries={currentPaper?.bibEntries || []}
                              assetUrlMap={assetUrlMap}
                              twoColumn={false}
                              highlightedLatexSnippet={
                                selectedSnippet?.filePath === sec.path
                                  ? selectedSnippet.text
                                  : undefined
                              }
                              onSelectCitation={(key) => {
                                const bibFile = workspaceFiles.find((f) => f.ext === '.bib');
                                if (bibFile) handleOpenWorkspaceFile(bibFile);
                                else {
                                  navigator.clipboard.writeText(`\\cite{${key}}`);
                                }
                              }}
                              onSelectPreview={(
                                rawBlockLatex,
                                blockKind,
                                selectedRenderedText,
                                coords
                              ) => {
                                setOpenedWorkspaceFile(null);
                                setActiveSectionPath(sec.path);
                                const resolved = resolvePreviewSelectionToLatex(
                                  content,
                                  rawBlockLatex,
                                  selectedRenderedText
                                );
                                setSelectedSnippet({
                                  filePath: sec.path,
                                  sectionTitle: `${sec.title} (${blockKind})`,
                                  text: resolved.latexSnippet,
                                  start: resolved.startOffset,
                                  end: resolved.endOffset,
                                  origin: 'preview',
                                  triggerTs: Date.now(),
                                });
                                // Scroll the homologous left source section into view automatically
                                const editorEl = sectionRefs.current[sec.path];
                                if (editorEl) {
                                  editorEl.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center',
                                  });
                                }
                                setAgentContextMenu({
                                  x: coords.x,
                                  y: coords.y,
                                  filePath: sec.path,
                                  sectionTitle: `${sec.title} (${blockKind})`,
                                  targetText: resolved.latexSnippet,
                                  isSelection: true,
                                  blockKind,
                                  origin: 'preview',
                                });
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =====================================================================
            SINGLE-LINE APPLE SPOTLIGHT CAPSULE (File-System-Aware LLM Agent)
        ===================================================================== */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-40 no-print">
          {/* @File Mention Autocomplete Popover */}
          {atMentionCandidates.length > 0 && (
            <div className="mb-2 bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] p-1.5 select-text">
              <div className="px-2 py-1 text-[10px] text-[#86868B] font-mono-code">
                @ Mention Workspace File to Pin Context
              </div>
              {atMentionCandidates.map((cand) => (
                <button
                  key={cand.relPath}
                  onClick={() => {
                    if (!pinnedContextFiles.includes(cand.relPath)) {
                      setPinnedContextFiles((prev) => [...prev, cand.relPath]);
                    }
                    setSpotlightInput((prev) =>
                      prev.replace(/(?:^|\s)@[a-zA-Z0-9_.-]*$/, ' ')
                    );
                    spotlightInputRef.current?.focus();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-black/[0.05] flex items-center justify-between"
                >
                  <span className="font-mono-code text-[#1D1D1F] truncate">
                    {cand.name}
                  </span>
                  <span className="text-[10px] text-[#86868B] truncate ml-2">
                    {cand.relPath}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Inline Diff Popover Card above Spotlight when AI returns a revision */}
          {spotlightResult && (
            <div className="mb-2.5 bg-white/95 backdrop-blur-2xl border border-black/[0.07] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.14)] p-4 select-text max-h-[54vh] flex flex-col">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-black/[0.05]">
                <div className="flex items-center gap-2 text-xs min-w-0">
                  <span className="font-semibold text-[#1D1D1F] truncate">
                    {spotlightResult.sectionTitle}
                  </span>
                  <span className="text-black/20">·</span>
                  <span className="font-mono-code text-[#86868B] shrink-0">
                    {spotlightResult.wordsBefore}w → {spotlightResult.wordsAfter}w
                  </span>
                  <span className="text-black/20">·</span>
                  <span className="text-[#0066CC] font-mono-code text-[11px] shrink-0">
                    {spotlightResult.modelUsed}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleAcceptSpotlightDiff}
                    className="px-2.5 py-1 rounded-lg bg-[#1D1D1F] text-white text-xs font-medium hover:bg-black/85 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t('applyToTex')}</span>
                  </button>
                  <button
                    onClick={() => setSpotlightResult(null)}
                    title={t('discardDiff')}
                    className="p-1 text-[#86868B] hover:text-[#1D1D1F] rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#515154] mb-2 leading-relaxed">
                {spotlightResult.explanation}
              </p>

              {spotlightResult.matchedFiles && spotlightResult.matchedFiles.length > 0 && (
                <div className="mb-2 text-[10px] font-mono-code text-[#86868B] truncate">
                  {t('filesReferenced')}: {spotlightResult.matchedFiles.join(', ')}
                </div>
              )}

              <div className="flex-1 overflow-y-auto rounded-xl bg-[#FBFBF9] border border-black/[0.04] p-3 font-mono-code text-xs space-y-0.5">
                {computeSimpleLineDiff(
                  spotlightResult.originalText,
                  spotlightResult.revisedText
                ).map((line, idx) => (
                  <div
                    key={idx}
                    className={`px-2 py-0.5 rounded whitespace-pre-wrap ${
                      line.type === 'removed'
                        ? 'bg-rose-500/10 text-rose-800 line-through'
                        : line.type === 'added'
                        ? 'bg-emerald-500/10 text-emerald-900'
                        : 'text-[#515154]'
                    }`}
                  >
                    {line.type === 'removed' ? '- ' : line.type === 'added' ? '+ ' : '  '}
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collapsible Context & Quick Presets Strip */}
          {(showSpotlightPresets ||
            (selectedSnippet && selectedSnippet.text.trim().length > 0) ||
            pinnedContextFiles.length > 0) && (
            <div className="mb-2 px-3 py-1.5 bg-white/90 backdrop-blur-xl border border-black/[0.06] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex items-center justify-between text-[11px] text-[#515154]">
              <div className="flex items-center gap-2 truncate">
                {selectedSnippet && selectedSnippet.text.trim().length > 0 ? (
                  <>
                    <span className="text-[#0066CC] font-medium">
                      {t('selectedWords')} ({selectedSnippet.text.trim().split(/\s+/).length}w)
                    </span>
                    <button
                      onClick={() => setSelectedSnippet(null)}
                      className="text-[#86868B] hover:text-[#1D1D1F]"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="text-[#86868B] truncate">
                    {t('activeContext')}: {activeSectionMeta?.title.replace(/^\d+\.\s*/, '')}
                  </span>
                )}

                {pinnedContextFiles.length > 0 && (
                  <>
                    <span className="text-black/15">·</span>
                    <span className="font-mono-code text-[10px] text-[#0066CC] truncate">
                      @{pinnedContextFiles.map((p) => p.split('/').pop()).join(', @')}
                    </span>
                    <button
                      onClick={() => setPinnedContextFiles([])}
                      className="text-[#86868B] hover:text-[#1D1D1F]"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0 ml-2">
                <button
                  onClick={() => handleRunSpotlightCommand('polish')}
                  disabled={spotlightLoading}
                  className="hover:text-[#1D1D1F] font-medium transition-colors"
                >
                  {t('presetPolish')}
                </button>
                <span className="text-black/15" aria-hidden="true">
                  ·
                </span>
                <button
                  onClick={() => handleRunSpotlightCommand('condense')}
                  disabled={spotlightLoading}
                  className="hover:text-[#1D1D1F] font-medium transition-colors"
                >
                  {t('presetCondense')}
                </button>
                <span className="text-black/15" aria-hidden="true">
                  ·
                </span>
                <button
                  onClick={() => handleRunSpotlightCommand('rewrite')}
                  disabled={spotlightLoading}
                  className="hover:text-[#1D1D1F] font-medium transition-colors"
                >
                  {t('presetRewrite')}
                </button>
              </div>
            </div>
          )}

          {/* Ultra-Sleek Single-Line Spotlight Input Capsule */}
          <div className="h-11 bg-white/85 backdrop-blur-2xl border border-black/[0.07] rounded-2xl shadow-[0_10px_34px_rgba(0,0,0,0.08)] px-3.5 flex items-center gap-2 transition-all">
            <Sparkles className="w-3.5 h-3.5 text-[#86868B] shrink-0" />

            <input
              ref={spotlightInputRef}
              type="text"
              value={spotlightInput}
              onChange={(e) => setSpotlightInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleRunSpotlightCommand('custom');
                }
              }}
              placeholder={
                selectedSnippet
                  ? t('spotlightSelectedPlaceholder')
                  : t('spotlightPlaceholder')
              }
              className="flex-1 bg-transparent text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none select-text"
            />

            {spotlightStatusMsg && (
              <span className="text-[11px] text-emerald-700 font-mono-code shrink-0">
                {spotlightStatusMsg}
              </span>
            )}

            {/* Toggle Collapsible Academic Presets */}
            <IconActionButton
              onClick={() => setShowSpotlightPresets(!showSpotlightPresets)}
              active={showSpotlightPresets}
              tooltip={t('quickPresets')}
              tooltipPosition="top"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </IconActionButton>

            {/* Silent AI Channel Switcher Icon */}
            <IconActionButton
              onClick={() =>
                setAiChannel((prev) => (prev === 'studio' ? 'openai' : 'studio'))
              }
              tooltip={`${t('switchChannel')}: ${
                aiChannel === 'studio' ? 'Studio Gemini' : openaiModel
              }`}
              tooltipPosition="top"
            >
              <span className="text-[10px] font-mono-code font-semibold text-[#0066CC]">
                {aiChannel === 'studio' ? 'G' : 'vL'}
              </span>
            </IconActionButton>

            {/* Execute Command Icon Button */}
            <button
              onClick={() => handleRunSpotlightCommand('custom')}
              disabled={spotlightLoading}
              className="w-7 h-7 rounded-xl bg-[#1D1D1F] text-white hover:bg-black/85 disabled:opacity-40 flex items-center justify-center shrink-0 transition-opacity"
            >
              {spotlightLoading ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <CornerDownLeft className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* =====================================================================
            SETTINGS DRAWER (Language, Dual-Channel AI & TeX Compiler)
        ===================================================================== */}
        {showSettingsDrawer && (
          <div className="w-88 bg-white/95 backdrop-blur-2xl border-l border-black/[0.06] h-full flex flex-col z-30 shadow-[-12px_0_40px_rgba(0,0,0,0.05)] select-text no-print">
            <div className="h-11 px-5 border-b border-black/[0.05] flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold text-[#1D1D1F]">{t('settings')}</span>
              <button
                onClick={() => setShowSettingsDrawer(false)}
                className="p-1 text-[#86868B] hover:text-[#1D1D1F] rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Bilingual UI Toggle */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]">
                  <Globe className="w-3.5 h-3.5 text-[#86868B]" />
                  <span>{t('languageLabel')}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 p-1 bg-black/[0.04] rounded-xl">
                  <button
                    onClick={() => handleSetLang('zh')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                      uiLang === 'zh'
                        ? 'bg-white text-[#1D1D1F] shadow-xs'
                        : 'text-[#515154] hover:text-[#1D1D1F]'
                    }`}
                  >
                    简体中文
                  </button>
                  <button
                    onClick={() => handleSetLang('en')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                      uiLang === 'en'
                        ? 'bg-white text-[#1D1D1F] shadow-xs'
                        : 'text-[#515154] hover:text-[#1D1D1F]'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* AI Channel Switcher */}
              <div className="pt-5 border-t border-black/[0.05] space-y-3">
                <div className="text-xs font-semibold text-[#1D1D1F]">
                  {t('aiChannelTitle')}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAiChannel('studio')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      aiChannel === 'studio'
                        ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                        : 'bg-[#FBFBF9] text-[#515154] border-black/[0.06]'
                    }`}
                  >
                    <div>{t('studioBuiltin')}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">Gemini 3.8 Flash</div>
                  </button>
                  <button
                    onClick={() => setAiChannel('openai')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      aiChannel === 'openai'
                        ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                        : 'bg-[#FBFBF9] text-[#515154] border-black/[0.06]'
                    }`}
                  >
                    <div>{t('openaiCustom')}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">vLLM / OpenAI</div>
                  </button>
                </div>

                {aiChannel === 'openai' && (
                  <div className="space-y-2.5 pt-2">
                    <div>
                      <label className="block text-[11px] text-[#86868B] mb-1">
                        {t('baseUrlLabel')}
                      </label>
                      <input
                        type="text"
                        value={openaiBaseUrl}
                        onChange={(e) => setOpenaiBaseUrl(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#FBFBF9] border border-black/[0.08] text-xs font-mono-code"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#86868B] mb-1">
                        {t('modelIdLabel')}
                      </label>
                      <input
                        type="text"
                        value={openaiModel}
                        onChange={(e) => setOpenaiModel(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#FBFBF9] border border-black/[0.08] text-xs font-mono-code"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* TeX Engine */}
              <div className="pt-5 border-t border-black/[0.05] space-y-3">
                <div className="text-xs font-semibold text-[#1D1D1F]">
                  {t('texEngineTitle')}
                </div>
                <p className="text-xs text-[#86868B] leading-relaxed">
                  {t('detectedEngine')}:{' '}
                  <strong className="text-[#1D1D1F] font-mono-code">
                    {compilerStatus?.preferredEngine || 'katex-simulation'}
                  </strong>
                </p>
                {!compilerStatus?.hasNativeCompiler && (
                  <button
                    onClick={handleInstallTectonic}
                    disabled={installingTectonic}
                    className="w-full py-2 px-3 rounded-lg bg-[#1D1D1F] text-white text-xs font-medium hover:bg-black/85"
                  >
                    {installingTectonic
                      ? t('installingTectonic')
                      : t('installTectonic')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
