# Paper C evaluation (test n=1250, val n=573, eta=5.0)

| system | acc | macro_f1 | qwk | risk_cost | critical_miss | false_alarm | anomaly_recall | ece | cs_rps | acc 95% CI | risk 95% CI |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 direct (argmax) | 0.854 | 0.431 | 0.651 | 1.307 | 0.369 | 0.010 | 0.633 | 0.044 | 0.310 | [0.832, 0.873] | [1.109, 1.526] |
| S1 direct (cost-aware) | 0.790 | 0.426 | 0.748 | 0.784 | 0.033 | 0.124 | 0.968 | 0.044 | 0.310 | [0.768, 0.812] | [0.678, 0.895] |
| S1 direct, val-calibrated (argmax) | 0.850 | 0.419 | 0.487 | 1.704 | 0.611 | 0.005 | 0.394 | 0.070 | 0.329 | [0.829, 0.870] | [1.455, 1.968] |
| S1 direct, val-calibrated (cost-aware) | 0.802 | 0.472 | 0.614 | 0.725 | 0.057 | 0.155 | 0.944 | 0.070 | 0.329 | [0.779, 0.823] | [0.623, 0.822] |
| S1 fan-out, raw noisy-OR | 0.150 | 0.102 | 0.047 | 2.146 | 0.000 | 1.000 | 1.000 | 0.186 | 0.306 | [0.129, 0.170] | [2.082, 2.205] |
| S1 fan-out, calibrated (argmax) | 0.878 | 0.599 | 0.828 | 0.387 | 0.053 | 0.095 | 0.948 | 0.080 | 0.110 | [0.861, 0.895] | [0.305, 0.473] |
| S1 fan-out, calibrated (cost-aware) | 0.662 | 0.446 | 0.602 | 0.636 | 0.012 | 0.366 | 0.988 | 0.080 | 0.110 | [0.637, 0.688] | [0.572, 0.702] |

## Paired bootstrap: fan-out (calibrated) minus direct (val-calibrated)

| metric | diff | 95% CI | p |
|---|---|---|---|
| accuracy (argmax) | +0.029 | [+0.004, +0.054] | 0.026 |
| risk_cost (cost-aware) | -0.089 | [-0.192, +0.020] | 0.110 |
| critical_miss (cost-aware) | -0.045 | [-0.075, -0.017] | 0.000 |
| false_alarm (cost-aware) | +0.211 | [+0.183, +0.240] | 0.000 |

## Branch diagnostics (test, vs description weak labels)

weak labels + industry table reproduce the true level on 95.4% of scenes

| primitive | labelled | positives | AUROC |
|---|---|---|---|
| open_flame | 1108 | 30 | 0.886 |
| smoke | 1111 | 44 | 0.887 |
| personnel_collapse | 1083 | 2 | 1.000 |
| smoking | 1083 | 32 | 0.943 |
| oil_leakage | 195 | 15 | 0.977 |
| no_hard_hat | 1096 | 60 | 0.994 |
| no_gloves | 1128 | 119 | 0.997 |
| no_mask | 1077 | 69 | 0.996 |
| mobile_phone | 1033 | 51 | 0.668 |
| water_pooling | 1008 | 8 | 0.953 |
| oil_accumulation | 614 | 0 | nan |
| foreign_object_light | 1031 | 29 | 0.923 |
| foreign_object_hard | 1033 | 0 | nan |
| cabinet_door_open | 448 | 8 | 0.995 |
| nonmotor_vehicle | 299 | 25 | 0.989 |
