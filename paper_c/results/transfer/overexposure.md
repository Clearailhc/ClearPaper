# Overexposure theorem: quantitative check (InspecSafe test, Qwen3-VL-8B)

absent-atom cells: visible 12945, clipped (overexposed) 2157

## P1 false-positive rate on absent atoms, by visibility

| model | FP visible | FP clipped | ratio clipped / visible |
|---|---|---|---|
| zero-shot (no training) | 0.0096 | 0.1405 | 14.7 |
| level-fill SFT s0 | 0.0026 | 0.2995 | 114.0 |
| level-fill SFT s1 | 0.0042 | 0.4126 | 98.9 |
| closed-world SFT (V19) | 0.0015 | 0.0751 | 51.2 |
| latent MIL (V25) | 0.0024 | 0.1261 | 52.7 |
| decision proto (V26) | 0.0012 | 0.1085 | 87.8 |

## P2 training-label visibility vs FP growth on clipped test cells (per primitive)

train visibility = share of relevant training images in which the primitive is visible (absent or present)

| primitive | train visibility | FP clipped zero-shot | FP clipped level-fill s0 | growth |
|---|---|---|---|---|
| open_flame | 0.891 | 0.015 | 0.103 | +0.088 |
| smoke | 0.885 | 0.000 | 0.150 | +0.150 |
| personnel_collapse | 0.872 | 0.006 | 0.000 | -0.006 |
| smoking | 0.849 | 0.067 | 0.104 | +0.037 |
| oil_leakage | 0.723 | 0.000 | 0.191 | +0.191 |
| no_hard_hat | 0.860 | 0.235 | 0.342 | +0.107 |
| no_gloves | 0.825 | 0.496 | 0.580 | +0.084 |
| no_mask | 0.816 | 0.571 | 0.653 | +0.082 |
| mobile_phone | 0.803 | 0.132 | 0.377 | +0.245 |
| water_pooling | 0.815 | 0.059 | 0.594 | +0.536 |
| oil_accumulation | 0.866 | 0.011 | 0.196 | +0.185 |
| foreign_object_light | 0.815 | 0.106 | 0.359 | +0.253 |
| foreign_object_hard | 0.827 | 0.089 | 0.019 | -0.070 |
| cabinet_door_open | 0.839 | 0.146 | 0.366 | +0.220 |

Spearman(train visibility, FP growth) = -0.468 over 14 primitives (prediction: negative)
