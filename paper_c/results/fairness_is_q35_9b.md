# Direct baseline with flexible calibration (test n=1250, val n=573, K=4)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.9654 | 0.878 | 0.556 |
| direct + matrix scaling | 0.9785 | 0.904 | 0.430 |
| direct + null-MAD + vector scaling | 0.9669 | 0.874 | 0.565 |
| PRISM base noisy-OR | 0.9698 | 0.906 | 0.426 |
| PRISM MAD + gamma | 0.9821 | 0.929 | 0.380 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + matrix scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | +0.0035 | [-0.0051, +0.0123] | 0.448 |
| acc | +0.0248 | [+0.0104, +0.0408] | 0.002 |
| risk_cost | -0.0496 | [-0.1448, +0.0448] | 0.314 |
