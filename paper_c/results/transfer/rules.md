# E4 rule change (InspecSafe test, Qwen3-VL-8B)

Ground truth under a new rule: level implied by the new table from the description, on images whose level implied by the official table equals the annotation. `changed` = images whose level the rule moves.

## format control (official rules, all test images)

| system | acc |
|---|---|
| zero-shot direct, verbatim prompt | 0.897 |
| zero-shot direct, rendered prompt | 0.890 |
| Direct-SFT, verbatim prompt | 0.973 |
| Direct-SFT, rendered prompt | 0.966 |
| rule-conditioned Direct-SFT, rendered prompt | 0.966 |
| PRISM-SFT closed-world labels | 0.961 |
| PRISM-SFT PU (closed-world + Elkan-Noto) | 0.959 |
| PRISM-SFT latent MIL | 0.958 |

## R1_ppe_stricter: {'set_all': {'no_gloves': 3, 'no_mask': 3}}

test kept 1192 / 1250; changed 48 (up 48, down 0); val changed 21

| system | acc | acc on changed | hazard recall | RPS |
|---|---|---|---|---|
| zero-shot PRISM [old-cal] | 0.949 | 1.000 | 0.861 | 0.0374 |
| zero-shot PRISM [new-cal] | 0.951 | 1.000 | 0.861 | 0.0360 |
| PRISM-SFT s0 [old-cal] | 0.987 | 1.000 | 0.979 | 0.0053 |
| PRISM-SFT s0 [new-cal] | 0.988 | 1.000 | 0.979 | 0.0053 |
| PRISM-SFT s1 [old-cal] | 0.990 | 1.000 | 0.992 | 0.0045 |
| PRISM-SFT s1 [new-cal] | 0.989 | 1.000 | 0.992 | 0.0049 |
| zero-shot direct, old prompt [old-cal] | 0.915 | 0.583 | 0.827 | 0.0491 |
| zero-shot direct, old prompt [new-cal] | 0.938 | 0.896 | 0.831 | 0.0441 |
| Direct-SFT, old prompt [old-cal] | 0.945 | 0.042 | 0.987 | 0.0180 |
| Direct-SFT, old prompt [new-cal] | 0.968 | 0.708 | 0.987 | 0.0085 |
| PRISM-SFT closed-world labels [old-cal] | 0.988 | 1.000 | 0.970 | 0.0050 |
| PRISM-SFT closed-world labels [new-cal] | 0.988 | 1.000 | 0.970 | 0.0050 |
| PRISM-SFT PU (closed-world + Elkan-Noto) [old-cal] | 0.988 | 1.000 | 0.970 | 0.0051 |
| PRISM-SFT PU (closed-world + Elkan-Noto) [new-cal] | 0.987 | 1.000 | 0.970 | 0.0052 |
| PRISM-SFT latent MIL [old-cal] | 0.982 | 1.000 | 0.979 | 0.0073 |
| PRISM-SFT latent MIL [new-cal] | 0.982 | 1.000 | 0.979 | 0.0091 |
| zero-shot direct, new prompt [old-cal] | 0.903 | 0.625 | 0.785 | 0.0534 |
| zero-shot direct, new prompt [new-cal] | 0.930 | 0.917 | 0.806 | 0.0483 |
| Direct-SFT, new prompt [old-cal] | 0.943 | 0.125 | 0.987 | 0.0162 |
| Direct-SFT, new prompt [new-cal] | 0.980 | 0.875 | 0.987 | 0.0069 |
| Direct-SFT + 200 relabelled, new prompt [old-cal] | 0.969 | 0.896 | 0.992 | 0.0114 |
| Direct-SFT + 200 relabelled, new prompt [new-cal] | 0.981 | 0.979 | 0.992 | 0.0056 |
| rule-conditioned Direct-SFT, new prompt [old-cal] | 0.954 | 0.458 | 0.996 | 0.0117 |
| rule-conditioned Direct-SFT, new prompt [new-cal] | 0.988 | 0.979 | 1.000 | 0.0043 |
| Direct-SFT retrained on relabelled train (upper bound) [old-cal] | 0.980 | 0.854 | 1.000 | 0.0080 |
| Direct-SFT retrained on relabelled train (upper bound) [new-cal] | 0.978 | 0.938 | 1.000 | 0.0063 |

