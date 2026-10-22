# Mechanism check for directions 1+2 (test n=5806, val n=2491)

AUROC (any hazard / defect vs none) | accuracy (argmax) | risk_cost (cost-aware, eta)

| n_cal | variant | AUROC | acc | risk_cost |
|---|---|---|---|---|
| 50 | base | 0.7064 | 0.643 | 0.716 |
| 50 | per-branch T | 0.6985 | 0.637 | 0.930 |
| 50 | gamma only | 0.6867 | 0.624 | 0.820 |
| 50 | MAD only | 0.7064 | 0.643 | 0.716 |
| 50 | MAD + gamma | 0.6867 | 0.624 | 0.820 |
| 100 | base | 0.7340 | 0.675 | 0.555 |
| 100 | per-branch T | 0.7083 | 0.658 | 0.724 |
| 100 | gamma only | 0.7243 | 0.667 | 0.595 |
| 100 | MAD only | 0.7335 | 0.676 | 0.543 |
| 100 | MAD + gamma | 0.7224 | 0.666 | 0.593 |
| 2491 | base | 0.8062 | 0.730 | 0.379 |
| 2491 | per-branch T | 0.8158 | 0.736 | 0.374 |
| 2491 | gamma only | 0.8081 | 0.731 | 0.375 |
| 2491 | MAD only | 0.7972 | 0.720 | 0.388 |
| 2491 | MAD + gamma | 0.8294 | 0.742 | 0.378 |
