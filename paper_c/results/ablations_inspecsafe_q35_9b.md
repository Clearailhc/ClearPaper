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
| 1 | 0.811 | 1.790 | 0.802 | 1.550 |
| 3 | 0.848 | 1.087 | 0.822 | 0.828 |
| 5 | 0.865 | 0.774 | 0.829 | 0.745 |
| 8 | 0.882 | 0.647 | 0.858 | 0.588 |
| 11 | 0.894 | 0.576 | 0.875 | 0.593 |
| 15 | 0.906 | 0.426 | 0.884 | 0.602 |

## C. Calibration set size (random val subsets; mean over reps)

| n_cal | ours acc | ours risk | direct+VS acc | direct+VS risk |
|---|---|---|---|---|
| 20 | 0.895 | 0.558 | 0.865 | 0.681 |
| 50 | 0.888 | 0.494 | 0.873 | 0.576 |
| 100 | 0.910 | 0.447 | 0.876 | 0.560 |
| 200 | 0.898 | 0.444 | 0.875 | 0.559 |
| 400 | 0.902 | 0.437 | 0.876 | 0.556 |
| 573 | 0.906 | 0.426 | 0.878 | 0.556 |

## D. Calibration parameters

| fitted | acc | risk_cost | critical_miss |
|---|---|---|---|
| none (raw branch probabilities) | 0.763 | 1.658 | 0.004 |
| shared temperature | 0.864 | 0.490 | 0.041 |
| + per-branch bias | 0.906 | 0.430 | 0.029 |
| + leak terms (full) | 0.906 | 0.426 | 0.029 |
