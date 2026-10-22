# E6b re-evaluated: held-out hazard unseen in training AND calibration

## smoking: val images removed 16; test sole-decisive 16

| system | calibration | acc (all) | acc sole decisive | branch recall (sole) |
|---|---|---|---|---|
| Direct-holdout | matrix scaling | 0.970 | 0.250 | - |
| PRISM-holdout, question never trained | naive (negatives only) | 0.954 | 0.875 | 0.875 |
| PRISM-holdout, question never trained | mean-b (column masked) | 0.955 | 0.938 | 0.938 |

PRISM naive (negatives only) - Direct-holdout on sole-decisive: +0.625 [+0.375, +0.875] p=0.000

PRISM mean-b (column masked) - Direct-holdout on sole-decisive: +0.688 [+0.438, +0.875] p=0.000

## nonmotor_vehicle: val images removed 9; test sole-decisive 25

| system | calibration | acc (all) | acc sole decisive | branch recall (sole) |
|---|---|---|---|---|
| Direct-holdout | matrix scaling | 0.952 | 0.120 | - |
| PRISM-holdout, question never trained | naive (negatives only) | 0.968 | 1.000 | 1.000 |
| PRISM-holdout, question never trained | mean-b (column masked) | 0.969 | 1.000 | 1.000 |

PRISM naive (negatives only) - Direct-holdout on sole-decisive: +0.880 [+0.720, +1.000] p=0.000

PRISM mean-b (column masked) - Direct-holdout on sole-decisive: +0.880 [+0.720, +1.000] p=0.000

## smoking_s1: val images removed 16; test sole-decisive 16

| system | calibration | acc (all) | acc sole decisive | branch recall (sole) |
|---|---|---|---|---|
| Direct-holdout | matrix scaling | 0.970 | 0.250 | - |
| PRISM-holdout, question never trained | naive (negatives only) | 0.958 | 0.750 | 0.750 |
| PRISM-holdout, question never trained | mean-b (column masked) | 0.958 | 0.812 | 0.812 |

PRISM naive (negatives only) - Direct-holdout on sole-decisive: +0.500 [+0.250, +0.750] p=0.000

PRISM mean-b (column masked) - Direct-holdout on sole-decisive: +0.562 [+0.312, +0.812] p=0.000

