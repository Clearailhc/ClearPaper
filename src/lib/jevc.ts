export interface PrimitiveSpec {
  id: string;
  label: string;
  question: string;
  pos: string[];
  neg: string[];
  negatable: boolean;
}

export type IndustryId = 'oil_gas' | 'coal_conveyor' | 'tunnel' | 'power' | 'metallurgy';

export const INDUSTRIES: { id: IndustryId; name: string; code: string }[] = [
  { id: 'oil_gas', name: 'Oil & Gas / Petrochemical', code: 'IND-01' },
  { id: 'coal_conveyor', name: 'Coal Conveyor Corridor', code: 'IND-02' },
  { id: 'tunnel', name: 'Underground Utility Tunnel', code: 'IND-03' },
  { id: 'power', name: 'Power Substation & Grid', code: 'IND-04' },
  { id: 'metallurgy', name: 'Metallurgy & Sintering', code: 'IND-05' },
];

export const LEVEL_NAMES = [
  'Normal (Grade IV)',
  'Level Three (Grade III)',
  'Level Two (Grade II)',
  'Level One (Grade I · Critical)',
];

export const PRIMITIVES: PrimitiveSpec[] = [
  {
    id: 'open_flame',
    label: 'Open Flame',
    question: 'Is there an open flame or fire visible in the image?',
    pos: ['open flame', '\\bflames?\\b', '\\bfire\\b(?!\\s*(cabinet|extinguisher|hydrant|door|hose|alarm|box|fighting|protection|pipe|sprinkler|escape|exit|safety|equipment|station|detector))', 'burning'],
    neg: [],
    negatable: true,
  },
  {
    id: 'smoke',
    label: 'Abnormal Smoke',
    question: 'Is there smoke that indicates a fire or an abnormal emission? Ignore normal process smoke or steam.',
    pos: ['\\bsmoke\\b(?!\\s*detector)', 'smoky'],
    neg: [],
    negatable: true,
  },
  {
    id: 'personnel_collapse',
    label: 'Personnel Collapse',
    question: 'Is there a person who has collapsed, fallen, or is lying on the ground?',
    pos: ['collaps', 'lying on the (ground|floor)', 'fallen (person|worker)', '(person|worker|personnel) (has )?fallen', '\\bfallen\\b'],
    neg: [],
    negatable: true,
  },
  {
    id: 'smoking',
    label: 'Worker Smoking',
    question: 'Is there a person smoking (holding a lit cigarette) in the image?',
    pos: ['\\bsmoking\\b', 'cigarette'],
    neg: [],
    negatable: true,
  },
  {
    id: 'oil_leakage',
    label: 'Active Oil Leakage',
    question: 'Is oil actively leaking, dripping, or spraying from equipment or pipes?',
    pos: ['oil leak', 'leaking oil', 'oil (is )?dripping', 'oil spray', 'oil spill'],
    neg: [],
    negatable: true,
  },
  {
    id: 'no_hard_hat',
    label: 'Missing Hard Hat',
    question: 'Is there a person who is not wearing a hard hat (safety helmet)?',
    pos: [
      '(?:\\b(?:not|never|n\'t)\\s+(?:be\\s+)?(?:wearing|wear|worn|equipped with)|\\bwithout|\\black(?:ing|s)?|\\bno)\\b[^.;]{0,60}?\\b(?:hard hats?|safety helmets?|helmets?|safety hats?)',
      '\\b(?:hard hats?|safety helmets?|helmets?|safety hats?)\\s+(?:is |are )?(?:missing|absent|not worn)',
    ],
    neg: ['\\b(?:wearing|wears|with)\\b[^.;]{0,60}?\\b(?:hard hats?|safety helmets?|helmets?|safety hats?)'],
    negatable: false,
  },
  {
    id: 'no_gloves',
    label: 'Missing Gloves',
    question: 'Is there a person who is not wearing protective gloves?',
    pos: [
      '(?:\\b(?:not|never|n\'t)\\s+(?:be\\s+)?(?:wearing|wear|worn|equipped with)|\\bwithout|\\black(?:ing|s)?|\\bno)\\b[^.;]{0,60}?\\b(?:protective |work )?gloves?',
      '\\b(?:protective |work )?gloves?\\s+(?:is |are )?(?:missing|absent|not worn)',
    ],
    neg: ['\\b(?:wearing|wears|with)\\b[^.;]{0,60}?\\b(?:protective |work )?gloves?'],
    negatable: false,
  },
  {
    id: 'no_mask',
    label: 'Missing Face Mask',
    question: 'Is there a person who is not wearing a face mask?',
    pos: [
      '(?:\\b(?:not|never|n\'t)\\s+(?:be\\s+)?(?:wearing|wear|worn|equipped with)|\\bwithout|\\black(?:ing|s)?|\\bno)\\b[^.;]{0,60}?\\b(?:face |dust )?masks?',
      '\\b(?:face |dust )?masks?\\s+(?:is |are )?(?:missing|absent|not worn)',
    ],
    neg: ['\\b(?:wearing|wears|with)\\b[^.;]{0,60}?\\b(?:face |dust )?masks?'],
    negatable: false,
  },
  {
    id: 'mobile_phone',
    label: 'Mobile Phone Use',
    question: 'Is there a person using a mobile phone?',
    pos: ['(mobile|cell)? ?phone', 'smartphone'],
    neg: [],
    negatable: true,
  },
  {
    id: 'water_pooling',
    label: 'Water Pooling',
    question: 'Is there pooled or standing water on the floor or ground?',
    pos: ['water pool', 'pooling', 'puddle', 'standing water', 'accumulated water', 'water accumulation', 'liquid accumulation'],
    neg: [],
    negatable: true,
  },
  {
    id: 'oil_accumulation',
    label: 'Oil Accumulation',
    question: 'Is there accumulated oil or an oil stain on the floor or equipment?',
    pos: ['oil accumulation', 'accumulated oil', 'oil stain', 'oil (puddle|pool)', 'oily'],
    neg: [],
    negatable: true,
  },
  {
    id: 'foreign_object_light',
    label: 'Foreign Object (Light)',
    question: 'Are there foreign objects such as plastic bags, plastic bottles, foam, or paper lying around?',
    pos: ['plastic bag', 'plastic bottle', '\\bbottles?\\b', '\\bfoam\\b', '\\bpaper\\b', 'debris', 'foreign object', 'litter', 'garbage', 'trash'],
    neg: [],
    negatable: true,
  },
  {
    id: 'foreign_object_hard',
    label: 'Foreign Object (Hard)',
    question: 'Are there foreign objects such as pieces of wood or metal lying where they should not be?',
    pos: ['\\bwood(en)? (piece|plank|block|board)s?', '\\bwood\\b', 'metal (piece|object|scrap|rod|bar|debris)s?', 'scrap metal'],
    neg: [],
    negatable: true,
  },
  {
    id: 'cabinet_door_open',
    label: 'Cabinet Door Open',
    question: 'Is there an electrical or equipment cabinet door left open?',
    pos: ['cabinet door (is |left )?open', 'open cabinet', 'door of the cabinet (is )?open'],
    neg: ['cabinet door (is |are )?(closed|shut)'],
    negatable: true,
  },
  {
    id: 'nonmotor_vehicle',
    label: 'Non-Motorized Vehicle',
    question: 'Is there a non-motorized vehicle (such as a bicycle or tricycle) in a vehicle lane?',
    pos: ['bicycle', '\\bbike\\b', 'tricycle', 'non-motori[sz]ed vehicle', 'electric scooter'],
    neg: [],
    negatable: true,
  },
];

