# Direct baseline with flexible calibration (test n=1250, val n=573, K=4)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.9999 | 0.975 | 0.099 |
| direct + matrix scaling | 1.0000 | 0.970 | 0.142 |
| direct + null-MAD + vector scaling | 0.9985 | 0.976 | 0.078 |
| PRISM base noisy-OR | 0.9877 | 0.936 | 0.181 |
| PRISM MAD + gamma | 0.9904 | 0.950 | 0.163 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + matrix scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | -0.0096 | [-0.0189, -0.0018] | 0.000 |
| acc | -0.0208 | [-0.0304, -0.0112] | 0.000 |
| risk_cost | +0.0208 | [-0.0344, +0.0720] | 0.496 |
