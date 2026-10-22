# Mechanism check for directions 1+2 (test n=1250, val n=573)

AUROC (any hazard / defect vs none) | accuracy (argmax) | risk_cost (cost-aware, eta)

| n_cal | variant | AUROC | acc | risk_cost |
|---|---|---|---|---|
| 50 | base | 0.9642 | 0.861 | 0.557 |
| 50 | per-branch T | 0.9538 | 0.877 | 0.574 |
| 50 | gamma only | 0.9584 | 0.885 | 0.628 |
| 50 | MAD only | 0.9746 | 0.894 | 1.832 |
| 50 | MAD + gamma | 0.9808 | 0.907 | 0.498 |
| 100 | base | 0.9657 | 0.862 | 0.568 |
| 100 | per-branch T | 0.9661 | 0.876 | 0.521 |
| 100 | gamma only | 0.9689 | 0.882 | 0.559 |
| 100 | MAD only | 0.9736 | 0.900 | 1.852 |
| 100 | MAD + gamma | 0.9815 | 0.914 | 0.460 |
| 573 | base | 0.9665 | 0.878 | 0.550 |
| 573 | per-branch T | 0.9698 | 0.905 | 0.479 |
| 573 | gamma only | 0.9690 | 0.899 | 0.482 |
| 573 | MAD only | 0.9728 | 0.899 | 1.843 |
| 573 | MAD + gamma | 0.9834 | 0.919 | 0.416 |
