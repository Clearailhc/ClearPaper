# PRISM upgrades (test n=1250, val n=573, eta=5.0, K=4)

| variant | acc (argmax) | risk_cost | critical_miss | false_alarm | AUROC (binary) |
|---|---|---|---|---|---|
| base noisy-OR | 0.906 | 0.426 | 0.029 | 0.193 | 0.9698 |
| +MAD | 0.920 | 1.796 | 0.000 | 1.000 | 0.9737 |
| +MAD+gamma | 0.929 | 0.380 | 0.033 | 0.127 | 0.9821 |
| +MAD+groups | 0.920 | 1.747 | 0.000 | 0.945 | 0.9741 |
| full (MAD+gamma+groups) | 0.933 | 0.380 | 0.037 | 0.121 | 0.9813 |

## Paired bootstrap against base noisy-OR

| variant | metric | diff | 95% CI | p |
|---|---|---|---|---|
| full (MAD+gamma+groups) | acc | +0.0272 | [+0.0120, +0.0416] | 0.000 |
| full (MAD+gamma+groups) | risk_cost | -0.0464 | [-0.1056, +0.0144] | 0.130 |
| full (MAD+gamma+groups) | false_alarm | -0.0721 | [-0.0920, -0.0536] | 0.000 |
| full (MAD+gamma+groups) | critical_miss | +0.0082 | [-0.0075, +0.0241] | 0.464 |
| full (MAD+gamma+groups) | AUROC | +0.0115 | [+0.0057, +0.0180] | 0.000 |

+MAD: {'groups': [], 'gamma': 1.0, 'alpha': []}

+MAD+gamma: {'groups': [], 'gamma': 6.802, 'alpha': []}

+MAD+groups: {'groups': [['open_flame', 'smoke', 'personnel_collapse', 'smoking', 'oil_leakage', 'no_hard_hat', 'no_gloves', 'no_mask', 'mobile_phone', 'water_pooling', 'oil_accumulation', 'foreign_object_light', 'foreign_object_hard', 'nonmotor_vehicle']], 'gamma': 1.0, 'alpha': []}

full (MAD+gamma+groups): {'groups': [['open_flame', 'smoke', 'personnel_collapse', 'smoking', 'oil_leakage', 'no_hard_hat', 'no_gloves', 'no_mask', 'mobile_phone', 'water_pooling', 'oil_accumulation', 'foreign_object_light', 'foreign_object_hard', 'nonmotor_vehicle']], 'gamma': 5.795, 'alpha': []}
