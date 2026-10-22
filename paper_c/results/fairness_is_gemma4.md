# Direct baseline with flexible calibration (test n=1250, val n=573, K=4)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.7785 | 0.810 | 1.490 |
| direct + matrix scaling | 0.8200 | 0.815 | 1.311 |
| direct + null-MAD + vector scaling | 0.7483 | 0.803 | 1.646 |
| PRISM base noisy-OR | 0.9450 | 0.831 | 0.782 |
| PRISM MAD + gamma | 0.9633 | 0.888 | 0.582 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + matrix scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | +0.1432 | [+0.1146, +0.1700] | 0.000 |
| acc | +0.0728 | [+0.0536, +0.0936] | 0.000 |
| risk_cost | -0.7296 | [-0.9009, -0.5712] | 0.000 |
