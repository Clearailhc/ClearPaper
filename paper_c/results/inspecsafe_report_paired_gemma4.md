# Paper C evaluation (test n=1250, val n=573, eta=5.0)

| system | acc | macro_f1 | qwk | risk_cost | critical_miss | false_alarm | anomaly_recall | ece | cs_rps | acc 95% CI | risk 95% CI |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 direct (argmax) | 0.531 | 0.260 | 0.336 | 1.558 | 0.135 | 0.406 | 0.865 | 0.201 | 0.433 | [0.504, 0.560] | [1.424, 1.708] |
| S1 direct (cost-aware) | 0.266 | 0.181 | 0.152 | 1.887 | 0.066 | 0.755 | 0.932 | 0.201 | 0.433 | [0.240, 0.290] | [1.785, 1.996] |
| S1 direct, val-calibrated (argmax) | 0.810 | 0.286 | 0.154 | 2.398 | 0.902 | 0.011 | 0.096 | 0.042 | 0.497 | [0.786, 0.831] | [2.111, 2.719] |
| S1 direct, val-calibrated (cost-aware) | 0.589 | 0.323 | 0.315 | 1.490 | 0.189 | 0.374 | 0.813 | 0.042 | 0.497 | [0.563, 0.618] | [1.348, 1.645] |
| S1 fan-out, raw noisy-OR | 0.564 | 0.390 | 0.405 | 0.990 | 0.020 | 0.489 | 0.980 | 0.236 | 0.227 | [0.536, 0.593] | [0.910, 1.073] |
| S1 fan-out, calibrated (argmax) | 0.838 | 0.556 | 0.768 | 0.561 | 0.094 | 0.132 | 0.908 | 0.032 | 0.156 | [0.819, 0.859] | [0.461, 0.670] |
| S1 fan-out, calibrated (cost-aware) | 0.637 | 0.445 | 0.543 | 0.775 | 0.033 | 0.399 | 0.968 | 0.032 | 0.156 | [0.609, 0.663] | [0.695, 0.856] |

## Paired bootstrap: fan-out (calibrated) minus direct (val-calibrated)

| metric | diff | 95% CI | p |
|---|---|---|---|
| accuracy (argmax) | +0.029 | [+0.002, +0.056] | 0.042 |
| risk_cost (cost-aware) | -0.714 | [-0.878, -0.560] | 0.000 |
| critical_miss (cost-aware) | -0.156 | [-0.206, -0.107] | 0.000 |
| false_alarm (cost-aware) | +0.025 | [-0.010, +0.060] | 0.156 |

## Branch diagnostics (test, vs description weak labels)

weak labels + industry table reproduce the true level on 95.4% of scenes

| primitive | labelled | positives | AUROC |
|---|---|---|---|
| open_flame | 1108 | 30 | 0.890 |
| smoke | 1111 | 44 | 0.859 |
| personnel_collapse | 1083 | 2 | 1.000 |
| smoking | 1083 | 32 | 0.807 |
| oil_leakage | 195 | 15 | 0.813 |
| no_hard_hat | 1096 | 60 | 0.983 |
| no_gloves | 1128 | 119 | 0.989 |
| no_mask | 1077 | 69 | 0.988 |
| mobile_phone | 1033 | 51 | 0.588 |
| water_pooling | 1008 | 8 | 0.879 |
| oil_accumulation | 614 | 0 | nan |
| foreign_object_light | 1031 | 29 | 0.922 |
| foreign_object_hard | 1033 | 0 | nan |
| cabinet_door_open | 448 | 8 | 0.850 |
| nonmotor_vehicle | 299 | 25 | 0.993 |
