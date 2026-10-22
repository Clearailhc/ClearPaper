# Ablations (test n=1250, val n=573, train n=3190, eta=5.0)

metrics: accuracy (argmax) / risk_cost (cost-aware) / critical_miss (cost-aware)

## A. Aggregation

| variant | acc | risk_cost | critical_miss |
|---|---|---|---|
| ours: industry noisy-OR (calibrated on val) | 0.878 | 0.550 | 0.025 |
| no industry conditioning (max severity over industries) | 0.863 | 0.581 | 0.012 |
| learned severity table from train (11 cells differ from official) | 0.878 | 0.515 | 0.025 |
| ours, calibrated on train instead of val | 0.880 | 0.542 | 0.020 |
| unstructured logistic head (fit on val) | 0.896 | 0.562 | 0.115 |
| unstructured logistic head (fit on train) | 0.907 | 0.515 | 0.094 |
| hard rule: max severity of branches with p > 0.5 | 0.809 | 0.598 | 0.061 |
| reference: direct + vector scaling (val) | 0.838 | 0.954 | 0.193 |

## B. Number of primitives (random subsets; mean over reps)

| primitives | ours acc | ours risk | logistic acc | logistic risk |
|---|---|---|---|---|
| 1 | 0.805 | 2.018 | 0.816 | 1.601 |
| 3 | 0.832 | 1.345 | 0.854 | 1.037 |
| 5 | 0.846 | 1.122 | 0.872 | 0.835 |
| 8 | 0.862 | 0.798 | 0.880 | 0.685 |
| 11 | 0.876 | 0.632 | 0.893 | 0.591 |
| 15 | 0.878 | 0.550 | 0.896 | 0.557 |

## C. Calibration set size (random val subsets; mean over reps)

| n_cal | ours acc | ours risk | direct+VS acc | direct+VS risk |
|---|---|---|---|---|
| 20 | 0.853 | 0.585 | 0.823 | 1.021 |
| 50 | 0.864 | 0.573 | 0.835 | 1.016 |
| 100 | 0.876 | 0.545 | 0.836 | 1.013 |
| 200 | 0.879 | 0.547 | 0.838 | 0.976 |
| 400 | 0.878 | 0.545 | 0.836 | 0.955 |
| 573 | 0.878 | 0.550 | 0.838 | 0.954 |

## D. Calibration parameters

| fitted | acc | risk_cost | critical_miss |
|---|---|---|---|
| none (raw branch probabilities) | 0.809 | 0.657 | 0.029 |
| shared temperature | 0.806 | 0.708 | 0.020 |
| + per-branch bias | 0.876 | 0.554 | 0.025 |
| + leak terms (full) | 0.878 | 0.550 | 0.025 |
