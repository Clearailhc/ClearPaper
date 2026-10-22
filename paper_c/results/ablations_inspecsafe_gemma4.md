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
| 1 | 0.803 | 1.946 | 0.812 | 1.576 |
| 3 | 0.826 | 1.261 | 0.867 | 0.895 |
| 5 | 0.828 | 1.050 | 0.859 | 0.885 |
| 8 | 0.821 | 0.977 | 0.879 | 0.721 |
| 11 | 0.823 | 0.833 | 0.893 | 0.643 |
| 15 | 0.831 | 0.782 | 0.899 | 0.651 |

## C. Calibration set size (random val subsets; mean over reps)

| n_cal | ours acc | ours risk | direct+VS acc | direct+VS risk |
|---|---|---|---|---|
| 20 | 0.781 | 0.819 | 0.794 | 1.809 |
| 50 | 0.814 | 0.800 | 0.806 | 1.668 |
| 100 | 0.830 | 0.823 | 0.807 | 1.540 |
| 200 | 0.830 | 0.786 | 0.809 | 1.512 |
| 400 | 0.834 | 0.783 | 0.809 | 1.491 |
| 573 | 0.831 | 0.782 | 0.810 | 1.490 |

## D. Calibration parameters

| fitted | acc | risk_cost | critical_miss |
|---|---|---|---|
| none (raw branch probabilities) | 0.648 | 0.988 | 0.016 |
| shared temperature | 0.648 | 0.998 | 0.016 |
| + per-branch bias | 0.831 | 0.790 | 0.033 |
| + leak terms (full) | 0.831 | 0.782 | 0.033 |
