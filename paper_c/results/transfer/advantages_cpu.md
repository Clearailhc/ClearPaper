# E1-E3: long tail, explanation, calibration (InspecSafe test, Qwen3-VL-8B)

test n=1250; per level: no abnormalities observed=999, Level three=7, Level two=75, Level one=169

## E1 per-level recall (argmax) and E3 calibration

| system | acc | recall no abnormalities observed | recall Level three | recall Level two | recall Level one | ECE | RPS |
|---|---|---|---|---|---|---|---|
| zero-shot direct | 0.897 | 0.978 (977/999) | 0.000 (0/7) | 0.453 (34/75) | 0.651 (110/169) | 0.032 | 0.0522 |
| zero-shot PRISM | 0.919 | 0.981 (980/999) | 0.286 (2/7) | 0.547 (41/75) | 0.746 (126/169) | 0.070 | 0.0433 |
| Direct-SFT s0 | 0.973 | 1.000 (999/999) | 0.000 (0/7) | 0.920 (69/75) | 0.876 (148/169) | 0.015 | 0.0103 |
| Direct-SFT s1 | 0.970 | 1.000 (999/999) | 0.000 (0/7) | 0.933 (70/75) | 0.852 (144/169) | 0.019 | 0.0118 |
| PRISM-SFT s0 | 0.960 | 0.995 (994/999) | 0.000 (0/7) | 0.760 (57/75) | 0.882 (149/169) | 0.019 | 0.0137 |
| PRISM-SFT s1 | 0.959 | 0.997 (996/999) | 0.000 (0/7) | 0.587 (44/75) | 0.941 (159/169) | 0.028 | 0.0146 |

## E2 explanation accuracy of PRISM

Hazard test images whose description mentions >= 1 primitive and that the system flags as a hazard.
hit = the decisive primitive (most severe with p > 0.5) is mentioned in the description; level-consistent = a mentioned primitive of the decisive primitive's severity exists.

| system | n | hit | hit when level right | hit when level wrong |
|---|---|---|---|---|
| zero-shot PRISM | 209 | 0.670 | 0.680 (169) | 0.625 (40) |
| PRISM-SFT s0 | 243 | 0.840 | 0.903 (206) | 0.486 (37) |
| PRISM-SFT s1 | 246 | 0.756 | 0.867 (203) | 0.233 (43) |

examples (PRISM-SFT s0):
- [coal_conveyor] true=Level one, pred=Level one, because no_hard_hat (p=0.97); description: In the coal conveyor bridge scenario, the potential hazards in the image include smoking, not wearing a safety helmet, and not wearing glove
- [coal_conveyor] true=Level one, pred=Level one, because no_hard_hat (p=0.98); description: In the coal conveyor bridge scenario, the potential hazards shown in the image include smoking, not wearing a safety helmet, and not wearing
- [coal_conveyor] true=Level one, pred=Level one, because no_hard_hat (p=0.98); description: In the coal conveying bridge scenario, the potential hazards in the image include smoking, not wearing a safety helmet, and not wearing glov
- [coal_conveyor] true=Level one, pred=Level one, because no_hard_hat (p=0.98); description: In the coal conveyor bridge scenario, the potential hazards in the image are smoking, not wearing a safety helmet, and not wearing gloves. T
- [coal_conveyor] true=Level one, pred=Level one, because no_hard_hat (p=0.98); description: In the coal conveyor bridge scenario, the potential hazards in the image include smoking, not wearing a safety helmet, and not wearing glove
- [coal_conveyor] true=Level one, pred=Level one, because no_hard_hat (p=0.97); description: In the coal conveyor bridge scenario, the potential hazards in the image include smoking, not wearing a safety helmet, and not wearing glove
