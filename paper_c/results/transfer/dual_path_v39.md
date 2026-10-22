# Dual-path (rule-composed x holistic) product of experts - exploratory (InspecSafe test)

| pair | rule path acc | direct path acc | dual-path acc | weights (a, b) | dual - direct (acc) |
|---|---|---|---|---|---|
| zero-shot | 0.919 | 0.897 | 0.918 | (0.98, 0.56) | +0.022 [+0.010, +0.033] p=0.001 |
| SFT s0 | 0.960 | 0.973 | 0.975 | (0.11, 0.92) | +0.002 [+0.000, +0.006] p=0.079 |
| SFT s1 | 0.959 | 0.970 | 0.972 | (0.16, 0.85) | +0.002 [+0.000, +0.004] p=0.282 |
| V26-full x Direct-SFT s0 | 0.946 | 0.973 | 0.974 | (0.14, 0.87) | +0.002 [-0.002, +0.005] p=0.437 |
| V39-dual (shared backbone) | 0.950 | 0.960 | 0.962 | (0.28, 0.69) | +0.002 [-0.003, +0.006] p=0.635 |
| two adapters: V39-full s0 x Direct-SFT s0 | 0.955 | 0.973 | 0.974 | (0.16, 0.83) | +0.001 [-0.003, +0.005] p=0.796 |
| two adapters: V39-full s1 x Direct-SFT s1 (primary) | 0.945 | 0.970 | 0.971 | (0.17, 0.84) | +0.001 [+0.000, +0.002] p=0.753 |

## D1 reference: Direct-SFT s0 (acc 0.973)

- zero-shot: dual - Direct-SFT s0 = -0.054 [-0.068, -0.042] p=0.000; 95% lower bound vs margin -0.005 decides D1 (#82)
- SFT s0: dual - Direct-SFT s0 = +0.002 [+0.000, +0.006] p=0.079; 95% lower bound vs margin -0.005 decides D1 (#82)
- SFT s1: dual - Direct-SFT s0 = -0.001 [-0.006, +0.005] p=0.901; 95% lower bound vs margin -0.005 decides D1 (#82)
- V26-full x Direct-SFT s0: dual - Direct-SFT s0 = +0.002 [-0.002, +0.005] p=0.437; 95% lower bound vs margin -0.005 decides D1 (#82)
- V39-dual (shared backbone): dual - Direct-SFT s0 = -0.011 [-0.018, -0.004] p=0.005; 95% lower bound vs margin -0.005 decides D1 (#82)
- two adapters: V39-full s0 x Direct-SFT s0: dual - Direct-SFT s0 = +0.001 [-0.003, +0.005] p=0.796; 95% lower bound vs margin -0.005 decides D1 (#82)
- two adapters: V39-full s1 x Direct-SFT s1 (primary): dual - Direct-SFT s0 = -0.002 [-0.007, +0.004] p=0.715; 95% lower bound vs margin -0.005 decides D1 (#82)
