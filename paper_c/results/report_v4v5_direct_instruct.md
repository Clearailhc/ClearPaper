# Paper C evaluation (test n=1250, val n=573, eta=5.0)

| system | acc | macro_f1 | qwk | risk_cost | critical_miss | false_alarm | anomaly_recall | ece | cs_rps | acc 95% CI | risk 95% CI |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 direct (argmax) | 0.762 | 0.404 | 0.661 | 1.096 | 0.168 | 0.133 | 0.833 | 0.177 | 0.332 | [0.738, 0.787] | [0.939, 1.252] |
| S1 direct (cost-aware) | 0.726 | 0.388 | 0.641 | 1.039 | 0.111 | 0.186 | 0.892 | 0.177 | 0.332 | [0.698, 0.750] | [0.909, 1.174] |
| S1 direct, val-calibrated (argmax) | 0.833 | 0.408 | 0.422 | 1.788 | 0.627 | 0.026 | 0.367 | 0.056 | 0.377 | [0.810, 0.854] | [1.534, 2.063] |
| S1 direct, val-calibrated (cost-aware) | 0.772 | 0.409 | 0.534 | 1.056 | 0.201 | 0.156 | 0.801 | 0.056 | 0.377 | [0.747, 0.796] | [0.902, 1.209] |
| S1 fan-out, raw noisy-OR | 0.745 | 0.492 | 0.587 | 0.656 | 0.029 | 0.264 | 0.972 | 0.121 | 0.163 | [0.722, 0.769] | [0.576, 0.746] |
| S1 fan-out, calibrated (argmax) | 0.884 | 0.610 | 0.810 | 0.526 | 0.111 | 0.081 | 0.892 | 0.022 | 0.134 | [0.866, 0.902] | [0.412, 0.640] |
| S1 fan-out, calibrated (cost-aware) | 0.763 | 0.504 | 0.666 | 0.541 | 0.020 | 0.243 | 0.980 | 0.022 | 0.134 | [0.739, 0.787] | [0.468, 0.613] |
| S2 thinking (unparsed->S1: 59) | 0.739 | 0.414 | 0.549 | 1.177 | 0.160 | 0.179 | 0.845 | - | - | [0.715, 0.764] | [1.017, 1.333] |

accuracy (argmax vs argmax): S1->S2 gap -0.023; fan-out recovers +0.122
risk_cost (cost-aware vs cost-aware): direct 1.039 -> fan-out 0.541; S2 1.177
rescue/harm (S1 direct -> S2): {'rescue': 57, 'harm': 86, 'both_wrong': 240, 'both_right': 867}

## Scene-level escalation (S1 direct -> S2), accuracy / risk_cost

| score | 10% | 20% | 30% |
|---|---|---|---|
| MSP | 0.766 / 1.085 | 0.768 / 1.110 | 0.762 / 1.146 |
| entropy | 0.765 / 1.089 | 0.767 / 1.118 | 0.762 / 1.146 |
| fan-out Bayes risk | 0.755 / 1.162 | 0.747 / 1.190 | 0.740 / 1.230 |
| random | 0.758 / 1.085 | 0.754 / 1.092 | 0.754 / 1.113 |

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
