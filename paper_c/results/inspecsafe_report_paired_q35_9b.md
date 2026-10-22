# Paper C evaluation (test n=1250, val n=573, eta=5.0)

| system | acc | macro_f1 | qwk | risk_cost | critical_miss | false_alarm | anomaly_recall | ece | cs_rps | acc 95% CI | risk 95% CI |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 direct (argmax) | 0.854 | 0.501 | 0.769 | 0.851 | 0.172 | 0.050 | 0.833 | 0.042 | 0.219 | [0.834, 0.874] | [0.699, 1.009] |
| S1 direct (cost-aware) | 0.815 | 0.498 | 0.726 | 0.678 | 0.070 | 0.128 | 0.932 | 0.042 | 0.219 | [0.794, 0.835] | [0.572, 0.785] |
| S1 direct, val-calibrated (argmax) | 0.878 | 0.508 | 0.670 | 1.099 | 0.357 | 0.023 | 0.641 | 0.030 | 0.220 | [0.858, 0.896] | [0.901, 1.294] |
| S1 direct, val-calibrated (cost-aware) | 0.845 | 0.488 | 0.694 | 0.556 | 0.082 | 0.111 | 0.920 | 0.030 | 0.220 | [0.826, 0.864] | [0.464, 0.648] |
| S1 fan-out, raw noisy-OR | 0.225 | 0.184 | 0.172 | 1.634 | 0.004 | 0.911 | 0.996 | 0.115 | 0.163 | [0.202, 0.250] | [1.570, 1.700] |
| S1 fan-out, calibrated (argmax) | 0.908 | 0.639 | 0.877 | 0.415 | 0.090 | 0.054 | 0.912 | 0.043 | 0.117 | [0.892, 0.923] | [0.316, 0.520] |
| S1 fan-out, calibrated (cost-aware) | 0.806 | 0.541 | 0.762 | 0.418 | 0.029 | 0.190 | 0.972 | 0.043 | 0.117 | [0.784, 0.826] | [0.354, 0.486] |

## Paired bootstrap: fan-out (calibrated) minus direct (val-calibrated)

| metric | diff | 95% CI | p |
|---|---|---|---|
| accuracy (argmax) | +0.030 | [+0.011, +0.051] | 0.002 |
| risk_cost (cost-aware) | -0.138 | [-0.222, -0.051] | 0.000 |
| critical_miss (cost-aware) | -0.053 | [-0.082, -0.027] | 0.000 |
| false_alarm (cost-aware) | +0.079 | [+0.058, +0.102] | 0.000 |

## Branch diagnostics (test, vs description weak labels)

weak labels + industry table reproduce the true level on 95.4% of scenes

| primitive | labelled | positives | AUROC |
|---|---|---|---|
| open_flame | 1108 | 30 | 0.907 |
| smoke | 1111 | 44 | 0.871 |
| personnel_collapse | 1083 | 2 | 1.000 |
| smoking | 1083 | 32 | 0.988 |
| oil_leakage | 195 | 15 | 0.956 |
| no_hard_hat | 1096 | 60 | 0.991 |
| no_gloves | 1128 | 119 | 0.993 |
| no_mask | 1077 | 69 | 0.993 |
| mobile_phone | 1033 | 51 | 0.737 |
| water_pooling | 1008 | 8 | 0.951 |
| oil_accumulation | 614 | 0 | nan |
| foreign_object_light | 1031 | 29 | 0.958 |
| foreign_object_hard | 1033 | 0 | nan |
| cabinet_door_open | 448 | 8 | 0.999 |
| nonmotor_vehicle | 299 | 25 | 0.995 |
