# V39 pre-registered primary tests (#59; system names say V26 for both prefixes: V26-full = v39_full)

test n = 1250; masked cells 2205; R2 changed images 43

| system | acc | masked FP rate | AURC | R2 changed acc (zero new labels) |
|---|---|---|---|---|
| V26-full | 0.955 | 0.0463 | 0.0291 | 0.651 |
| V26-ctrl | 0.963 | 0.2762 | 0.0212 | 0.349 |
| V39-dual atom path | 0.950 | 0.0395 | 0.0204 | 0.651 |
| seed-1 full | 0.945 | 0.0358 | 0.0411 | 0.651 |
| seed-1 ctrl | 0.968 | 0.2952 | 0.0291 | 0.488 |
| PRISM-SFT s0 (start) | 0.960 | 0.2952 | 0.0051 | 0.442 |
| Direct-SFT s0 (reference) | 0.973 | - | 0.0018 | - |

## primary tests (Holm over H1-H3): V26-full vs V26-ctrl

| test | diff | 95% CI | p | Holm p | direction ok |
|---|---|---|---|---|---|
| H1 masked FP rate (full - ctrl, want < 0) | -0.2299 | [-0.2519, -0.2087] | 0.000 | 0.000 | yes |
| H2 R2 changed acc (full - ctrl, want > 0) | +0.3023 | [+0.1395, +0.4651] | 0.000 | 0.000 | yes |
| H3 AURC (full - ctrl, want < 0) | +0.0079 | [-0.0060, +0.0220] | 0.248 | 0.248 | no |
| H4 acc (full - ctrl), non-inferior if CI low > -0.01 | -0.0080 | [-0.0168, +0.0016] | 0.122 | - | no |

## primary tests (Holm over H1-H3): seed-1 full vs seed-1 ctrl

| test | diff | 95% CI | p | Holm p | direction ok |
|---|---|---|---|---|---|
| H1 masked FP rate (full - ctrl, want < 0) | -0.2594 | [-0.2834, -0.2369] | 0.000 | 0.000 | yes |
| H2 R2 changed acc (full - ctrl, want > 0) | +0.1628 | [-0.0233, +0.3488] | 0.128 | 0.256 | yes |
| H3 AURC (full - ctrl, want < 0) | +0.0120 | [-0.0061, +0.0306] | 0.206 | 0.256 | no |
| H4 acc (full - ctrl), non-inferior if CI low > -0.01 | -0.0232 | [-0.0336, -0.0136] | 0.000 | - | no |
