# Ablations (test n=1250, val n=573, train n=0, eta=5.0)

metrics: accuracy (argmax) / risk_cost (cost-aware) / critical_miss (cost-aware)

## A. Aggregation

| variant | acc | risk_cost | critical_miss |
|---|---|---|---|
| ours: industry noisy-OR (calibrated on val) | 0.831 | 0.782 | 0.033 |
| no industry conditioning (max severity over industries) | 0.870 | 0.862 | 0.016 |
| unstructured logistic head (fit on val) | 0.898 | 0.647 | 0.156 |
| hard rule: max severity of branches with p > 0.5 | 0.651 | 0.830 | 0.029 |
| reference: direct + vector scaling (val) | 0.810 | 1.490 | 0.189 |

## B. Number of primitives (random subsets; mean over reps)

| primitives | ours acc | ours risk | logistic acc | logistic risk |
|---|---|---|---|---|
| 1 | 0.792 | 1.993 | 0.798 | 1.696 |
| 3 | 0.824 | 1.413 | 0.848 | 1.074 |
| 5 | 0.843 | 0.826 | 0.878 | 0.734 |
| 8 | 0.830 | 0.904 | 0.893 | 0.683 |
| 11 | 0.857 | 0.794 | 0.888 | 0.671 |
| 15 | 0.831 | 0.782 | 0.898 | 0.654 |

## C. Calibration set size (random val subsets; mean over reps)

| n_cal | ours acc | ours risk | direct+VS acc | direct+VS risk |
|---|---|---|---|---|
| 20 | 0.728 | 0.790 | 0.769 | 1.555 |
| 50 | 0.770 | 0.792 | 0.808 | 1.682 |
| 100 | 0.840 | 0.740 | 0.809 | 1.551 |
| 200 | 0.827 | 0.790 | 0.804 | 1.479 |
| 400 | 0.821 | 0.776 | 0.808 | 1.496 |
| 573 | 0.831 | 0.782 | 0.810 | 1.490 |

## D. Calibration parameters

| fitted | acc | risk_cost | critical_miss |
|---|---|---|---|
| none (raw branch probabilities) | 0.648 | 0.988 | 0.016 |
| shared temperature | 0.648 | 0.998 | 0.016 |
| + per-branch bias | 0.831 | 0.790 | 0.033 |
| + leak terms (full) | 0.831 | 0.782 | 0.033 |

## E. Hybrid aggregation (pre-specified, single evaluation)

| variant | acc | risk_cost | critical_miss |
|---|---|---|---|
| ours (noisy-OR) | 0.831 | 0.782 | 0.033 |
| unstructured logistic head | 0.898 | 0.651 | 0.156 |
| hybrid: logistic on [noisy-OR log-odds, branch logits, industry] | 0.866 | 0.508 | 0.070 |
