# Direct baseline with flexible calibration (test n=5806, val n=2491, K=2)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.7647 | 0.694 | 0.394 |
| direct + matrix scaling | 0.7647 | 0.691 | 0.388 |
| direct + null-MAD + vector scaling | 0.7647 | 0.694 | 0.394 |
| PRISM base noisy-OR | 0.8062 | 0.730 | 0.379 |
| PRISM MAD + gamma | 0.8294 | 0.742 | 0.378 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + vector scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | +0.0646 | [+0.0547, +0.0753] | 0.000 |
| acc | +0.0482 | [+0.0367, +0.0613] | 0.000 |
| risk_cost | -0.0160 | [-0.0307, -0.0002] | 0.050 |