export const OFFICIAL_SEVERITY: Record<IndustryId, number[]> = {
  oil_gas:       [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 0, 1, 1, 0, 0],
  coal_conveyor: [3, 3, 3, 3, 0, 3, 2, 2, 2, 1, 0, 2, 2, 0, 0],
  tunnel:        [3, 3, 3, 1, 0, 2, 1, 1, 1, 1, 1, 2, 3, 2, 3],
  power:         [3, 3, 3, 3, 0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 0],
  metallurgy:    [3, 3, 3, 2, 0, 3, 2, 2, 1, 1, 1, 1, 1, 0, 0],
};

export interface RulePreset {
  id: string;
  name: string;
  shortName: string;
  description: string;
  affectedCount: number;
  direction: string;
  overrides: Record<string, number>;
}

export const RULE_PRESETS: RulePreset[] = [
  {
    id: 'official',
    name: 'Official InspecSafe-V1 Standard',
    shortName: 'Official Rule',
    description: 'Baseline regulatory severity matrix across 5 industrial sectors.',
    affectedCount: 0,
    direction: 'Baseline',
    overrides: {},
  },
  {
    id: 'R1_ppe_stricter',
    name: 'R1: Stricter PPE Enforcement',
    shortName: 'R1 · Stricter PPE',
    description: 'Elevates missing gloves and missing face mask to Level One (3) across all industries.',
    affectedCount: 48,
    direction: 'Upward (Level 2 → 3)',
    overrides: { no_gloves: 3, no_mask: 3 },
  },
  {
    id: 'R2_ppe_relaxed',
    name: 'R2: Relaxed PPE Regulation',
    shortName: 'R2 · Relaxed PPE',
    description: 'Relaxes missing hard hat to Level Two (2), and missing gloves / face mask to Level Three (1).',
    affectedCount: 43,
    direction: 'Downward (Level 3 → 1/2)',
    overrides: { no_hard_hat: 2, no_gloves: 1, no_mask: 1 },
  },
  {
    id: 'R3_phone_smoking_relaxed',
    name: 'R3: Smoking & Phone Downgraded',
    shortName: 'R3 · Smoking Downgraded',
    description: 'Downgrades smoking to Level Two (2) and mobile phone use to Level Three (1), while open flame remains Level One (3).',
    affectedCount: 16,
    direction: 'Downward (Level 3 → 2)',
    overrides: { smoking: 2, mobile_phone: 1 },
  },
];

