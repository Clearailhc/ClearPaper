export interface FigureStyleConfig {
  palette: 'cvpr_cobalt' | 'ieee_monochrome' | 'emerald_crimson' | 'warm_editorial';
  fontScale: number;
  showGrid: boolean;
  showAnnotations: boolean;
  strokeWidth: number;
}

export interface ScientificFigureSpec {
  id: string;
  paperId: 'paper_c' | 'paper_a' | 'paper_b';
  figNumber: string;
  title: string;
  fileName: string;
  defaultSpan: 'single' | 'double' | 'strip';
  defaultWidth: string;
  label: string;
  defaultCaption: string;
  dataSourcePath: string;
}

export const SCIENTIFIC_FIGURES: ScientificFigureSpec[] = [
  {
    id: 'fig1_teaser',
    paperId: 'paper_c',
    figNumber: 'Figure 1',
    title: 'Teaser: Verdict Overexposure vs. LUX Rule-Editable Recovery (Scene S032)',
    fileName: 'fig1_teaser_overexposure.svg',
    defaultSpan: 'strip',
    defaultWidth: '\\textwidth',
    label: 'fig:teaser',
    defaultCaption:
      '\\textbf{Why verdict-trained VLMs fail when a safety rule changes---and how \\lux fixes it.} On coal-conveyor scene \\texttt{S032}, a worker smokes without gloves or mask (no open flame). Verdict-only SFT hallucinates \\texttt{open\\_fire}=0.952 and stays stuck at Grade 1 (26.2\\% accuracy on 107 changed scenes). \\lux recovers calibrated atomic facts ($q_{\\text{open\\_fire}}=0.002, q_{\\text{smoking}}=0.996$) and reaches \\textbf{88.8\\%} under the edited rule.',
    dataSourcePath: 'paper_c/results/fig1_industrial/cases.json',
  },
  {
    id: 'fig2_trace',
    paperId: 'paper_c',
    figNumber: 'Figure 2',
    title: 'System Overview: Parallel Shared-Prefix Fact Probing & Editable Noisy-OR',
    fileName: 'fig2_lux_architecture.svg',
    defaultSpan: 'double',
    defaultWidth: '0.98\\textwidth',
    label: 'fig:method-overview',
    defaultCaption:
      '\\textbf{\\lux architecture and inference trace.} One vision encode and shared-prefix KV cache drive $M=15$ single-token binary Yes/No probes in 0.297\\,s. During training, Chain-to-Fan weak labels and Noisy-OR MIL posterior $q_j^{(t)}$ prevent clipped-cell overexposure. At test time, any edited severity table $s\'(g,j)$ is applied in closed form.',
    dataSourcePath: 'paper_c/results/figdata/fig2_trace.json',
  },
  {
    id: 'fig3_calibration',
    paperId: 'paper_c',
    figNumber: 'Figure 3',
    title: 'Visible vs. Clipped-Cell False Positive Drift Across 3 Benchmarks',
    fileName: 'fig3_clipped_fp_drift.svg',
    defaultSpan: 'single',
    defaultWidth: '\\linewidth',
    label: 'fig:overexposure-drift',
    defaultCaption:
      '\\textbf{Empirical verification of the Overexposure Theorem across InspecSafe-V1, MMAD, and BDD-OIA.} Verdict-only and Level-Fill SFT inflate false-positive rates specifically on clipped cells ($s(g,j)<y$) by $1.7\\text{--}4.6\\times$, while \\lux suppresses clipped hallucinations below the zero-shot base.',
    dataSourcePath: 'paper_c/results/figdata/fig3_calibration_stats.json',
  },
  {
    id: 'fig4_dynamics',
    paperId: 'paper_c',
    figNumber: 'Figure 4',
    title: 'Per-Fact Training Exposure vs. Post-SFT Clipped False Positives',
    fileName: 'fig4_exposure_scatter.svg',
    defaultSpan: 'single',
    defaultWidth: '\\linewidth',
    label: 'fig:exposure-scatter',
    defaultCaption:
      '\\textbf{Per-fact training exposure $\\overline{\\mathrm{Exp}}_j$ vs.\\ post-SFT clipped FPR.} Low-exposure facts (co-occurring with higher-severity hazards) suffer severe false-positive inflation under verdict SFT, whereas \\lux decouples branch calibration from training-rule exposure.',
    dataSourcePath: 'paper_c/results/figdata/fig4_training_dynamics.json',
  },
  {
    id: 'fig5_v36_edits',
    paperId: 'paper_c',
    figNumber: 'Figure 5',
    title: 'V36 Pre-Registered Regulation Edits (R1, R2, R3) vs. Blind Human Labels',
    fileName: 'fig5_v36_human_eval.svg',
    defaultSpan: 'double',
    defaultWidth: '0.96\\textwidth',
    label: 'fig:v36-bars',
    defaultCaption:
      '\\textbf{Accuracy on 107 level-changed scenes under three pre-registered regulation edits (R1 stricter PPE, R2 relaxed PPE, R3 smoking downgrade).} Prompt-conditioned Direct-SFT collapses to 26.2\\%, whereas \\lux achieves 88.8\\% without retraining.',
    dataSourcePath: 'paper_c/results/figdata/fig5_rule_edits_and_cases.json',
  },
  {
    id: 'paper_a_fig1',
    paperId: 'paper_a',
    figNumber: 'Figure 1 (Paper A)',
    title: 'CalMEE: Single-Pass Soft Trigger Marginalization & Counterfactual Visual Calibration',
    fileName: 'calmee_architecture.svg',
    defaultSpan: 'double',
    defaultWidth: '0.98\\textwidth',
    label: 'fig:calmee-arch',
    defaultCaption:
      '\\textbf{Overview of \\textsc{CalMEE}.} Top bidirectional interaction layers above a causal early-fusion VLM enable single-pass soft trigger marginalization, spatial slot grounding, and counterfactual visual negative calibration ($\\Delta_{\\text{vis}}(u, I^{\\text{neg}}) \\le 0$).',
    dataSourcePath: 'paper_a/paper/sec/3_method.tex',
  },
  {
    id: 'paper_b_fig1',
    paperId: 'paper_b',
    figNumber: 'Figure 1 (Paper B)',
    title: 'PolarSet: Householder Polarity Reflection & Position-Reset alpha-Entmax Set Head',
    fileName: 'polarset_architecture.svg',
    defaultSpan: 'double',
    defaultWidth: '0.98\\textwidth',
    label: 'fig:polarset-arch',
    defaultCaption:
      '\\textbf{Overview of \\textsc{PolarSet}.} Norm-preserving Householder reflection $\\mathbf{H}(\\mathbf{u}_{\\text{op}}) = \\mathbf{I} - 2\\mathbf{u}_{\\text{op}}\\mathbf{u}_{\\text{op}}^\\top$ separates inverted comparison predicates, while position-reset $\\alpha$-Entmax ensures 100\\% permutation invariance across 10+ candidate SOPs.',
    dataSourcePath: 'paper_b/paper/sec/3_method.tex',
  },
];

