# Direct baseline with flexible calibration (test n=1250, val n=573, K=4)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.9254 | 0.865 | 0.822 |
| direct + matrix scaling | 0.9300 | 0.874 | 0.802 |
| direct + null-MAD + vector scaling | 0.9233 | 0.871 | 0.790 |
| PRISM base noisy-OR | 0.9827 | 0.934 | 0.382 |
| PRISM MAD + gamma | 0.9840 | 0.934 | 0.328 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + matrix scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | +0.0540 | [+0.0353, +0.0739] | 0.000 |
| acc | +0.0600 | [+0.0440, +0.0768] | 0.000 |
| risk_cost | -0.4736 | [-0.6096, -0.3479] | 0.000 |
