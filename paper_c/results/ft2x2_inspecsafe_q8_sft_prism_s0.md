# Direct baseline with flexible calibration (test n=1250, val n=573, K=4)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.9985 | 0.923 | 0.202 |
| direct + matrix scaling | 0.9989 | 0.939 | 0.170 |
| direct + null-MAD + vector scaling | 0.9820 | 0.893 | 0.314 |
| PRISM base noisy-OR | 0.9995 | 0.960 | 0.110 |
| PRISM MAD + gamma | 0.9993 | 0.942 | 0.124 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + matrix scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | +0.0004 | [+0.0000, +0.0010] | 0.038 |
| acc | +0.0032 | [-0.0088, +0.0144] | 0.660 |
| risk_cost | -0.0456 | [-0.0968, -0.0016] | 0.042 |
