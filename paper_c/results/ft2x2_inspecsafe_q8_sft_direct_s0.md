# Direct baseline with flexible calibration (test n=1250, val n=573, K=4)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.9999 | 0.982 | 0.079 |
| direct + matrix scaling | 0.9998 | 0.973 | 0.116 |
| direct + null-MAD + vector scaling | 0.9999 | 0.982 | 0.055 |
| PRISM base noisy-OR | 0.9951 | 0.942 | 0.147 |
| PRISM MAD + gamma | 0.9978 | 0.956 | 0.153 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + vector scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | -0.0020 | [-0.0040, -0.0004] | 0.000 |
| acc | -0.0256 | [-0.0352, -0.0144] | 0.000 |
| risk_cost | +0.0736 | [+0.0232, +0.1184] | 0.006 |
