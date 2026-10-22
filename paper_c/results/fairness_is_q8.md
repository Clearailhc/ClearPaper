# Direct baseline with flexible calibration (test n=1250, val n=573, K=4)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.9303 | 0.838 | 0.954 |
| direct + matrix scaling | 0.9747 | 0.897 | 0.479 |
| direct + null-MAD + vector scaling | 0.9273 | 0.819 | 0.888 |
| PRISM base noisy-OR | 0.9665 | 0.878 | 0.550 |
| PRISM MAD + gamma | 0.9834 | 0.919 | 0.416 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + matrix scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | +0.0087 | [-0.0008, +0.0191] | 0.080 |
| acc | +0.0224 | [+0.0072, +0.0384] | 0.002 |
| risk_cost | -0.0632 | [-0.1904, +0.0512] | 0.342 |
