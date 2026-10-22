# V30 primitive-set sensitivity (InspecSafe test, Qwen3-VL-8B)

## zero-shot PRISM: all 15 primitives acc 0.919, AUROC 0.983, hazard recall 0.833

| removed | acc | Δacc | AUROC | hazard recall |
|---|---|---|---|---|
| open_flame | 0.910 | -0.009 | 0.977 | 0.873 |
| smoke | 0.920 | +0.001 | 0.983 | 0.837 |
| personnel_collapse | 0.924 | +0.005 | 0.984 | 0.849 |
| smoking | 0.913 | -0.006 | 0.984 | 0.861 |
| oil_leakage | 0.913 | -0.006 | 0.957 | 0.829 |
| no_hard_hat | 0.904 | -0.015 | 0.983 | 0.865 |
| no_gloves | 0.919 | +0.000 | 0.981 | 0.817 |
| no_mask | 0.928 | +0.009 | 0.983 | 0.837 |
| mobile_phone | 0.915 | -0.004 | 0.982 | 0.849 |
| water_pooling | 0.924 | +0.005 | 0.985 | 0.849 |
| oil_accumulation | 0.919 | +0.000 | 0.984 | 0.833 |
| foreign_object_light | 0.920 | +0.001 | 0.983 | 0.841 |
| foreign_object_hard | 0.915 | -0.004 | 0.973 | 0.821 |
| cabinet_door_open | 0.918 | -0.002 | 0.984 | 0.833 |
| nonmotor_vehicle | 0.906 | -0.013 | 0.982 | 0.797 |
| random 3 (mean ± sd, min) | 0.909 ± 0.012, min 0.873 | -0.011 | 0.976 | 0.838 |
| random 5 (mean ± sd, min) | 0.896 ± 0.012, min 0.863 | -0.024 | 0.962 | 0.826 |

## PRISM-SFT s0: all 15 primitives acc 0.960, AUROC 1.000, hazard recall 0.968

| removed | acc | Δacc | AUROC | hazard recall |
|---|---|---|---|---|
| open_flame | 0.959 | -0.001 | 0.999 | 0.964 |
| smoke | 0.959 | -0.001 | 1.000 | 0.968 |
| personnel_collapse | 0.961 | +0.001 | 1.000 | 0.968 |
| smoking | 0.964 | +0.004 | 1.000 | 0.968 |
| oil_leakage | 0.951 | -0.009 | 1.000 | 0.968 |
| no_hard_hat | 0.953 | -0.007 | 1.000 | 0.972 |
| no_gloves | 0.959 | -0.001 | 1.000 | 0.960 |
| no_mask | 0.961 | +0.001 | 1.000 | 0.968 |
| mobile_phone | 0.960 | +0.000 | 1.000 | 0.968 |
| water_pooling | 0.961 | +0.001 | 0.999 | 0.956 |
| oil_accumulation | 0.960 | +0.000 | 1.000 | 0.968 |
| foreign_object_light | 0.962 | +0.002 | 0.999 | 0.964 |
| foreign_object_hard | 0.961 | +0.001 | 1.000 | 0.968 |
| cabinet_door_open | 0.960 | +0.000 | 1.000 | 0.968 |
| nonmotor_vehicle | 0.946 | -0.014 | 1.000 | 0.972 |
| random 3 (mean ± sd, min) | 0.948 ± 0.010, min 0.930 | -0.012 | 0.999 | 0.967 |
| random 5 (mean ± sd, min) | 0.942 ± 0.010, min 0.926 | -0.018 | 0.999 | 0.960 |