export function applyRulePreset(baseRow: number[], presetId: string): number[] {
  const preset = RULE_PRESETS.find((p) => p.id === presetId);
  if (!preset || Object.keys(preset.overrides).length === 0) {
    return [...baseRow];
  }
  return PRIMITIVES.map((prim, j) => {
    if (preset.overrides[prim.id] !== undefined) {
      return preset.overrides[prim.id];
    }
    return baseRow[j];
  });
}

export function aggregateNoisyOr(
  pBranch: number[],
  severityRow: number[],
  leak: number[] = [0.004, 0.002, 0.001],
  numLevels = 4
): number[] {
  const logSurv = pBranch.map((p) => Math.log(Math.max(1e-12, Math.min(1.0, 1.0 - p))));
  const pGe = new Array(numLevels + 1).fill(1.0);
  pGe[numLevels] = 0.0;

  for (let k = 1; k < numLevels; k++) {
    let sumLogSurv = Math.log(Math.max(1e-12, 1.0 - (leak[k - 1] ?? 0)));
    for (let j = 0; j < pBranch.length; j++) {
      if (severityRow[j] >= k) {
        sumLogSurv += logSurv[j];
      }
    }
    pGe[k] = 1.0 - Math.exp(sumLogSurv);
  }

  const probs = new Array(numLevels).fill(0);
  let total = 0;
  for (let k = 0; k < numLevels; k++) {
    probs[k] = Math.max(0.0, pGe[k] - pGe[k + 1]);
    total += probs[k];
  }
  return total > 0 ? probs.map((v) => v / total) : [1, 0, 0, 0];
}

