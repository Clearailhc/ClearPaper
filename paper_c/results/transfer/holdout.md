# E6 held-out hazard type (InspecSafe test, Qwen3-VL-8B)

Training drops every image whose description mentions the hazard. `present` = test images where the hazard is present (description, level enforced); `decisive` = present and its severity equals the level.

## smoking: present 32, decisive 32, sole decisive 16

| system | acc (all) | acc present | acc sole decisive | hazard recall sole | acc others | branch recall |
|---|---|---|---|---|---|---|
| zero-shot direct | 0.897 | 0.500 | 0.562 | 0.812 | 0.907 | - |
| zero-shot PRISM | 0.919 | 0.562 | 0.375 | 0.938 | 0.929 | - |
| Direct-SFT (saw it) | 0.973 | 0.688 | 0.375 | 1.000 | 0.980 | - |
| PRISM-SFT (saw it) | 0.960 | 0.688 | 0.375 | 1.000 | 0.967 | 0.500 |
| Direct-holdout | 0.970 | 0.594 | 0.250 | 1.000 | 0.980 | - |
| PRISM-holdout | 0.964 | 0.656 | 0.312 | 1.000 | 0.972 | 0.250 |
| PRISM-holdout, question never trained | 0.954 | 0.938 | 0.875 | 1.000 | 0.954 | 0.812 |

never-trained PRISM-holdout - Direct-holdout on sole-decisive images: +0.625 [+0.375, +0.875] p=0.000

PRISM-holdout - Direct-holdout on sole-decisive images: +0.062 [+0.000, +0.188] p=0.671; on present: +0.062 [+0.000, +0.156] p=0.260

## nonmotor_vehicle: present 25, decisive 25, sole decisive 25

| system | acc (all) | acc present | acc sole decisive | hazard recall sole | acc others | branch recall |
|---|---|---|---|---|---|---|
| zero-shot direct | 0.897 | 0.920 | 0.920 | 1.000 | 0.896 | - |
| zero-shot PRISM | 0.919 | 0.960 | 0.960 | 1.000 | 0.918 | - |
| Direct-SFT (saw it) | 0.973 | 1.000 | 1.000 | 1.000 | 0.972 | - |
| PRISM-SFT (saw it) | 0.960 | 1.000 | 1.000 | 1.000 | 0.959 | 1.000 |
| Direct-holdout | 0.962 | 0.440 | 0.440 | 1.000 | 0.972 | - |
| PRISM-holdout | 0.969 | 0.920 | 0.920 | 1.000 | 0.970 | 0.880 |
| PRISM-holdout, question never trained | 0.968 | 1.000 | 1.000 | 1.000 | 0.967 | 1.000 |

never-trained PRISM-holdout - Direct-holdout on sole-decisive images: +0.560 [+0.360, +0.760] p=0.000

PRISM-holdout - Direct-holdout on sole-decisive images: +0.480 [+0.280, +0.680] p=0.000; on present: +0.480 [+0.280, +0.680] p=0.000

