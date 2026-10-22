# Figure 1 - "Cigarette or open flame?" (research_log #124)

## What the figure must do for a reviewer (10 seconds)
1. **Surprise:** a verdict-trained model is accurate under the rule it was trained on, but after a rule edit it is
   *worse than the untrained model* - because facts the old rule did not need were never constrained.
2. **Why (not a bug):** under the old rule those facts have exposure 0 - the verdict carries no information about them.
3. **Fix:** LUX reads calibrated facts and composes them with an editable rule table; edit the table, no retraining.
4. Pre-empt: "just prompt the new rule" (Direct-SFT told the rule still fails) and "cherry-picked" (population plots).

## Main image: MAIN_S032_smoking.jpg (InspecSafe test, coal conveyor gallery, sheet S032)
A worker in a yellow hard hat, **cigarette in his mouth**, bare hands, no mask. **No open flame anywhere.**

| rule | smoking | no gloves / no mask | open flame | correct level |
|---|---|---|---|---|
| old (official, coal conveyor) | level one | level two | level one | **1st (3)** - dataset |
| new R3 "smoking downgraded" | level two | level two | level one | **2nd (2)** - blind label of 3 annotators |

### Panel (a) - training under the old rule
- Smoking alone decides "level one". Training exposure (does flipping the fact change the verdict?):
  smoking **1**; open flame **0**, smoke 0, no gloves 0, no mask 0, all others 0.
- Population fact for the caption: **all 71** training images with smoking come from industries where smoking is level one
  (oil & gas 52, coal conveyor 16, power 3) -> open flame is clipped on every one of them: the verdict never says
  "this is a cigarette, not a flame".

### Panel (b) - after the edit, baselines
- verdict-only model: smoking 1.00, no gloves 1.00, no mask 1.00, **open flame 0.95** -> level **one** ✗
- level-fill model: smoking 0.89, **open flame 0.61**, smoke 0.47 -> level **one** ✗
- Direct-SFT, new rule in the prompt -> level **one** ✗ (old prompt: one)
- the untrained (zero-shot) model: open flame 0.00 -> level **two** ✓  <- training made it worse

### Panel (c) - LUX (same image, table edit only)
smoking 1.00, no gloves 1.00, no mask 1.00, **open flame 0.00**, everything else < 0.05 -> level **two** ✓

## Population evidence (bottom strip / inset) - `story.json`
| | zero-shot | verdict-only | level-fill | LUX |
|---|---|---|---|---|
| FP on clipped cells (all facts, test) | 0.139 | 0.232 | 0.295 | **0.050** |
| FP on visible cells (hazard-free images) | 0.009 | 0.000 | 0.001 | 0.001 |
| 'smoking, no flame' test images (n = 32): reads open flame | 0.00 | 0.06 | 0.09 | **0.00** |
Histograms (20 bins) for every row are in `story.json` ("all facts: clipped vs visible cells", "test: smoking, no open flame").
**Honest note:** the smoking -> flame confusion itself is uncommon (6-9% of such images); it illustrates the mechanism.
The quantitative claim rests on the clipped-cell row (all facts) and on BDD-OIA, whose facts have independent truth.

Rule-edit accuracy, blind human labels (research_log #120): R3 (16 images) - Direct-SFT + rule in prompt 0.625,
verdict-only 0.875, level-fill 0.875, **LUX 1.000**; all 107 changed images - 0.262 vs **0.888**.

## Alternatives (cases.json)
- R2_3.jpg (oil & gas, relaxed PPE): verdict-only reads oil leakage 1.00 (amber drink in a bottle) -> level one ✗; LUX -> three ✓.
- R1_1.jpg (tunnel, stricter PPE): upgrade case; Direct-SFT told the new rule stays at level two ✗, LUX -> one ✓.