export function computeFactExposure(pBranch: number[], severityRow: number[]): number[] {
  return pBranch.map((_, j) => {
    const sj = severityRow[j];
    if (sj <= 0) return 0.0;
    let probOthersBelow = 1.0;
    for (let i = 0; i < pBranch.length; i++) {
      if (i !== j && severityRow[i] >= sj) {
        probOthersBelow *= 1.0 - pBranch[i];
      }
    }
    return probOthersBelow;
  });
}

export function computeLatentMilPosterior(
  p: number[],
  c: number[],
  m: number[],
  sev: number[],
  y: number,
  leak: number[] = [0.01, 0.01, 0.005],
  eps = 0.05,
  delta = 0.01,
  industryGate = true
): number[] {
  const J = p.length;
  const K = leak.length + 1;
  const lam = [0.0, ...leak];
  const lc = new Array(K).fill(1.0);
  for (let k = 0; k < K; k++) {
    let prod = 1.0;
    for (let t = k + 1; t < K; t++) prod *= 1.0 - lam[t];
    lc[k] = prod;
  }

  const mEff = m.map((mv, j) => (industryGate && sev[j] === 0 ? 0 : mv));
  const cEff = c.map((cv, j) => (industryGate && sev[j] === 0 ? 0 : cv));
  const dEff = sev.map((sv) => (industryGate && sv === 0 ? 0 : delta));

  const absent = p.map((pj, j) => (1 - pj) * (mEff[j] === 1 ? dEff[j] : 1 - dEff[j]));
  const present = p.map((pj, j) => (mEff[j] === 1 ? pj * cEff[j] : pj * (1 - cEff[j])));
  const mention = absent.map((aj, j) => aj + present[j]);

  const f: number[][] = Array.from({ length: J }, (_, j) =>
    Array.from({ length: K }, (__, k) => (sev[j] > k ? absent[j] : absent[j] + present[j]))
  );

  const pEqY = (F: number[]) => {
    const lo = y > 0 ? F[Math.max(0, y - 1)] : 0.0;
    return F[y] - lo;
  };

  const FAll = Array.from({ length: K }, (_, k) => {
    let prod = lc[k];
    for (let j = 0; j < J; j++) prod *= f[j][k];
    return prod;
  });

  const prodMention = mention.reduce((acc, v) => acc * v, 1.0);
  const den = (1 - eps) * pEqY(FAll) + (eps / K) * prodMention;

  return Array.from({ length: J }, (_, j) => {
    const others = Array.from({ length: K }, (__, k) => {
      let prod = lc[k];
      for (let i = 0; i < J; i++) {
        if (i !== j) prod *= f[i][k];
      }
      return prod;
    });
    const Fj = others.map((ok, k) => ok * (sev[j] > k ? 0.0 : present[j]));
    let prodMentionOthers = 1.0;
    for (let i = 0; i < J; i++) {
      if (i !== j) prodMentionOthers *= mention[i];
    }
    const num = (1 - eps) * pEqY(Fj) + (eps / K) * present[j] * prodMentionOthers;
    const val = den > 0 ? num / den : p[j];
    return Math.max(0.0, Math.min(1.0, val));
  });
}

export function costMatrix(k: number, eta: number): number[][] {
  return Array.from({ length: k }, (_, pred) =>
    Array.from({ length: k }, (__, truth) =>
      eta * Math.max(0, truth - pred) + Math.max(0, pred - truth)
    )
  );
}

export function bayesDecision(probs: number[], eta = 1.0): { level: number; expectedCosts: number[]; minCost: number } {
  const k = probs.length;
  const C = costMatrix(k, eta);
  const expectedCosts = C.map((row) => row.reduce((sum, cPredTrue, truth) => sum + cPredTrue * probs[truth], 0));
  let bestLevel = 0;
  let minCost = expectedCosts[0];
  for (let a = 1; a < k; a++) {
    if (expectedCosts[a] < minCost) {
      minCost = expectedCosts[a];
      bestLevel = a;
    }
  }
  return { level: bestLevel, expectedCosts, minCost };
}

