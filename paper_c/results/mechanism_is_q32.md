# Mechanism check for directions 1+2 (test n=1250, val n=573)

AUROC (any hazard / defect vs none) | accuracy (argmax) | risk_cost (cost-aware, eta)

| n_cal | variant | AUROC | acc | risk_cost |
|---|---|---|---|---|
| 50 | base | 0.9720 | 0.888 | 0.476 |
| 50 | per-branch T | 0.9558 | 0.880 | 0.455 |
| 50 | gamma only | 0.9728 | 0.902 | 0.434 |
| 50 | MAD only | 0.9719 | 0.904 | 1.762 |
| 50 | MAD + gamma | 0.9751 | 0.911 | 0.539 |
| 100 | base | 0.9687 | 0.872 | 0.477 |
| 100 | per-branch T | 0.9670 | 0.897 | 0.447 |
| 100 | gamma only | 0.9730 | 0.898 | 0.398 |
| 100 | MAD only | 0.9711 | 0.904 | 1.780 |
| 100 | MAD + gamma | 0.9811 | 0.910 | 0.398 |
| 573 | base | 0.9728 | 0.889 | 0.451 |
| 573 | per-branch T | 0.9770 | 0.911 | 0.425 |
| 573 | gamma only | 0.9812 | 0.925 | 0.370 |
| 573 | MAD only | 0.9688 | 0.904 | 1.783 |
| 573 | MAD + gamma | 0.9823 | 0.915 | 0.352 |
