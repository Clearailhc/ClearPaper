# V28 / V29 / V31 / V32 robustness checks (InspecSafe test, zero-shot Qwen3-VL-8B)

| system | acc | AUROC | hazard recall | vs zero-shot PRISM (acc) | vs direct + matrix scaling (acc) |
|---|---|---|---|---|---|
| zero-shot PRISM, hand-written questions (reference) | 0.919 | 0.983 | 0.833 | +0.000 [+0.000, +0.000] p=1.000 | +0.022 [+0.007, +0.038] p=0.001 |
| direct question + matrix scaling (reference) | 0.897 | 0.975 | 0.797 | -0.022 [-0.038, -0.007] p=0.001 | +0.000 [+0.000, +0.000] p=1.000 |
| V32 detector gdino + regulation table (prism) | 0.864 | 0.892 | 0.669 | -0.055 [-0.074, -0.038] p=0.000 | -0.033 [-0.050, -0.015] p=0.000 |
| V32 detector gdino + regulation table (prism_mad) | 0.876 | 0.902 | 0.685 | -0.043 [-0.062, -0.026] p=0.000 | -0.021 [-0.038, -0.005] p=0.017 |
| V32 detector owlv2 + regulation table (prism) | 0.881 | 0.949 | 0.637 | -0.038 [-0.056, -0.022] p=0.000 | -0.016 [-0.031, +0.000] p=0.052 |
| V32 detector owlv2 + regulation table (prism_mad) | 0.878 | 0.946 | 0.713 | -0.042 [-0.060, -0.026] p=0.000 | -0.019 [-0.035, -0.003] p=0.020 |