export function csRpsSingle(probs: number[], y: number, eta = 5.0): number {
  const k = probs.length;
  let cum = 0;
  let totalLoss = 0;
  for (let m = 0; m < k - 1; m++) {
    cum += probs[m];
    const obs = y <= m ? 1.0 : 0.0;
    const under = Math.max(0.0, cum - obs);
    const over = Math.max(0.0, obs - cum);
    totalLoss += eta * under * under + over * over;
  }
  return totalLoss / (k - 1);
}

export function untiltCsRps(tiltedProbs: number[], eta: number): number[] {
  const k = tiltedProbs.length;
  const pCum: number[] = [0.0];
  let cum = 0;
  for (let m = 0; m < k - 1; m++) {
    cum = Math.max(1e-9, Math.min(1 - 1e-9, cum + tiltedProbs[m]));
    pCum.push((eta * cum) / (1.0 + (eta - 1.0) * cum));
  }
  pCum.push(1.0);
  const out: number[] = [];
  let sum = 0;
  for (let m = 0; m < k; m++) {
    const d = Math.max(0.0, pCum[m + 1] - pCum[m]);
    out.push(d);
    sum += d;
  }
  return sum > 0 ? out.map((v) => v / sum) : out;
}

export function computeBranchVoi(
  pBranch: number[],
  severityRow: number[],
  eta = 5.0,
  s2Sens = 0.94,
  s2Spec = 0.96
): { voi: number[]; baseRisk: number; topBranchIdx: number } {
  const baseProbs = aggregateNoisyOr(pBranch, severityRow);
  const { minCost: baseRisk } = bayesDecision(baseProbs, eta);

  const updatePosterior = (p: number, ansYes: boolean) => {
    if (ansYes) {
      return (s2Sens * p) / (s2Sens * p + (1 - s2Spec) * (1 - p));
    }
    return ((1 - s2Sens) * p) / ((1 - s2Sens) * p + s2Spec * (1 - p));
  };

  const voi = pBranch.map((pj, j) => {
    if (severityRow[j] === 0) return 0.0;
    const pYesObs = s2Sens * pj + (1 - s2Spec) * (1 - pj);

    const qYes = [...pBranch];
    qYes[j] = updatePosterior(pj, true);
    const riskYes = bayesDecision(aggregateNoisyOr(qYes, severityRow), eta).minCost;

    const qNo = [...pBranch];
    qNo[j] = updatePosterior(pj, false);
    const riskNo = bayesDecision(aggregateNoisyOr(qNo, severityRow), eta).minCost;

    const expectedPostRisk = pYesObs * riskYes + (1 - pYesObs) * riskNo;
    return Math.max(0.0, baseRisk - expectedPostRisk);
  });

  let topBranchIdx = 0;
  for (let j = 1; j < voi.length; j++) {
    if (voi[j] > voi[topBranchIdx]) topBranchIdx = j;
  }

  return { voi, baseRisk, topBranchIdx };
}

export function extractBranchLabelsFromText(text: string): Record<string, number> {
  const out: Record<string, number> = {};
  const clauses = text.split(/[.;!?\n]+/);
  const negCue = /\b(no|not|without|free of|absence of|neither|nor|never)\b/i;

  for (const prim of PRIMITIVES) {
    let foundPos = false;
    let foundNeg = false;

    for (const clause of clauses) {
      for (const negPat of prim.neg) {
        if (new RegExp(negPat, 'i').test(clause)) {
          foundNeg = true;
        }
      }
      for (const posPat of prim.pos) {
        const match = new RegExp(posPat, 'i').exec(clause);
        if (match) {
          if (prim.negatable) {
            const prefix = clause.slice(Math.max(0, match.index - 35), match.index);
            if (negCue.test(prefix)) {
              foundNeg = true;
            } else {
              foundPos = true;
            }
          } else {
            foundPos = true;
          }
        }
      }
    }

    if (foundPos) out[prim.id] = 1;
    else if (foundNeg) out[prim.id] = 0;
  }
  return out;
}
