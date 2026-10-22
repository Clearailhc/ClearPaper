# V42 pre-registered primary tests (#59; system names say V26 for both prefixes: V26-full = v42_full)

test n = 1250; masked cells 2205; R2 changed images 43

| system | acc | masked FP rate | AURC | R2 changed acc (zero new labels) |
|---|---|---|---|---|
| V26-full | 0.946 | 0.0503 | 0.0308 | 0.674 |
| V26-ctrl | 0.960 | 0.2952 | 0.0051 | 0.442 |
| seed-1 full | 0.951 | 0.0413 | 0.0066 | 0.698 |
| seed-1 ctrl | 0.959 | 0.4050 | 0.0049 | 0.140 |
| PRISM-SFT s0 (start) | 0.960 | 0.2952 | 0.0051 | 0.442 |
| Direct-SFT s0 (reference) | 0.973 | - | 0.0018 | - |

## primary tests (Holm over H1-H3): V26-full vs V26-ctrl

| test | diff | 95% CI | p | Holm p | direction ok |
|---|---|---|---|---|---|
| H1 masked FP rate (full - ctrl, want < 0) | -0.2449 | [-0.2682, -0.2221] | 0.000 | 0.000 | yes |
| H2 R2 changed acc (full - ctrl, want > 0) | +0.2326 | [+0.0698, +0.3953] | 0.005 | 0.005 | yes |
| H3 AURC (full - ctrl, want < 0) | +0.0257 | [+0.0132, +0.0389] | 0.000 | 0.000 | no |
| H4 acc (full - ctrl), non-inferior if CI low > -0.01 | -0.0136 | [-0.0240, -0.0040] | 0.007 | - | no |

## primary tests (Holm over H1-H3): seed-1 full vs seed-1 ctrl

| test | diff | 95% CI | p | Holm p | direction ok |
|---|---|---|---|---|---|
| H1 masked FP rate (full - ctrl, want < 0) | -0.3637 | [-0.3912, -0.3361] | 0.000 | 0.000 | yes |
| H2 R2 changed acc (full - ctrl, want > 0) | +0.5581 | [+0.3953, +0.7209] | 0.000 | 0.000 | yes |
| H3 AURC (full - ctrl, want < 0) | +0.0017 | [-0.0037, +0.0078] | 0.572 | 0.572 | no |
| H4 acc (full - ctrl), non-inferior if CI low > -0.01 | -0.0080 | [-0.0208, +0.0048] | 0.250 | - | no |