paired accuracy differences on the changed images (bootstrap):
- [old-cal] PRISM-SFT closed-world labels - PRISM-SFT s0: +0.000 [+0.000, +0.000] p=1.000
- [old-cal] PRISM-SFT PU (closed-world + Elkan-Noto) - PRISM-SFT s0: +0.000 [+0.000, +0.000] p=1.000
- [old-cal] PRISM-SFT latent MIL - PRISM-SFT s0: +0.000 [+0.000, +0.000] p=1.000
- [old-cal] PRISM-SFT s0 - Direct-SFT, old prompt: +0.958 [+0.896, +1.000] p=0.000
- [old-cal] PRISM-SFT s0 - Direct-SFT, new prompt: +0.875 [+0.791, +0.958] p=0.000
- [old-cal] PRISM-SFT s0 - Direct-SFT + 200 relabelled, new prompt: +0.104 [+0.021, +0.208] p=0.010
- [old-cal] PRISM-SFT s0 - rule-conditioned Direct-SFT, new prompt: +0.542 [+0.396, +0.688] p=0.000
- [new-cal] PRISM-SFT closed-world labels - PRISM-SFT s0: +0.000 [+0.000, +0.000] p=1.000
- [new-cal] PRISM-SFT PU (closed-world + Elkan-Noto) - PRISM-SFT s0: +0.000 [+0.000, +0.000] p=1.000
- [new-cal] PRISM-SFT latent MIL - PRISM-SFT s0: +0.000 [+0.000, +0.000] p=1.000
- [new-cal] PRISM-SFT s0 - Direct-SFT, old prompt: +0.292 [+0.167, +0.417] p=0.000
- [new-cal] PRISM-SFT s0 - Direct-SFT, new prompt: +0.125 [+0.042, +0.229] p=0.000
- [new-cal] PRISM-SFT s0 - Direct-SFT + 200 relabelled, new prompt: +0.021 [+0.000, +0.062] p=0.721
- [new-cal] PRISM-SFT s0 - rule-conditioned Direct-SFT, new prompt: +0.021 [+0.000, +0.062] p=0.721
- reference (official rules, same kept images): zero-shot PRISM 0.926, PRISM-SFT s0 0.967, PRISM-SFT s1 0.967, zero-shot direct, old prompt 0.904, Direct-SFT, old prompt 0.978, PRISM-SFT closed-world labels 0.967, PRISM-SFT PU (closed-world + Elkan-Noto) 0.966, PRISM-SFT latent MIL 0.965

## R2_ppe_relaxed: {'set_all': {'no_hard_hat': 2, 'no_gloves': 1, 'no_mask': 1}}

test kept 1192 / 1250; changed 43 (up 0, down 43); val changed 20

| system | acc | acc on changed | hazard recall | RPS |
|---|---|---|---|---|
| zero-shot PRISM [old-cal] | 0.907 | 0.512 | 0.827 | 0.0460 |
| zero-shot PRISM [new-cal] | 0.911 | 0.512 | 0.827 | 0.0460 |
| PRISM-SFT s0 [old-cal] | 0.943 | 0.442 | 0.979 | 0.0187 |
| PRISM-SFT s0 [new-cal] | 0.944 | 0.442 | 0.979 | 0.0190 |
| PRISM-SFT s1 [old-cal] | 0.941 | 0.140 | 0.992 | 0.0215 |
| PRISM-SFT s1 [new-cal] | 0.946 | 0.279 | 0.992 | 0.0195 |
| zero-shot direct, old prompt [old-cal] | 0.884 | 0.116 | 0.827 | 0.0565 |
| zero-shot direct, old prompt [new-cal] | 0.878 | 0.372 | 0.827 | 0.0546 |
| Direct-SFT, old prompt [old-cal] | 0.948 | 0.070 | 0.987 | 0.0199 |
| Direct-SFT, old prompt [new-cal] | 0.936 | 0.140 | 0.987 | 0.0201 |
| PRISM-SFT closed-world labels [old-cal] | 0.950 | 0.558 | 0.970 | 0.0166 |
| PRISM-SFT closed-world labels [new-cal] | 0.951 | 0.558 | 0.970 | 0.0166 |
| PRISM-SFT PU (closed-world + Elkan-Noto) [old-cal] | 0.949 | 0.581 | 0.970 | 0.0181 |
| PRISM-SFT PU (closed-world + Elkan-Noto) [new-cal] | 0.950 | 0.581 | 0.970 | 0.0180 |
| PRISM-SFT latent MIL [old-cal] | 0.945 | 0.628 | 0.979 | 0.0197 |
| PRISM-SFT latent MIL [new-cal] | 0.943 | 0.581 | 0.979 | 0.0182 |
| zero-shot direct, new prompt [old-cal] | 0.868 | 0.279 | 0.747 | 0.0634 |
| zero-shot direct, new prompt [new-cal] | 0.862 | 0.279 | 0.717 | 0.0625 |
| Direct-SFT, new prompt [old-cal] | 0.946 | 0.070 | 0.996 | 0.0199 |
| Direct-SFT, new prompt [new-cal] | 0.948 | 0.326 | 0.996 | 0.0185 |
| Direct-SFT + 200 relabelled, new prompt [old-cal] | 0.941 | 0.186 | 1.000 | 0.0183 |
| Direct-SFT + 200 relabelled, new prompt [new-cal] | 0.944 | 0.558 | 1.000 | 0.0175 |
| rule-conditioned Direct-SFT, new prompt [old-cal] | 0.945 | 0.256 | 1.000 | 0.0190 |
| rule-conditioned Direct-SFT, new prompt [new-cal] | 0.936 | 0.488 | 1.000 | 0.0168 |
| Direct-SFT retrained on relabelled train (upper bound) [old-cal] | 0.951 | 0.279 | 1.000 | 0.0161 |
| Direct-SFT retrained on relabelled train (upper bound) [new-cal] | 0.956 | 0.651 | 1.000 | 0.0129 |

