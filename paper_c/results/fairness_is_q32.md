# Direct baseline with flexible calibration (test n=1250, val n=573, K=4)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.9586 | 0.870 | 0.623 |
| direct + matrix scaling | 0.9730 | 0.901 | 0.470 |
| direct + null-MAD + vector scaling | 0.9561 | 0.853 | 0.702 |
| PRISM base noisy-OR | 0.9728 | 0.889 | 0.451 |
| PRISM MAD + gamma | 0.9823 | 0.915 | 0.352 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + matrix scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | +0.0093 | [-0.0004, +0.0188] | 0.068 |
| acc | +0.0144 | [-0.0032, +0.0320] | 0.108 |
| risk_cost | -0.1176 | [-0.2232, -0.0135] | 0.030 |
