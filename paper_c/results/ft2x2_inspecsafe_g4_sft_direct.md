# Direct baseline with flexible calibration (test n=1250, val n=573, K=4)

| system | AUROC | acc (argmax) | risk_cost (cost-aware) |
|---|---|---|---|
| direct + vector scaling | 0.9923 | 0.946 | 0.148 |
| direct + matrix scaling | 0.9922 | 0.942 | 0.153 |
| direct + null-MAD + vector scaling | 0.9926 | 0.939 | 0.207 |
| PRISM base noisy-OR | 0.9845 | 0.914 | 0.317 |
| PRISM MAD + gamma | 0.9867 | 0.940 | 0.274 |

## Paired bootstrap: PRISM MAD + gamma minus the best direct variant (direct + null-MAD + vector scaling)

| metric | diff | 95% CI | p |
|---|---|---|---|
| AUROC | -0.0059 | [-0.0106, -0.0022] | 0.002 |
| acc | +0.0008 | [-0.0128, +0.0144] | 0.930 |
| risk_cost | +0.0672 | [+0.0064, +0.1208] | 0.036 |