paired accuracy differences on the changed images (bootstrap):
- [old-cal] PRISM-SFT closed-world labels - PRISM-SFT s0: +0.116 [-0.023, +0.256] p=0.121
- [old-cal] PRISM-SFT PU (closed-world + Elkan-Noto) - PRISM-SFT s0: +0.140 [+0.000, +0.279] p=0.069
- [old-cal] PRISM-SFT latent MIL - PRISM-SFT s0: +0.186 [+0.047, +0.326] p=0.009
- [old-cal] PRISM-SFT s0 - Direct-SFT, old prompt: +0.372 [+0.209, +0.535] p=0.000
- [old-cal] PRISM-SFT s0 - Direct-SFT, new prompt: +0.372 [+0.209, +0.535] p=0.000
- [old-cal] PRISM-SFT s0 - Direct-SFT + 200 relabelled, new prompt: +0.256 [+0.093, +0.419] p=0.002
- [old-cal] PRISM-SFT s0 - rule-conditioned Direct-SFT, new prompt: +0.186 [+0.047, +0.349] p=0.020
- [new-cal] PRISM-SFT closed-world labels - PRISM-SFT s0: +0.116 [-0.023, +0.256] p=0.121
- [new-cal] PRISM-SFT PU (closed-world + Elkan-Noto) - PRISM-SFT s0: +0.140 [+0.000, +0.279] p=0.069
- [new-cal] PRISM-SFT latent MIL - PRISM-SFT s0: +0.140 [+0.023, +0.256] p=0.036
- [new-cal] PRISM-SFT s0 - Direct-SFT, old prompt: +0.302 [+0.140, +0.442] p=0.000
- [new-cal] PRISM-SFT s0 - Direct-SFT, new prompt: +0.116 [-0.023, +0.256] p=0.111
- [new-cal] PRISM-SFT s0 - Direct-SFT + 200 relabelled, new prompt: -0.116 [-0.256, +0.023] p=0.144
- [new-cal] PRISM-SFT s0 - rule-conditioned Direct-SFT, new prompt: -0.047 [-0.209, +0.116] p=0.638
- reference (official rules, same kept images): zero-shot PRISM 0.926, PRISM-SFT s0 0.967, PRISM-SFT s1 0.967, zero-shot direct, old prompt 0.904, Direct-SFT, old prompt 0.978, PRISM-SFT closed-world labels 0.967, PRISM-SFT PU (closed-world + Elkan-Noto) 0.966, PRISM-SFT latent MIL 0.965

## R3_phone_smoking_relaxed: {'set_all': {'mobile_phone': 1, 'smoking': 2}}

test kept 1192 / 1250; changed 16 (up 0, down 16); val changed 6

