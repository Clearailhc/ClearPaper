# Paper C evaluation (test n=1250, val n=573, eta=5.0)

| system | acc | macro_f1 | qwk | risk_cost | critical_miss | false_alarm | anomaly_recall | ece | cs_rps | acc 95% CI | risk 95% CI |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 direct (argmax) | 0.790 | 0.406 | 0.659 | 1.155 | 0.213 | 0.092 | 0.789 | 0.172 | 0.357 | [0.766, 0.814] | [0.986, 1.324] |
| S1 direct (cost-aware) | 0.782 | 0.404 | 0.673 | 1.069 | 0.168 | 0.109 | 0.833 | 0.172 | 0.357 | [0.758, 0.806] | [0.910, 1.230] |
| S1 direct, val-calibrated (argmax) | 0.838 | 0.416 | 0.447 | 1.730 | 0.598 | 0.021 | 0.402 | 0.057 | 0.366 | [0.815, 0.858] | [1.479, 1.994] |
| S1 direct, val-calibrated (cost-aware) | 0.801 | 0.415 | 0.596 | 0.954 | 0.193 | 0.118 | 0.809 | 0.057 | 0.366 | [0.779, 0.822] | [0.810, 1.105] |
| S1 fan-out, raw noisy-OR | 0.745 | 0.492 | 0.587 | 0.656 | 0.029 | 0.264 | 0.972 | 0.121 | 0.163 | [0.722, 0.769] | [0.576, 0.746] |
| S1 fan-out, calibrated (argmax) | 0.884 | 0.610 | 0.810 | 0.526 | 0.111 | 0.081 | 0.892 | 0.022 | 0.134 | [0.866, 0.902] | [0.412, 0.640] |
| S1 fan-out, calibrated (cost-aware) | 0.763 | 0.504 | 0.666 | 0.541 | 0.020 | 0.243 | 0.980 | 0.022 | 0.134 | [0.739, 0.787] | [0.468, 0.613] |
| S2 thinking (unparsed->S1: 59) | 0.744 | 0.416 | 0.558 | 1.166 | 0.160 | 0.173 | 0.845 | - | - | [0.719, 0.769] | [1.006, 1.321] |

accuracy (argmax vs argmax): S1->S2 gap -0.046; fan-out recovers +0.094
risk_cost (cost-aware vs cost-aware): direct 1.069 -> fan-out 0.541; S2 1.166
rescue/harm (S1 direct -> S2): {'rescue': 44, 'harm': 102, 'both_wrong': 218, 'both_right': 886}

## Scene-level escalation (S1 direct -> S2), accuracy / risk_cost

| score | 10% | 20% | 30% |
|---|---|---|---|
| MSP | 0.791 / 1.195 | 0.787 / 1.166 | 0.778 / 1.145 |
| entropy | 0.792 / 1.183 | 0.788 / 1.164 | 0.778 / 1.145 |
| fan-out Bayes risk | 0.780 / 1.191 | 0.766 / 1.214 | 0.753 / 1.260 |
| random | 0.782 / 1.146 | 0.777 / 1.141 | 0.776 / 1.150 |

## Branch-level escalation (queries = budget x N scenes)

| budget | acc | risk_cost | false_alarm | answered |
|---|---|---|---|---|
| 10% | 0.763 | 0.588 | 0.241 | 125/125 |
| 20% | 0.760 | 0.622 | 0.246 | 250/250 |
| 30% | 0.742 | 0.685 | 0.263 | 375/375 |

## Branch diagnostics (test, vs description weak labels)

weak labels + industry table reproduce the true level on 95.4% of scenes

| primitive | labelled | positives | AUROC |
|---|---|---|---|
| open_flame | 1108 | 30 | 0.923 |
| smoke | 1111 | 44 | 0.865 |
| personnel_collapse | 1083 | 2 | 1.000 |
| smoking | 1083 | 32 | 0.966 |
| oil_leakage | 195 | 15 | 0.958 |
| no_hard_hat | 1096 | 60 | 0.973 |
| no_gloves | 1128 | 119 | 0.995 |
| no_mask | 1077 | 69 | 0.993 |
| mobile_phone | 1033 | 51 | 0.808 |
| water_pooling | 1008 | 8 | 0.950 |
| oil_accumulation | 614 | 0 | nan |
| foreign_object_light | 1031 | 29 | 0.917 |
| foreign_object_hard | 1033 | 0 | nan |
| cabinet_door_open | 448 | 8 | 0.975 |
| nonmotor_vehicle | 299 | 25 | 0.999 |