function getPaletteColors(palette: FigureStyleConfig['palette']) {
  switch (palette) {
    case 'ieee_monochrome':
      return {
        primary: '#111827',
        secondary: '#4B5563',
        danger: '#374151',
        warning: '#6B7280',
        success: '#1F2937',
        bg: '#FFFFFF',
        panel: '#F9FAFB',
        border: '#D1D5DB',
      };
    case 'emerald_crimson':
      return {
        primary: '#047857',
        secondary: '#0F766E',
        danger: '#BE123C',
        warning: '#B45309',
        success: '#059669',
        bg: '#FFFFFF',
        panel: '#F8FAFC',
        border: '#CBD5E1',
      };
    case 'warm_editorial':
      return {
        primary: '#1E293B',
        secondary: '#334155',
        danger: '#991B1B',
        warning: '#92400E',
        success: '#065F46',
        bg: '#FFFDF9',
        panel: '#F8F5F0',
        border: '#D6D3D1',
      };
    case 'cvpr_cobalt':
    default:
      return {
        primary: '#1E3A8A',
        secondary: '#2563EB',
        danger: '#DC2626',
        warning: '#D97706',
        success: '#059669',
        bg: '#FFFFFF',
        panel: '#F8F9FA',
        border: '#CBD5E1',
      };
  }
}

