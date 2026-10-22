# Ablations (test n=1250, val n=573, train n=0, eta=5.0)

metrics: accuracy (argmax) / risk_cost (cost-aware) / critical_miss (cost-aware)

## A. Aggregation

| variant | acc | risk_cost | critical_miss |
|---|---|---|---|
| ours: industry noisy-OR (calibrated on val) | 0.889 | 0.451 | 0.025 |
| no industry conditioning (max severity over industries) | 0.886 | 0.485 | 0.020 |
| unstructured logistic head (fit on val) | 0.901 | 0.506 | 0.102 |
| hard rule: max severity of branches with p > 0.5 | 0.836 | 0.471 | 0.049 |
| reference: direct + vector scaling (val) | 0.870 | 0.623 | 0.102 |

## B. Number of primitives (random subsets; mean over reps)

| primitives | ours acc | ours risk | logistic acc | logistic risk |
|---|---|---|---|---|
| 1 | 0.789 | 2.097 | 0.807 | 1.673 |
| 3 | 0.845 | 1.247 | 0.861 | 0.958 |
| 5 | 0.859 | 0.794 | 0.881 | 0.575 |
| 8 | 0.867 | 0.722 | 0.891 | 0.567 |
| 11 | 0.893 | 0.561 | 0.900 | 0.547 |
| 15 | 0.889 | 0.451 | 0.901 | 0.511 |

## C. Calibration set size (random val subsets; mean over reps)

| n_cal | ours acc | ours risk | direct+VS acc | direct+VS risk |
|---|---|---|---|---|
| 20 | 0.858 | 0.506 | 0.859 | 0.701 |
| 50 | 0.856 | 0.467 | 0.855 | 0.618 |
| 100 | 0.882 | 0.432 | 0.854 | 0.670 |
| 200 | 0.884 | 0.447 | 0.873 | 0.636 |
| 400 | 0.888 | 0.456 | 0.869 | 0.626 |
| 573 | 0.889 | 0.451 | 0.870 | 0.614 |

## D. Calibration parameters

| fitted | acc | risk_cost | critical_miss |
|---|---|---|---|
| none (raw branch probabilities) | 0.835 | 0.565 | 0.037 |
| shared temperature | 0.833 | 0.622 | 0.029 |
| + per-branch bias | 0.889 | 0.454 | 0.025 |
| + leak terms (full) | 0.889 | 0.451 | 0.025 |

## E. Hybrid aggregation (pre-specified, single evaluation)

| variant | acc | risk_cost | critical_miss |
|---|---|---|---|
| ours (noisy-OR) | 0.889 | 0.451 | 0.025 |
| unstructured logistic head | 0.901 | 0.499 | 0.098 |
| hybrid: logistic on [noisy-OR log-odds, branch logits, industry] | 0.896 | 0.325 | 0.053 |
