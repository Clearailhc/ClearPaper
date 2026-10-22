# Ablations (test n=1250, val n=573, train n=0, eta=5.0)

metrics: accuracy (argmax) / risk_cost (cost-aware) / critical_miss (cost-aware)

## A. Aggregation

| variant | acc | risk_cost | critical_miss |
|---|---|---|---|
| ours: industry noisy-OR (calibrated on val) | 0.906 | 0.426 | 0.029 |
| no industry conditioning (max severity over industries) | 0.892 | 0.474 | 0.016 |
| unstructured logistic head (fit on val) | 0.884 | 0.601 | 0.111 |
| hard rule: max severity of branches with p > 0.5 | 0.863 | 0.549 | 0.090 |
| reference: direct + vector scaling (val) | 0.878 | 0.556 | 0.082 |

## B. Number of primitives (random subsets; mean over reps)

| primitives | ours acc | ours risk | logistic acc | logistic risk |
|---|---|---|---|---|
| 1 | 0.790 | 1.949 | 0.799 | 1.620 |
| 3 | 0.850 | 1.062 | 0.823 | 0.988 |
| 5 | 0.876 | 0.762 | 0.842 | 0.600 |
| 8 | 0.876 | 0.697 | 0.859 | 0.654 |
| 11 | 0.901 | 0.574 | 0.879 | 0.641 |
| 15 | 0.906 | 0.426 | 0.884 | 0.602 |

## C. Calibration set size (random val subsets; mean over reps)

| n_cal | ours acc | ours risk | direct+VS acc | direct+VS risk |
|---|---|---|---|---|
| 20 | 0.876 | 0.435 | 0.848 | 0.653 |
| 50 | 0.878 | 0.452 | 0.870 | 0.567 |
| 100 | 0.874 | 0.442 | 0.866 | 0.555 |
| 200 | 0.902 | 0.424 | 0.874 | 0.573 |
| 400 | 0.902 | 0.432 | 0.875 | 0.556 |
| 573 | 0.906 | 0.426 | 0.878 | 0.556 |

## D. Calibration parameters

| fitted | acc | risk_cost | critical_miss |
|---|---|---|---|
| none (raw branch probabilities) | 0.763 | 1.658 | 0.004 |
| shared temperature | 0.864 | 0.490 | 0.041 |
| + per-branch bias | 0.906 | 0.430 | 0.029 |
| + leak terms (full) | 0.906 | 0.426 | 0.029 |

## E. Hybrid aggregation (pre-specified, single evaluation)

| variant | acc | risk_cost | critical_miss |
|---|---|---|---|
| ours (noisy-OR) | 0.906 | 0.426 | 0.029 |
| unstructured logistic head | 0.884 | 0.601 | 0.111 |
| hybrid: logistic on [noisy-OR log-odds, branch logits, industry] | 0.894 | 0.288 | 0.033 |
