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

## Paired bootstrap: fan-out (calibrated) minus direct (val-calibrated)

| metric | diff | 95% CI | p |
|---|---|---|---|
| accuracy (argmax) | +0.046 | [+0.023, +0.070] | 0.000 |
| risk_cost (cost-aware) | -0.414 | [-0.570, -0.274] | 0.000 |
| critical_miss (cost-aware) | -0.172 | [-0.219, -0.126] | 0.000 |
| false_alarm (cost-aware) | +0.125 | [+0.100, +0.150] | 0.000 |

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
