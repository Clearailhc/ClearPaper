# V27 selective prediction (InspecSafe test, Qwen3-VL-8B)

n = 1250; level-one images = 169. Risk = 0-1 error of the argmax level. AURC = mean risk over all coverages (lower is better).

| system | acc | AURC (max-prob) | AURC (cost-aware) | error @90% | error @80% | level-one missed in the auto 90% |
|---|---|---|---|---|---|---|
| zero-shot direct | 0.897 | 0.0175 | 0.0260 | 0.0613 | 0.0300 | 31 |
| zero-shot PRISM | 0.919 | 0.0108 | 0.0284 | 0.0400 | 0.0160 | 20 |
| Direct-SFT s0 | 0.973 | 0.0018 | 0.0014 | 0.0062 | 0.0030 | 2 |
| Direct-SFT s1 | 0.970 | 0.0022 | 0.0016 | 0.0107 | 0.0000 | 7 |
| PRISM-SFT s0 | 0.960 | 0.0051 | 0.0054 | 0.0089 | 0.0010 | 0 |
| PRISM-SFT s1 | 0.959 | 0.0049 | 0.0151 | 0.0080 | 0.0010 | 0 |
| PRISM-SFT closed-world (V19) | 0.961 | 0.0027 | 0.0058 | 0.0089 | 0.0030 | 0 |
| PRISM-SFT latent MIL (V25) | 0.958 | 0.0041 | 0.0077 | 0.0142 | 0.0040 | 5 |

## paired bootstrap of AURC (max-prob confidence)

- PRISM-SFT s0 - Direct-SFT s0: +0.0033 [+0.0001, +0.0092] p=0.040
- PRISM-SFT s1 - Direct-SFT s1: +0.0027 [-0.0005, +0.0080] p=0.228
- zero-shot PRISM - zero-shot direct: -0.0067 [-0.0125, -0.0019] p=0.000
- PRISM-SFT latent MIL (V25) - Direct-SFT s0: +0.0023 [+0.0010, +0.0037] p=0.000
