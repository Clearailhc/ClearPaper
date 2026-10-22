# Figure 1 (industrial) - InspecSafe, cases from the blind human-labelled set (research_log #124)

All numbers come from saved model outputs (Qwen3-VL-8B); truth after the rule edit = blind label of three annotators.
Script: `scripts/select_fig1_industrial.py`. Faces in the images are already pixelated by the dataset.

## Main case: images/R2_3.jpg (sheet S117, oil & gas)
Scene: a worker in a hard hat, bare hands, no mask, holding up a bottle of amber drink. No oil on the floor, no standing water.

| | old rule (official table) | new rule R2 "relaxed PPE" |
|---|---|---|
| no gloves / no mask | level one (3) | level three (1) |
| oil leakage, open flame, smoke, smoking | level one (3) | level one (3) |
| water pooling, mobile phone | level two (2) | level two (2) |
| correct level | 3 (dataset) | **1** (blind human label) |

- **Panel (a) - training under the old rule:** no gloves and no mask are both level one, so the image is already at the highest level.
  Training exposure (probability that flipping the fact changes the verdict) is **0 for every fact**, gloves and mask
  included: the label "level one" carries no information about any single fact -> blind zone.
- **Panel (b) - rule edit, baselines:**
  - verdict-only model reads oil leakage **1.00** (absent; probably the amber liquid in the bottle) -> still level **3** ✗
  - level-fill model: oil leakage **0.98**, water pooling **0.90**, oil accumulation **0.90** -> level **3** ✗
  - Direct-SFT told the new rule in its prompt -> level **3** ✗
- **Panel (c) - LUX, same table edit, no retraining:** no gloves **1.00**, no mask **1.00**, oil leakage **0.01**, water pooling **0.01**,
  all other facts < 0.05 -> level **1** ✓ (matches the human label)

Full per-fact probability vectors (15 facts) for verdict-only / level-fill / LUX, both severity rows, all predicted
levels and the exposures are in `cases.json`.

## Second row / inset: images/R1_1.jpg (sheet S124, tunnel) - stricter PPE (upgrade)
Several workers without masks or gloves. Old rule: level two; R1 makes gloves / mask level one; human label: **3**.
LUX (table edit only) -> 3 ✓; Direct-SFT with the new rule in its prompt -> 2 ✗ (and with the old prompt -> 2).
R1_2.jpg is a backup of the same kind.

## Backup: images/R2_2.jpg (sheet S014, oil & gas) - relaxed PPE
A worker has taken his orange gloves off and put them on the floor (very readable for the PPE rule). Human label 1.
Verdict-only / level-fill read mobile phone 1.00 and water pooling 1.00 -> level 2 ✗; LUX -> 1 ✓.
Caveat: a person on the right holds a device, so the 'mobile phone' reading is arguable - prefer R2_3 for the main figure.

## Aggregate numbers for the panels (blind human labels, 107 images whose level changes; research_log #120)
| system | all 107 | R1 stricter (48) | R2 relaxed (43) | R3 (16) |
|---|---|---|---|---|
| Direct-SFT, new rule in prompt | 0.262 | 0.167 | 0.233 | 0.625 |
| verdict-only training (LUX read-out) | 0.850 | 0.958 | 0.721 | 0.875 |
| level-fill SFT | 0.804 | 0.958 | 0.605 | 0.875 |
| **LUX** (seed 0 / 1) | **0.888 / 0.879** | 0.958 / 0.938 | **0.767** | 1.000 |

Masked (clipped) false-positive rate on InspecSafe test (research_log #112): zero-shot 0.139, verdict-only 0.232,
level-fill 0.295, LUX 0.050. Note: InspecSafe treats facts not written in the description as absent; the BDD-OIA
numbers (independent multi-label truth) are the clean version of this measurement.
