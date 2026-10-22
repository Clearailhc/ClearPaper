# Ablations (test n=1250, val n=573, train n=0, eta=5.0)

metrics: accuracy (argmax) / risk_cost (cost-aware) / critical_miss (cost-aware)

## A. Aggregation

| variant | acc | risk_cost | critical_miss |
|---|---|---|---|
| ours: industry noisy-OR (calibrated on val) | 0.878 | 0.550 | 0.025 |
| no industry conditioning (max severity over industries) | 0.863 | 0.581 | 0.012 |
| unstructured logistic head (fit on val) | 0.896 | 0.561 | 0.115 |
| hard rule: max severity of branches with p > 0.5 | 0.809 | 0.598 | 0.061 |
| reference: direct + vector scaling (val) | 0.838 | 0.954 | 0.193 |

## B. Number of primitives (random subsets; mean over reps)

| primitives | ours acc | ours risk | logistic acc | logistic risk |
|---|---|---|---|---|
| 1 | 0.795 | 2.214 | 0.804 | 1.795 |
| 3 | 0.840 | 1.413 | 0.856 | 1.064 |
| 5 | 0.858 | 0.852 | 0.868 | 0.757 |
| 8 | 0.852 | 0.782 | 0.887 | 0.618 |
| 11 | 0.876 | 0.608 | 0.889 | 0.628 |
| 15 | 0.878 | 0.550 | 0.896 | 0.561 |

## C. Calibration set size (random val subsets; mean over reps)

| n_cal | ours acc | ours risk | direct+VS acc | direct+VS risk |
|---|---|---|---|---|
| 20 | 0.831 | 0.582 | 0.814 | 0.927 |
| 50 | 0.876 | 0.544 | 0.830 | 0.979 |
| 100 | 0.872 | 0.530 | 0.832 | 1.127 |
| 200 | 0.874 | 0.552 | 0.836 | 0.969 |
| 400 | 0.874 | 0.554 | 0.836 | 0.960 |
| 573 | 0.878 | 0.550 | 0.838 | 0.954 |

## D. Calibration parameters

| fitted | acc | risk_cost | critical_miss |
|---|---|---|---|
| none (raw branch probabilities) | 0.809 | 0.657 | 0.029 |
| shared temperature | 0.806 | 0.708 | 0.020 |
| + per-branch bias | 0.876 | 0.554 | 0.025 |
| + leak terms (full) | 0.878 | 0.550 | 0.025 |

## E. Hybrid aggregation (pre-specified, single evaluation)

| variant | acc | risk_cost | critical_miss |
|---|---|---|---|
| ours (noisy-OR) | 0.878 | 0.550 | 0.025 |
| unstructured logistic head | 0.896 | 0.562 | 0.115 |
| hybrid: logistic on [noisy-OR log-odds, branch logits, industry] | 0.901 | 0.425 | 0.086 |