| system | acc | acc on changed | hazard recall | RPS |
|---|---|---|---|---|
| zero-shot PRISM [old-cal] | 0.929 | 0.875 | 0.848 | 0.0406 |
| zero-shot PRISM [new-cal] | 0.928 | 0.875 | 0.861 | 0.0404 |
| PRISM-SFT s0 [old-cal] | 0.977 | 0.812 | 0.979 | 0.0085 |
| PRISM-SFT s0 [new-cal] | 0.977 | 0.812 | 0.979 | 0.0085 |
| PRISM-SFT s1 [old-cal] | 0.978 | 0.938 | 0.992 | 0.0086 |
| PRISM-SFT s1 [new-cal] | 0.977 | 0.938 | 0.992 | 0.0090 |
| zero-shot direct, old prompt [old-cal] | 0.899 | 0.250 | 0.827 | 0.0513 |
| zero-shot direct, old prompt [new-cal] | 0.898 | 0.500 | 0.827 | 0.0513 |
| Direct-SFT, old prompt [old-cal] | 0.980 | 0.562 | 0.987 | 0.0075 |
| Direct-SFT, old prompt [new-cal] | 0.976 | 0.625 | 0.987 | 0.0083 |
| PRISM-SFT closed-world labels [old-cal] | 0.976 | 0.938 | 0.970 | 0.0089 |
| PRISM-SFT closed-world labels [new-cal] | 0.975 | 0.938 | 0.970 | 0.0089 |
| PRISM-SFT PU (closed-world + Elkan-Noto) [old-cal] | 0.975 | 0.938 | 0.970 | 0.0091 |
| PRISM-SFT PU (closed-world + Elkan-Noto) [new-cal] | 0.975 | 0.938 | 0.970 | 0.0091 |
| PRISM-SFT latent MIL [old-cal] | 0.973 | 0.938 | 0.979 | 0.0100 |
| PRISM-SFT latent MIL [new-cal] | 0.973 | 0.938 | 0.979 | 0.0099 |
| zero-shot direct, new prompt [old-cal] | 0.862 | 0.000 | 0.620 | 0.0676 |
| zero-shot direct, new prompt [new-cal] | 0.862 | 0.000 | 0.620 | 0.0683 |
| Direct-SFT, new prompt [old-cal] | 0.973 | 0.562 | 0.987 | 0.0078 |
| Direct-SFT, new prompt [new-cal] | 0.976 | 0.688 | 0.996 | 0.0077 |
| Direct-SFT + 200 relabelled, new prompt [old-cal] | 0.978 | 0.688 | 0.992 | 0.0075 |
| Direct-SFT + 200 relabelled, new prompt [new-cal] | 0.972 | 0.688 | 0.996 | 0.0083 |
| rule-conditioned Direct-SFT, new prompt [old-cal] | 0.977 | 0.750 | 1.000 | 0.0071 |
| rule-conditioned Direct-SFT, new prompt [new-cal] | 0.973 | 0.750 | 1.000 | 0.0081 |
| Direct-SFT retrained on relabelled train (upper bound) [old-cal] | 0.964 | 0.125 | 1.000 | 0.0107 |
| Direct-SFT retrained on relabelled train (upper bound) [new-cal] | 0.959 | 0.250 | 1.000 | 0.0123 |

paired accuracy differences on the changed images (bootstrap):
- [old-cal] PRISM-SFT closed-world labels - PRISM-SFT s0: +0.125 [+0.000, +0.312] p=0.253
- [old-cal] PRISM-SFT PU (closed-world + Elkan-Noto) - PRISM-SFT s0: +0.125 [+0.000, +0.312] p=0.253
- [old-cal] PRISM-SFT latent MIL - PRISM-SFT s0: +0.125 [+0.000, +0.312] p=0.253
- [old-cal] PRISM-SFT s0 - Direct-SFT, old prompt: +0.250 [+0.062, +0.500] p=0.018
- [old-cal] PRISM-SFT s0 - Direct-SFT, new prompt: +0.250 [+0.062, +0.500] p=0.019
- [old-cal] PRISM-SFT s0 - Direct-SFT + 200 relabelled, new prompt: +0.125 [+0.000, +0.312] p=0.249
- [old-cal] PRISM-SFT s0 - rule-conditioned Direct-SFT, new prompt: +0.062 [+0.000, +0.188] p=0.712
- [new-cal] PRISM-SFT closed-world labels - PRISM-SFT s0: +0.125 [+0.000, +0.312] p=0.253
- [new-cal] PRISM-SFT PU (closed-world + Elkan-Noto) - PRISM-SFT s0: +0.125 [+0.000, +0.312] p=0.253
- [new-cal] PRISM-SFT latent MIL - PRISM-SFT s0: +0.125 [+0.000, +0.312] p=0.253
- [new-cal] PRISM-SFT s0 - Direct-SFT, old prompt: +0.188 [+0.000, +0.375] p=0.065
- [new-cal] PRISM-SFT s0 - Direct-SFT, new prompt: +0.125 [+0.000, +0.312] p=0.249
- [new-cal] PRISM-SFT s0 - Direct-SFT + 200 relabelled, new prompt: +0.125 [+0.000, +0.312] p=0.249
- [new-cal] PRISM-SFT s0 - rule-conditioned Direct-SFT, new prompt: +0.062 [+0.000, +0.188] p=0.712
- reference (official rules, same kept images): zero-shot PRISM 0.926, PRISM-SFT s0 0.967, PRISM-SFT s1 0.967, zero-shot direct, old prompt 0.904, Direct-SFT, old prompt 0.978, PRISM-SFT closed-world labels 0.967, PRISM-SFT PU (closed-world + Elkan-Noto) 0.966, PRISM-SFT latent MIL 0.965
