# V28 / V29 / V31 / V33 / V35 (InspecSafe test, n = 1250)

| system | acc | AUROC (hazard) | RPS |
|---|---|---|---|
| LUX zero-shot, human questions | 0.919 | 0.9834 | 0.0433 |
| V28 paraphrase set 1 | 0.914 | 0.9853 | 0.0415 |
| V28 paraphrase set 2 | 0.921 | 0.9850 | 0.0428 |
| V28 paraphrase set 3 | 0.906 | 0.9795 | 0.0462 |
| V29 fully automatic facts + table | 0.894 | 0.9771 | 0.0515 |
| direct zero-shot (matrix scaling) | 0.897 | 0.9747 | 0.0522 |
| V31 LLM aggregation (8b) | 0.878 | 0.9477 | 0.0605 |
| V31 LLM aggregation (32b) | 0.871 | 0.9683 | 0.0573 |
| Direct-SFT s0 | 0.973 | 0.9998 | 0.0103 |
| V33 Direct-SFT + description target | 0.971 | 0.9999 | 0.0105 |
| V35 generative zero-shot (unparsed -> level 0: 6) | 0.729 | 0.7887 | 0.1492 |

## pre-registered checks

- V28 accuracy range over human + 3 paraphrase sets: 1.5 points; AUROC range 0.0058 (pass if <= 2 points)
- V29 automatic - human: -0.026 [-0.038, -0.014] p=0.000 (pass if >= -0.02)
- V29 automatic - direct zero-shot: -0.003 [-0.018, +0.011] p=0.722 (pass if significantly > 0)
- V31 LLM aggregation 8B - noisy-OR: -0.042 [-0.058, -0.026] p=0.000
- V31 LLM aggregation 32B - noisy-OR: -0.048 [-0.064, -0.032] p=0.000
- V33 Direct-SFT + description - Direct-SFT: -0.002 [-0.007, +0.005] p=0.709
- V35 generative - LUX zero-shot: -0.190 [-0.217, -0.164] p=0.000; generative - direct zero-shot: -0.168 [-0.194, -0.143] p=0.000
