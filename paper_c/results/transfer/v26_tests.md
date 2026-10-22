# V26 pre-registered primary tests (#59)

test n = 1250; masked cells 2205; R2 changed images 43

| system | acc | masked FP rate | AURC | R2 changed acc (zero new labels) |
|---|---|---|---|---|
| V26-full | 0.946 | 0.0417 | 0.0336 | 0.674 |
| V26-ctrl | 0.964 | 0.2785 | 0.0182 | 0.395 |
| V26-noB | 0.956 | 0.0444 | 0.0272 | 0.558 |
| PRISM-SFT s0 (start) | 0.960 | 0.2952 | 0.0051 | 0.442 |
| Direct-SFT s0 (reference) | 0.973 | - | 0.0018 | - |

## primary tests (Holm over H1-H3)

| test | diff | 95% CI | p | Holm p | direction ok |
|---|---|---|---|---|---|
| H1 masked FP rate (full - ctrl, want < 0) | -0.2367 | [-0.2586, -0.2155] | 0.000 | 0.000 | yes |
| H2 R2 changed acc (full - ctrl, want > 0) | +0.2791 | [+0.1163, +0.4419] | 0.001 | 0.002 | yes |
| H3 AURC (full - ctrl, want < 0) | +0.0155 | [+0.0018, +0.0307] | 0.024 | 0.024 | no |
| H4 acc (full - ctrl), non-inferior if CI low > -0.01 | -0.0184 | [-0.0288, -0.0088] | 0.000 | - | no |
