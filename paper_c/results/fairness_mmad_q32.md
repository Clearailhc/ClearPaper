# Direct baseline with flexible calibration (test n=5806, val n=2491, K=2)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.7841 | 0.701 | 0.393 |
| direct + matrix scaling | 0.7841 | 0.713 | 0.393 |
| direct + null-MAD + vector scaling | 0.7841 | 0.701 | 0.393 |
| PRISM base noisy-OR | 0.8281 | 0.751 | 0.371 |
| PRISM MAD + gamma | 0.8364 | 0.755 | 0.396 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + matrix scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | +0.0524 | [+0.0415, +0.0634] | 0.000 |
| acc | +0.0417 | [+0.0289, +0.0548] | 0.000 |
| risk_cost | +0.0040 | [-0.0140, +0.0210] | 0.652 |
