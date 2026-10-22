# Direct baseline with flexible calibration (test n=1250, val n=573, K=4)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.9993 | 0.923 | 0.173 |
| direct + matrix scaling | 0.9997 | 0.950 | 0.105 |
| direct + null-MAD + vector scaling | 0.9957 | 0.908 | 0.242 |
| PRISM base noisy-OR | 0.9998 | 0.959 | 0.102 |
| PRISM MAD + gamma | 0.9996 | 0.956 | 0.135 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + matrix scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | -0.0001 | [-0.0003, +0.0002] | 0.742 |
| acc | +0.0064 | [-0.0064, +0.0184] | 0.354 |
| risk_cost | +0.0304 | [+0.0016, +0.0584] | 0.034 |