export function renderScientificFigureSvg(
  figId: string,
  style: FigureStyleConfig = {
    palette: 'cvpr_cobalt',
    fontScale: 1,
    showGrid: true,
    showAnnotations: true,
    strokeWidth: 1.5,
  }
): string {
  const c = getPaletteColors(style.palette);
  const fs = (base: number) => Math.round(base * style.fontScale * 10) / 10;

  if (figId === 'fig1_teaser') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 310" width="100%" height="100%" style="font-family: 'Inter', -apple-system, sans-serif; background:${c.bg};">
  <rect x="4" y="4" width="912" height="302" rx="6" fill="${c.bg}" stroke="${c.border}" stroke-width="${style.strokeWidth}"/>
  <!-- Header Banner -->
  <rect x="16" y="14" width="888" height="30" rx="4" fill="${c.panel}" stroke="${c.border}" stroke-width="1"/>
  <text x="28" y="34" font-size="${fs(12)}" font-weight="700" fill="${c.primary}">FIGURE 1 · COAL CONVEYOR SCENE S032 ("CIGARETTE OR OPEN FLAME?") — RULE R3 DOWNGRADE</text>
  <text x="890" y="34" font-size="${fs(11)}" font-family="monospace" text-anchor="end" fill="#4B5563">Old Rule: Lv.1 (3) → New Rule R3: Lv.2 (2)</text>

  <!-- Panel A: Scene & Fact Ground Truth -->
  <rect x="16" y="54" width="265" height="238" rx="5" fill="${c.panel}" stroke="${c.border}" stroke-width="1"/>
  <text x="28" y="74" font-size="${fs(11)}" font-weight="700" fill="#111827">(a) Visual Facts &amp; Rule Edit R3</text>
  <rect x="28" y="84" width="241" height="92" rx="4" fill="#1E293B"/>
  <circle cx="82" cy="128" r="22" fill="#F59E0B" opacity="0.9"/>
  <rect x="64" y="146" width="36" height="24" rx="3" fill="#3B82F6"/>
  <!-- Lit cigarette indicator -->
  <line x1="98" y1="132" x2="120" y2="130" stroke="#FBBF24" stroke-width="3"/>
  <circle cx="122" cy="130" r="3.5" fill="#EF4444"/>
  <text x="136" y="114" font-size="${fs(10)}" font-family="monospace" fill="#F8FAFC">smoking = 1 (True)</text>
  <text x="136" y="130" font-size="${fs(10)}" font-family="monospace" fill="#F8FAFC">no_gloves = 1 (True)</text>
  <text x="136" y="146" font-size="${fs(10)}" font-family="monospace" fill="#F8FAFC">no_mask = 1 (True)</text>
  <text x="136" y="162" font-size="${fs(10)}" font-family="monospace" fill="#6EE7B7">open_fire = 0 (Absent)</text>

  <text x="28" y="196" font-size="${fs(10.5)}" font-weight="600" fill="#111827">Regulation Edit R3 (Coal Conveyor):</text>
  <text x="28" y="214" font-size="${fs(10)}" font-family="monospace" fill="#4B5563">• smoking: s=3 (Lv.1) → s'=1 (Lv.3)</text>
  <text x="28" y="230" font-size="${fs(10)}" font-family="monospace" fill="#4B5563">• no_gloves / no_mask: s=2 (Lv.2)</text>
  <text x="28" y="246" font-size="${fs(10)}" font-family="monospace" fill="${c.danger}">• open_fire: remains s=3 (Lv.1)</text>
  <rect x="28" y="256" width="241" height="26" rx="3" fill="#ECFDF5" stroke="${c.success}"/>
  <text x="148" y="273" font-size="${fs(10.5)}" font-weight="700" text-anchor="middle" fill="${c.success}">True New Verdict: Level 2 (y'=2)</text>

  <!-- Panel B: Verdict-Only SFT (Overexposed) -->
  <rect x="294" y="54" width="295" height="238" rx="5" fill="${c.panel}" stroke="${c.border}" stroke-width="1"/>
  <text x="306" y="74" font-size="${fs(11)}" font-weight="700" fill="${c.danger}">(b) Verdict-Only SFT (Clipped Overexposure)</text>
  <text x="306" y="92" font-size="${fs(10)}" fill="#4B5563">Trained only on R=3; co-occurring Lv.1 facts leak:</text>

  <!-- Bars for Verdict-Only -->
  <text x="306" y="116" font-size="${fs(10)}" font-family="monospace" fill="#111827">open_fire (GT=0)</text>
  <rect x="415" y="105" width="142" height="14" rx="2" fill="${c.danger}"/>
  <text x="562" y="116" font-size="${fs(10)}" font-family="monospace" font-weight="700" fill="${c.danger}">0.952</text>

  <text x="306" y="140" font-size="${fs(10)}" font-family="monospace" fill="#111827">smoking (GT=1)</text>
  <rect x="415" y="129" width="150" height="14" rx="2" fill="${c.warning}"/>
  <text x="569" y="140" font-size="${fs(10)}" font-family="monospace" fill="#111827">1.000</text>

  <text x="306" y="164" font-size="${fs(10)}" font-family="monospace" fill="#111827">no_gloves (GT=1)</text>
  <rect x="415" y="153" width="150" height="14" rx="2" fill="${c.secondary}"/>
  <text x="569" y="164" font-size="${fs(10)}" font-family="monospace" fill="#111827">1.000</text>

  <text x="306" y="188" font-size="${fs(10)}" font-family="monospace" fill="#111827">gas_cyl (GT=0)</text>
  <rect x="415" y="177" width="18" height="14" rx="2" fill="${c.danger}"/>
  <text x="438" y="188" font-size="${fs(10)}" font-family="monospace" fill="#4B5563">0.120</text>

  ${
    style.showAnnotations
      ? `<rect x="306" y="202" width="271" height="44" rx="4" fill="#FEF2F2" stroke="${c.danger}" stroke-dasharray="3,2"/>
  <text x="314" y="218" font-size="${fs(9.5)}" font-weight="600" fill="${c.danger}">Overexposure Effect (Theorem 1):</text>
  <text x="314" y="234" font-size="${fs(9.5)}" fill="#7F1D1D">Hallucinates open_fire=0.952 → blocks R3 downgrade!</text>`
      : ''
  }

  <rect x="306" y="256" width="271" height="26" rx="3" fill="#FEE2E2" stroke="${c.danger}"/>
  <text x="441" y="273" font-size="${fs(10.5)}" font-weight="700" text-anchor="middle" fill="${c.danger}">Predicted: Level 1 (WRONG · V36 Acc: 26.2%)</text>

  <!-- Panel C: LUX (Proposed) -->
  <rect x="602" y="54" width="302" height="238" rx="5" fill="${c.panel}" stroke="${c.border}" stroke-width="1"/>
  <text x="614" y="74" font-size="${fs(11)}" font-weight="700" fill="${c.primary}">(c) LUX Parallel Probes + Editable Noisy-OR</text>
  <text x="614" y="92" font-size="${fs(10)}" fill="#4B5563">Latent MIL posterior decouples facts from old rule:</text>

  <text x="614" y="116" font-size="${fs(10)}" font-family="monospace" fill="#111827">open_fire (GT=0)</text>
  <rect x="724" y="105" width="3" height="14" rx="1" fill="${c.success}"/>
  <text x="733" y="116" font-size="${fs(10)}" font-family="monospace" font-weight="700" fill="${c.success}">0.002</text>

  <text x="614" y="140" font-size="${fs(10)}" font-family="monospace" fill="#111827">smoking (GT=1)</text>
  <rect x="724" y="129" width="148" height="14" rx="2" fill="${c.primary}"/>
  <text x="876" y="140" font-size="${fs(10)}" font-family="monospace" font-weight="700" fill="${c.primary}">0.996</text>

  <text x="614" y="164" font-size="${fs(10)}" font-family="monospace" fill="#111827">no_gloves (GT=1)</text>
  <rect x="724" y="153" width="147" height="14" rx="2" fill="${c.primary}"/>
  <text x="876" y="164" font-size="${fs(10)}" font-family="monospace" font-weight="700" fill="${c.primary}">0.994</text>

  <text x="614" y="188" font-size="${fs(10)}" font-family="monospace" fill="#111827">no_mask (GT=1)</text>
  <rect x="724" y="177" width="146" height="14" rx="2" fill="${c.primary}"/>
  <text x="876" y="188" font-size="${fs(10)}" font-family="monospace" font-weight="700" fill="${c.primary}">0.991</text>

  <rect x="614" y="202" width="278" height="44" rx="4" fill="#EFF6FF" stroke="${c.primary}"/>
  <text x="622" y="218" font-size="${fs(9.5)}" font-weight="600" fill="${c.primary}">Closed-Form Noisy-OR with New s'(g,j):</text>
  <text x="622" y="234" font-size="${fs(9.5)}" font-family="monospace" fill="#1E3A8A">P(y'=2 | x) = 0.985, P(y'=3 | x) = 0.011</text>

  <rect x="614" y="256" width="278" height="26" rx="3" fill="#DCFCE7" stroke="${c.success}"/>
  <text x="753" y="273" font-size="${fs(10.5)}" font-weight="700" text-anchor="middle" fill="${c.success}">Predicted: Level 2 (CORRECT · V36 Acc: 88.8%)</text>
</svg>`;
  }

  if (figId === 'fig2_trace') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 290" width="100%" height="100%" style="font-family: 'Inter', -apple-system, sans-serif; background:${c.bg};">
  <rect x="4" y="4" width="912" height="282" rx="6" fill="${c.bg}" stroke="${c.border}" stroke-width="${style.strokeWidth}"/>
  <text x="24" y="30" font-size="${fs(13)}" font-weight="700" fill="${c.primary}">FIGURE 2 · LUX ARCHITECTURE: SHARED-PREFIX PARALLEL PROBING &amp; RULE-EDITABLE NOISY-OR</text>

  <!-- Step 1: Vision Encoder + Shared Prefix KV -->
  <rect x="24" y="48" width="200" height="216" rx="6" fill="${c.panel}" stroke="${c.primary}" stroke-width="1.5"/>
  <text x="124" y="72" font-size="${fs(11.5)}" font-weight="700" text-anchor="middle" fill="${c.primary}">1. Shared Visual Prefix</text>
  <rect x="42" y="86" width="164" height="68" rx="4" fill="#1E293B"/>
  <text x="124" y="118" font-size="${fs(10.5)}" font-weight="600" text-anchor="middle" fill="#F8FAFC">Vision Backbone (ViT)</text>
  <text x="124" y="136" font-size="${fs(9.5)}" font-family="monospace" text-anchor="middle" fill="#93C5FD">Qwen3-VL / Gemma-4</text>
  <rect x="42" y="168" width="164" height="52" rx="4" fill="#EFF6FF" stroke="${c.secondary}"/>
  <text x="124" y="190" font-size="${fs(10.5)}" font-weight="700" text-anchor="middle" fill="${c.primary}">Prefix KV Cache</text>
  <text x="124" y="206" font-size="${fs(9.5)}" font-family="monospace" text-anchor="middle" fill="#4B5563">Encoded 1× per image</text>
  <text x="124" y="244" font-size="${fs(10)}" font-family="monospace" text-anchor="middle" fill="${c.success}">Latency: 0.297s (15 probes)</text>

  <!-- Arrow 1 -> 2 -->
  <line x1="224" y1="156" x2="256" y2="156" stroke="${c.primary}" stroke-width="2"/>
  <polygon points="256,151 266,156 256,161" fill="${c.primary}"/>

  <!-- Step 2: M=15 Parallel Single-Token Probes -->
  <rect x="268" y="48" width="280" height="216" rx="6" fill="${c.panel}" stroke="${c.border}" stroke-width="1.5"/>
  <text x="408" y="72" font-size="${fs(11.5)}" font-weight="700" text-anchor="middle" fill="#111827">2. Parallel Atomic Fact Probes (M=15)</text>
  <text x="408" y="90" font-size="${fs(9.5)}" font-family="monospace" text-anchor="middle" fill="#4B5563">q_j = σ((ℓ_yes - ℓ_no) / T_j + b_j)</text>

  <rect x="284" y="102" width="248" height="28" rx="3" fill="#FFFFFF" stroke="${c.border}"/>
  <text x="294" y="120" font-size="${fs(9.5)}" font-family="monospace" fill="#111827">Q1 [open_fire]:</text>
  <text x="522" y="120" font-size="${fs(9.5)}" font-family="monospace" font-weight="700" text-anchor="end" fill="${c.success}">q_1 = 0.002</text>

  <rect x="284" y="136" width="248" height="28" rx="3" fill="#FFFFFF" stroke="${c.primary}"/>
  <text x="294" y="154" font-size="${fs(9.5)}" font-family="monospace" fill="#111827">Q4 [smoking]:</text>
  <text x="522" y="154" font-size="${fs(9.5)}" font-family="monospace" font-weight="700" text-anchor="end" fill="${c.primary}">q_4 = 0.996</text>

  <rect x="284" y="170" width="248" height="28" rx="3" fill="#FFFFFF" stroke="${c.primary}"/>
  <text x="294" y="188" font-size="${fs(9.5)}" font-family="monospace" fill="#111827">Q7 [no_gloves]:</text>
  <text x="522" y="188" font-size="${fs(9.5)}" font-family="monospace" font-weight="700" text-anchor="end" fill="${c.primary}">q_7 = 0.994</text>

  <rect x="284" y="204" width="248" height="44" rx="3" fill="#FEF3C7" stroke="${c.warning}"/>
  <text x="408" y="222" font-size="${fs(9.5)}" font-weight="600" text-anchor="middle" fill="#92400E">Training: Latent MIL Posterior q_j^(t)</text>
  <text x="408" y="238" font-size="${fs(9)}" font-family="monospace" text-anchor="middle" fill="#78350F">Zero gradient on clipped cells s(g,j) &lt; y</text>

  <!-- Arrow 2 -> 3 -->
  <line x1="548" y1="156" x2="580" y2="156" stroke="${c.primary}" stroke-width="2"/>
  <polygon points="580,151 590,156 580,161" fill="${c.primary}"/>

  <!-- Step 3: Rule-Editable Noisy-OR & VoI Escalation -->
  <rect x="592" y="48" width="304" height="216" rx="6" fill="${c.panel}" stroke="${c.success}" stroke-width="1.5"/>
  <text x="744" y="72" font-size="${fs(11.5)}" font-weight="700" text-anchor="middle" fill="${c.success}">3. Editable Noisy-OR Composition</text>

  <rect x="608" y="86" width="272" height="58" rx="4" fill="#FFFFFF" stroke="${c.border}"/>
  <text x="744" y="106" font-size="${fs(10)}" font-weight="600" text-anchor="middle" fill="#111827">Plug in Any Rule Table s'(g, j) ∈ {0,1,2,3}</text>
  <text x="744" y="128" font-size="${fs(9.5)}" font-family="monospace" text-anchor="middle" fill="${c.primary}">P(y≥k|x) = 1 - (1-λ_k) ∏_{s'(g,j)≥k} (1 - q_j)</text>

  <rect x="608" y="154" width="272" height="46" rx="4" fill="#ECFDF5" stroke="${c.success}"/>
  <text x="744" y="173" font-size="${fs(10)}" font-weight="700" text-anchor="middle" fill="${c.success}">Zero-Retraining Rule Adaptation</text>
  <text x="744" y="190" font-size="${fs(9.5)}" font-family="monospace" text-anchor="middle" fill="#065F46">CS-RPS Optimal Decision: ŷ = F⁻¹(η/(η+1))</text>

  <rect x="608" y="208" width="272" height="42" rx="4" fill="#FFFFFF" stroke="${c.border}"/>
  <text x="744" y="226" font-size="${fs(9.5)}" font-weight="600" text-anchor="middle" fill="#111827">Optional VoI Branch Escalation</text>
  <text x="744" y="241" font-size="${fs(9)}" font-family="monospace" text-anchor="middle" fill="#4B5563">Query System-2 only on argmax_j VoI(j)</text>
</svg>`;
  }

  if (figId === 'fig3_calibration') {
    const groups = [
      { name: 'InspecSafe (Clipped)', zs: 0.139, vo: 0.232, lf: 0.261, lux: 0.05 },
      { name: 'MMAD (Clipped)', zs: 0.304, vo: 0.517, lf: 0.323, lux: 0.193 },
      { name: 'BDD-OIA (Clipped)', zs: 0.043, vo: 0.199, lf: 0.145, lux: 0.021 },
    ];
    const maxVal = 0.6;
    const chartBottom = 235;
    const chartTop = 65;
    const chartHeight = chartBottom - chartTop;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 290" width="100%" height="100%" style="font-family: 'Inter', -apple-system, sans-serif; background:${c.bg};">
  <rect x="4" y="4" width="752" height="282" rx="6" fill="${c.bg}" stroke="${c.border}" stroke-width="${style.strokeWidth}"/>
  <text x="28" y="30" font-size="${fs(12.5)}" font-weight="700" fill="${c.primary}">FIGURE 3 · CLIPPED-CELL FALSE POSITIVE RATE (FPR ↓) ACROSS 3 BENCHMARKS</text>

  <!-- Legend -->
  <rect x="420" y="15" width="12" height="12" fill="#64748B" rx="2"/>
  <text x="436" y="25" font-size="${fs(10)}" fill="#111827">Zero-Shot</text>
  <rect x="500" y="15" width="12" height="12" fill="${c.danger}" rx="2"/>
  <text x="516" y="25" font-size="${fs(10)}" fill="#111827">Verdict-Only SFT</text>
  <rect x="615" y="15" width="12" height="12" fill="${c.warning}" rx="2"/>
  <text x="631" y="25" font-size="${fs(10)}" fill="#111827">Level-Fill</text>
  <rect x="692" y="15" width="12" height="12" fill="${c.success}" rx="2"/>
  <text x="708" y="25" font-size="${fs(10)}" font-weight="700" fill="${c.success}">LUX</text>

  ${
    style.showGrid
      ? [0, 0.15, 0.3, 0.45, 0.6]
          .map((v) => {
            const y = chartBottom - (v / maxVal) * chartHeight;
            return `<line x1="70" y1="${y}" x2="720" y2="${y}" stroke="#E2E8F0" stroke-dasharray="3,3"/>
            <text x="62" y="${y + 4}" font-size="${fs(9.5)}" font-family="monospace" text-anchor="end" fill="#64748B">${(v * 100).toFixed(0)}%</text>`;
          })
          .join('\n')
      : ''
  }

  <line x1="70" y1="${chartTop}" x2="70" y2="${chartBottom}" stroke="#334155" stroke-width="1.5"/>
  <line x1="70" y1="${chartBottom}" x2="720" y2="${chartBottom}" stroke="#334155" stroke-width="1.5"/>

  ${groups
    .map((g, gi) => {
      const baseX = 115 + gi * 205;
      const bars = [
        { val: g.zs, color: '#64748B', label: `${(g.zs * 100).toFixed(1)}%` },
        { val: g.vo, color: c.danger, label: `${(g.vo * 100).toFixed(1)}%` },
        { val: g.lf, color: c.warning, label: `${(g.lf * 100).toFixed(1)}%` },
        { val: g.lux, color: c.success, label: `${(g.lux * 100).toFixed(1)}%` },
      ];
      return `
      <g>
        ${bars
          .map((b, bi) => {
            const h = (b.val / maxVal) * chartHeight;
            const x = baseX + bi * 38;
            const y = chartBottom - h;
            return `<rect x="${x}" y="${y}" width="30" height="${h}" rx="2" fill="${b.color}"/>
            <text x="${x + 15}" y="${y - 5}" font-size="${fs(8.5)}" font-family="monospace" font-weight="600" text-anchor="middle" fill="${b.color}">${b.label}</text>`;
          })
          .join('\n')}
        <text x="${baseX + 72}" y="${chartBottom + 22}" font-size="${fs(11)}" font-weight="600" text-anchor="middle" fill="#111827">${g.name}</text>
      </g>`;
    })
    .join('\n')}

  ${
    style.showAnnotations
      ? `<text x="395" y="275" font-size="${fs(10)}" font-family="monospace" text-anchor="middle" fill="${c.primary}">Verdict-Only SFT inflates Clipped-Cell FPR by 1.7×–4.6× (DiD p &lt; 0.001); LUX reduces Clipped FPR below Zero-Shot.</text>`
      : ''
  }
</svg>`;
  }

  if (figId === 'fig4_dynamics') {
    const points = [
      { name: 'smoking', exp: 0.25, vo: 0.44, lux: 0.03 },
      { name: 'open_fire', exp: 0.34, vo: 0.428, lux: 0.004 },
      { name: 'gas_cylinder', exp: 0.36, vo: 0.264, lux: 0.068 },
      { name: 'no_mask', exp: 0.09, vo: 0.304, lux: 0.043 },
      { name: 'no_gloves', exp: 0.1, vo: 0.237, lux: 0.064 },
      { name: 'no_helmet', exp: 0.14, vo: 0.246, lux: 0.023 },
      { name: 'water_accum', exp: 0.16, vo: 0.181, lux: 0.038 },
      { name: 'high_alt_belt', exp: 0.52, vo: 0.063, lux: 0.035 },
    ];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 290" width="100%" height="100%" style="font-family: 'Inter', -apple-system, sans-serif; background:${c.bg};">
  <rect x="4" y="4" width="752" height="282" rx="6" fill="${c.bg}" stroke="${c.border}" stroke-width="${style.strokeWidth}"/>
  <text x="28" y="30" font-size="${fs(12.5)}" font-weight="700" fill="${c.primary}">FIGURE 4 · MEAN TRAINING FACT EXPOSURE vs. POST-SFT CLIPPED FPR (INSPECSAFE-V1)</text>

  <line x1="75" y1="55" x2="75" y2="235" stroke="#334155" stroke-width="1.5"/>
  <line x1="75" y1="235" x2="710" y2="235" stroke="#334155" stroke-width="1.5"/>

  <text x="392" y="268" font-size="${fs(10.5)}" font-weight="600" text-anchor="middle" fill="#111827">Mean Training Rule Exposure Exp_j(x) Under Official Severity Table →</text>
  <text x="22" y="145" font-size="${fs(10.5)}" font-weight="600" text-anchor="middle" fill="#111827" transform="rotate(-90 22 145)">Clipped-Cell FPR ↓</text>

  <!-- Trendline for Verdict-Only -->
  <line x1="110" y1="88" x2="660" y2="205" stroke="${c.danger}" stroke-width="1.5" stroke-dasharray="5,4"/>
  <!-- Trendline for LUX -->
  <line x1="110" y1="220" x2="660" y2="224" stroke="${c.success}" stroke-width="2"/>

  ${points
    .map((pt) => {
      const x = 90 + (pt.exp / 0.6) * 580;
      const yVo = 235 - (pt.vo / 0.5) * 170;
      const yLux = 235 - (pt.lux / 0.5) * 170;
      return `<g>
        <line x1="${x}" y1="${yVo}" x2="${x}" y2="${yLux}" stroke="#CBD5E1" stroke-dasharray="2,2"/>
        <circle cx="${x}" cy="${yVo}" r="5.5" fill="${c.danger}"/>
        <circle cx="${x}" cy="${yLux}" r="5.5" fill="${c.success}"/>
        ${
          style.showAnnotations
            ? `<text x="${x + 8}" y="${yVo + 3}" font-size="${fs(9)}" font-family="monospace" fill="#111827">${pt.name}</text>`
            : ''
        }
      </g>`;
    })
    .join('\n')}

  <rect x="490" y="56" width="210" height="48" rx="4" fill="${c.panel}" stroke="${c.border}"/>
  <circle cx="506" cy="72" r="5" fill="${c.danger}"/>
  <text x="518" y="76" font-size="${fs(9.5)}" fill="#111827">Verdict-Only SFT (V34)</text>
  <circle cx="506" cy="90" r="5" fill="${c.success}"/>
  <text x="518" y="94" font-size="${fs(9.5)}" font-weight="700" fill="${c.success}">LUX Noisy-OR MIL (V42)</text>
</svg>`;
  }

  if (figId === 'fig5_v36_edits') {
    const methods = [
      { name: 'Direct-SFT (Old Prompt)', all: 21.5, r1: 6.2, r2: 23.3, r3: 62.5, color: '#94A3B8' },
      { name: 'Direct-SFT (New Rule in Prompt)', all: 26.2, r1: 16.7, r2: 23.3, r3: 62.5, color: c.danger },
      { name: 'Rule-Cond Direct-SFT', all: 44.9, r1: 41.7, r2: 34.9, r3: 81.2, color: c.warning },
      { name: 'Direct-SFT + 200 Relabelled', all: 67.3, r1: 89.6, r2: 39.5, r3: 75.0, color: c.secondary },
      { name: 'LUX Zero-Shot (Base)', all: 83.2, r1: 95.8, r2: 65.1, r3: 93.8, color: '#0D9488' },
      { name: 'LUX (V42 Proposed)', all: 88.8, r1: 95.8, r2: 76.7, r3: 100.0, color: c.primary },
    ];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 280" width="100%" height="100%" style="font-family: 'Inter', -apple-system, sans-serif; background:${c.bg};">
  <rect x="4" y="4" width="852" height="272" rx="6" fill="${c.bg}" stroke="${c.border}" stroke-width="${style.strokeWidth}"/>
  <text x="24" y="30" font-size="${fs(12.5)}" font-weight="700" fill="${c.primary}">FIGURE 5 · V36 BLIND HUMAN EVALUATION ON 107 LEVEL-CHANGED SCENES (ACCURACY % ↑)</text>

  ${methods
    .map((m, idx) => {
      const y = 52 + idx * 35;
      const barW = (m.all / 100) * 420;
      return `<g>
        <text x="230" y="${y + 15}" font-size="${fs(10.5)}" font-weight="${idx === 5 ? '700' : '500'}" text-anchor="end" fill="#111827">${m.name}</text>
        <rect x="242" y="${y + 2}" width="${barW}" height="20" rx="3" fill="${m.color}"/>
        <text x="${248 + barW}" y="${y + 16}" font-size="${fs(10.5)}" font-family="monospace" font-weight="700" fill="${m.color}">${m.all.toFixed(1)}%</text>
        <text x="720" y="${y + 15}" font-size="${fs(9.5)}" font-family="monospace" fill="#4B5563">R1:${m.r1.toFixed(0)}% | R2:${m.r2.toFixed(0)}% | R3:${m.r3.toFixed(0)}%</text>
      </g>`;
    })
    .join('\n')}
</svg>`;
  }

  if (figId === 'paper_a_fig1') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 260" width="100%" height="100%" style="font-family: 'Inter', -apple-system, sans-serif; background:${c.bg};">
  <rect x="4" y="4" width="872" height="252" rx="6" fill="${c.bg}" stroke="${c.border}" stroke-width="${style.strokeWidth}"/>
  <text x="24" y="30" font-size="${fs(12.5)}" font-weight="700" fill="${c.primary}">PAPER A (CalMEE) · SINGLE-PASS SOFT TRIGGER MARGINALIZATION &amp; COUNTERFACTUAL VISUAL CALIBRATION</text>
  <rect x="24" y="48" width="250" height="188" rx="5" fill="${c.panel}" stroke="${c.border}"/>
  <text x="149" y="72" font-size="${fs(11)}" font-weight="700" text-anchor="middle" fill="#111827">1. Early-Fusion Causal Backbone</text>
  <text x="149" y="96" font-size="${fs(10)}" font-family="monospace" text-anchor="middle" fill="${c.primary}">Qwen3.5 (3:1 DeltaNet/GQA)</text>
  <text x="149" y="118" font-size="${fs(9.5)}" text-anchor="middle" fill="#4B5563">Schema E + Text X + Visual V</text>
  <rect x="44" y="136" width="210" height="80" rx="4" fill="#EFF6FF" stroke="${c.primary}"/>
  <text x="149" y="162" font-size="${fs(10)}" font-weight="700" text-anchor="middle" fill="${c.primary}">+ Top L_bi=3 Bidirectional Blocks</text>
  <text x="149" y="182" font-size="${fs(9.5)}" font-family="monospace" text-anchor="middle" fill="#1E3A8A">Unmasked Cross-Modal Attention</text>

  <rect x="304" y="48" width="270" height="188" rx="5" fill="${c.panel}" stroke="${c.primary}"/>
  <text x="439" y="72" font-size="${fs(11)}" font-weight="700" text-anchor="middle" fill="${c.primary}">2. Single-Pass Soft Marginalization</text>
  <text x="439" y="104" font-size="${fs(10)}" font-family="monospace" text-anchor="middle" fill="#111827">P(r=k|u,a) = Σ_m P(e=m|u)P(r=k|u,a,ẽ)</text>
  <text x="439" y="132" font-size="${fs(9.5)}" text-anchor="middle" fill="${c.success}">Eliminates CalOn 2-Step Serial Collapse</text>
  <text x="439" y="152" font-size="${fs(9.5)}" font-family="monospace" text-anchor="middle" fill="#111827">(3.6% → 36.8% M2E2 Argument F1)</text>
  <rect x="324" y="170" width="230" height="48" rx="4" fill="#FFFFFF" stroke="${c.border}"/>
  <text x="439" y="198" font-size="${fs(9.5)}" font-family="monospace" text-anchor="middle" fill="#111827">Detector-Free Spatial Slot Queries Q_box</text>

  <rect x="604" y="48" width="252" height="188" rx="5" fill="${c.panel}" stroke="${c.danger}"/>
  <text x="730" y="72" font-size="${fs(11)}" font-weight="700" text-anchor="middle" fill="${c.danger}">3. Counterfactual Visual Negatives</text>
  <text x="730" y="104" font-size="${fs(9.5)}" font-family="monospace" text-anchor="middle" fill="#111827">Δ_vis(u, I^neg) = max(0, p^(T,I^neg) - p^(T,∅))</text>
  <text x="730" y="136" font-size="${fs(9.5)}" text-anchor="middle" fill="#7F1D1D">Suppresses Visual Salience Hijacking</text>
  <rect x="624" y="160" width="212" height="56" rx="4" fill="#ECFDF5" stroke="${c.success}"/>
  <text x="730" y="184" font-size="${fs(10)}" font-weight="700" text-anchor="middle" fill="${c.success}">ECE Reduced by &gt;50% (0.048)</text>
  <text x="730" y="202" font-size="${fs(9)}" font-family="monospace" text-anchor="middle" fill="#065F46">Zero-Cost at Inference Time</text>
</svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 260" width="100%" height="100%" style="font-family: 'Inter', -apple-system, sans-serif; background:${c.bg};">
  <rect x="4" y="4" width="872" height="252" rx="6" fill="${c.bg}" stroke="${c.border}" stroke-width="${style.strokeWidth}"/>
  <text x="24" y="30" font-size="${fs(12.5)}" font-weight="700" fill="${c.primary}">PAPER B (PolarSet) · HOUSEHOLDER POLARITY REFLECTION &amp; α-ENTMAX SPARSE SET HEAD</text>
  <rect x="24" y="48" width="400" height="188" rx="5" fill="${c.panel}" stroke="${c.primary}"/>
  <text x="224" y="74" font-size="${fs(11)}" font-weight="700" text-anchor="middle" fill="${c.primary}">1. Householder Polarity Orthogonal Reflection</text>
  <text x="224" y="106" font-size="${fs(10.5)}" font-family="monospace" text-anchor="middle" fill="#111827">H(u_op) = I - 2 u_op u_op^T,   h̃ = H(u_op) h^mag</text>
  <text x="224" y="136" font-size="${fs(9.5)}" text-anchor="middle" fill="#4B5563">Exact Norm Preservation ||h̃||_2 = ||h||_2 &amp; Sign Flip on &lt; vs &gt;</text>
  <rect x="48" y="156" width="352" height="60" rx="4" fill="#ECFDF5" stroke="${c.success}"/>
  <text x="224" y="182" font-size="${fs(10)}" font-weight="700" text-anchor="middle" fill="${c.success}">DiagnosticIQ-Aug Inversion Abstention: 20.7% → 84.6%</text>
  <text x="224" y="200" font-size="${fs(9.5)}" font-family="monospace" text-anchor="middle" fill="#065F46">Eliminates Logical Inertia Under Condition Flipping</text>

  <rect x="452" y="48" width="404" height="188" rx="5" fill="${c.panel}" stroke="${c.secondary}"/>
  <text x="654" y="74" font-size="${fs(11)}" font-weight="700" text-anchor="middle" fill="${c.secondary}">2. Position-Reset Parallel RoPE + α-Entmax Set Head</text>
  <text x="654" y="106" font-size="${fs(10.5)}" font-family="monospace" text-anchor="middle" fill="#111827">p = α-entmax(z) = argmax_{p∈Δ^N} (p^T z + H_α^Tsallis(p))</text>
  <text x="654" y="136" font-size="${fs(9.5)}" text-anchor="middle" fill="#4B5563">All N=10 Candidate SOPs Reset RoPE to L_s + 1</text>
  <rect x="476" y="156" width="356" height="60" rx="4" fill="#EFF6FF" stroke="${c.primary}"/>
  <text x="654" y="182" font-size="${fs(10)}" font-weight="700" text-anchor="middle" fill="${c.primary}">100.0% Permutation Invariance &amp; Exact Sparse Zeroing</text>
  <text x="654" y="200" font-size="${fs(9.5)}" font-family="monospace" text-anchor="middle" fill="#1E3A8A">DiagnosticIQ Pro (10-Opt): 68.9% in Single 22ms Pass</text>
</svg>`;
}
