# V42NOKL pre-registered primary tests (#59; system names say V26 for both prefixes: V26-full = v42nokl_full)

test n = 1250; masked cells 2205; R2 changed images 43

| system | acc | masked FP rate | AURC | R2 changed acc (zero new labels) |
|---|---|---|---|---|
| V26-full | 0.946 | 0.0426 | 0.0300 | 0.744 |
| V26-ctrl | 0.960 | 0.2952 | 0.0051 | 0.442 |
| seed-1 full | 0.936 | 0.0322 | 0.0319 | 0.605 |
| seed-1 ctrl | 0.959 | 0.4050 | 0.0049 | 0.140 |
| PRISM-SFT s0 (start) | 0.960 | 0.2952 | 0.0051 | 0.442 |
| Direct-SFT s0 (reference) | 0.973 | - | 0.0018 | - |

## primary tests (Holm over H1-H3): V26-full vs V26-ctrl

| test | diff | 95% CI | p | Holm p | direction ok |
|---|---|---|---|---|---|
| H1 masked FP rate (full - ctrl, want < 0) | -0.2526 | [-0.2758, -0.2294] | 0.000 | 0.000 | yes |
| H2 R2 changed acc (full - ctrl, want > 0) | +0.3023 | [+0.1395, +0.4419] | 0.000 | 0.000 | yes |
| H3 AURC (full - ctrl, want < 0) | +0.0249 | [+0.0135, +0.0371] | 0.000 | 0.000 | no |
| H4 acc (full - ctrl), non-inferior if CI low > -0.01 | -0.0144 | [-0.0256, -0.0024] | 0.018 | - | no |

## primary tests (Holm over H1-H3): seed-1 full vs seed-1 ctrl

| test | diff | 95% CI | p | Holm p | direction ok |
|---|---|---|---|---|---|
| H1 masked FP rate (full - ctrl, want < 0) | -0.3728 | [-0.4014, -0.3449] | 0.000 | 0.000 | yes |
| H2 R2 changed acc (full - ctrl, want > 0) | +0.4651 | [+0.3023, +0.6279] | 0.000 | 0.000 | yes |
| H3 AURC (full - ctrl, want < 0) | +0.0269 | [+0.0143, +0.0417] | 0.000 | 0.000 | no |
| H4 acc (full - ctrl), non-inferior if CI low > -0.01 | -0.0232 | [-0.0376, -0.0096] | 0.002 | - | no |
