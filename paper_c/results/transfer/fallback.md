# Fallback to the zero-shot base for primitives with < 5 training positives (exploratory)

full train: fallback primitives ['oil_accumulation', 'foreign_object_hard']

| model | acc | acc with fallback |
|---|---|---|
| PRISM-SFT s0 level-fill | 0.960 | 0.957 |
| PRISM-SFT closed-world | 0.961 | 0.956 |

## leave one industry out

| fold | fallback primitives | Direct-LOIO | level-fill | level-fill + fallback | closed-world | closed-world + fallback |
|---|---|---|---|---|---|---|
| coal_conveyor | oil_accumulation, foreign_object_hard | 0.826 | 0.896 | 0.896 | - | - |
|  | level-fill + fallback - Direct-LOIO | +0.070 [+0.037, +0.107] p=0.000 |||||
| oil_gas | oil_leakage, oil_accumulation, foreign_object_hard | 0.829 | 0.955 | 0.922 | 0.898 | 0.906 |
|  | level-fill + fallback - Direct-LOIO | +0.094 [+0.049, +0.143] p=0.000 |||||
|  | closed-world + fallback - Direct-LOIO | +0.078 [+0.029, +0.127] p=0.000 |||||
| tunnel | oil_accumulation, foreign_object_hard, cabinet_door_open, nonmotor_vehicle | 0.934 | 0.905 | 0.911 | 0.896 | 0.892 |
|  | level-fill + fallback - Direct-LOIO | -0.022 [-0.060, +0.013] p=0.248 |||||
|  | closed-world + fallback - Direct-LOIO | -0.041 [-0.082, -0.003] p=0.049 |||||
| power | personnel_collapse, oil_accumulation, foreign_object_hard | 0.981 | 0.986 | 0.977 | - | - |
|  | level-fill + fallback - Direct-LOIO | -0.005 [-0.028, +0.019] p=0.856 |||||

## pooled over the folds each variant has

- Direct-LOIO (4 folds): acc 0.889, hazard recall 0.988, false alarm 0.036
- level-fill (4 folds): acc 0.930, hazard recall 0.952, false alarm 0.013
- level-fill + fallback (4 folds): acc 0.923, hazard recall 0.952, false alarm 0.027
- closed-world (2 folds): acc 0.897, hazard recall 0.822, false alarm 0.019
- closed-world + fallback (2 folds): acc 0.898, hazard recall 0.842, false alarm 0.041
- pooled level-fill + fallback - Direct-LOIO: +0.034 [+0.015, +0.052] p=0.000
