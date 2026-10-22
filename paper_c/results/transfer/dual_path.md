# Dual-path (rule-composed x holistic) product of experts - exploratory (InspecSafe test)

| pair | rule path acc | direct path acc | dual-path acc | weights (a, b) | dual - direct (acc) |
|---|---|---|---|---|---|
| zero-shot | 0.919 | 0.897 | 0.918 | (0.98, 0.56) | +0.022 [+0.010, +0.033] p=0.001 |
| SFT s0 | 0.960 | 0.973 | 0.975 | (0.11, 0.92) | +0.002 [+0.000, +0.006] p=0.079 |
| SFT s1 | 0.959 | 0.970 | 0.972 | (0.16, 0.85) | +0.002 [+0.000, +0.004] p=0.282 |
