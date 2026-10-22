# Paper C evaluation (test n=1250, val n=573, eta=5.0)

| system | acc | macro_f1 | qwk | risk_cost | critical_miss | false_alarm | anomaly_recall | ece | cs_rps | acc 95% CI | risk 95% CI |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 direct (argmax) | 0.727 | 0.411 | 0.668 | 0.893 | 0.049 | 0.205 | 0.952 | 0.204 | 0.268 | [0.702, 0.753] | [0.778, 1.008] |
| S1 direct (cost-aware) | 0.679 | 0.398 | 0.602 | 0.934 | 0.029 | 0.273 | 0.972 | 0.204 | 0.268 | [0.653, 0.704] | [0.834, 1.034] |
| S1 direct, val-calibrated (argmax) | 0.870 | 0.495 | 0.665 | 1.118 | 0.344 | 0.026 | 0.649 | 0.022 | 0.238 | [0.851, 0.889] | [0.922, 1.309] |
| S1 direct, val-calibrated (cost-aware) | 0.835 | 0.485 | 0.673 | 0.623 | 0.102 | 0.124 | 0.900 | 0.022 | 0.238 | [0.814, 0.857] | [0.508, 0.729] |
| S1 fan-out, raw noisy-OR | 0.778 | 0.520 | 0.678 | 0.562 | 0.037 | 0.214 | 0.964 | 0.110 | 0.139 | [0.756, 0.802] | [0.480, 0.645] |
| S1 fan-out, calibrated (argmax) | 0.892 | 0.586 | 0.859 | 0.426 | 0.082 | 0.066 | 0.920 | 0.020 | 0.113 | [0.875, 0.909] | [0.325, 0.519] |
| S1 fan-out, calibrated (cost-aware) | 0.797 | 0.530 | 0.743 | 0.447 | 0.025 | 0.199 | 0.976 | 0.020 | 0.113 | [0.776, 0.819] | [0.382, 0.516] |

## Paired bootstrap: fan-out (calibrated) minus direct (val-calibrated)

| metric | diff | 95% CI | p |
|---|---|---|---|
| accuracy (argmax) | +0.022 | [+0.000, +0.044] | 0.052 |
| risk_cost (cost-aware) | -0.176 | [-0.281, -0.067] | 0.001 |
| critical_miss (cost-aware) | -0.078 | [-0.114, -0.045] | 0.000 |
| false_alarm (cost-aware) | +0.075 | [+0.053, +0.096] | 0.000 |
| S2 thinking (unparsed->S1: 59) | 0.729 | 0.407 | 0.544 | 1.185 | 0.156 | 0.192 | 0.849 | - | - | [0.706, 0.752] | [1.026, 1.343] |

accuracy (argmax vs argmax): S1->S2 gap +0.002; fan-out recovers +0.165 (10300% of the gap)
risk_cost (cost-aware vs cost-aware): direct 0.934 -> fan-out 0.447; S2 1.185
rescue/harm (S1 direct -> S2): {'rescue': 83, 'harm': 81, 'both_wrong': 258, 'both_right': 828}

## Scene-level escalation (S1 direct -> S2), accuracy / risk_cost

| score | 10% | 20% | 30% |
|---|---|---|---|
| MSP | 0.743 / 0.912 | 0.754 / 0.920 | 0.752 / 1.006 |
| entropy | 0.742 / 0.906 | 0.753 / 0.913 | 0.753 / 1.002 |
| fan-out Bayes risk | 0.737 / 0.922 | 0.734 / 0.990 | 0.735 / 1.018 |
| random | 0.724 / 0.941 | 0.726 / 0.967 | 0.728 / 0.992 |

## Branch diagnostics (test, vs description weak labels)

weak labels + industry table reproduce the true level on 95.4% of scenes

| primitive | labelled | positives | AUROC |
|---|---|---|---|
| open_flame | 1108 | 30 | 0.866 |
| smoke | 1111 | 44 | 0.875 |
| personnel_collapse | 1083 | 2 | 1.000 |
| smoking | 1083 | 32 | 0.984 |
| oil_leakage | 195 | 15 | 0.990 |
| no_hard_hat | 1096 | 60 | 0.981 |
| no_gloves | 1128 | 119 | 0.995 |
| no_mask | 1077 | 69 | 0.992 |
| mobile_phone | 1033 | 51 | 0.698 |
| water_pooling | 1008 | 8 | 0.931 |
| oil_accumulation | 614 | 0 | nan |
| foreign_object_light | 1031 | 29 | 0.950 |
| foreign_object_hard | 1033 | 0 | nan |
| cabinet_door_open | 448 | 8 | 0.957 |
| nonmotor_vehicle | 299 | 25 | 1.000 |
