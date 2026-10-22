# PRISM upgrades (test n=1250, val n=573, eta=5.0, K=4)

| variant | acc (argmax) | risk_cost | critical_miss | false_alarm | AUROC (binary) |
|---|---|---|---|---|---|
| base noisy-OR | 0.831 | 0.782 | 0.033 | 0.401 | 0.9450 |
| +MAD | 0.888 | 1.850 | 0.000 | 1.000 | 0.9525 |
| +MAD+gamma | 0.888 | 0.582 | 0.057 | 0.191 | 0.9633 |
| +MAD+groups | 0.903 | 1.870 | 0.004 | 0.973 | 0.9578 |
| full (MAD+gamma+groups) | 0.906 | 0.618 | 0.074 | 0.199 | 0.9606 |

## Paired bootstrap against base noisy-OR

| variant | metric | diff | 95% CI | p |
|---|---|---|---|---|
| full (MAD+gamma+groups) | acc | +0.0744 | [+0.0536, +0.0944] | 0.000 |
| full (MAD+gamma+groups) | risk_cost | -0.1632 | [-0.2376, -0.0840] | 0.000 |
| full (MAD+gamma+groups) | false_alarm | -0.2022 | [-0.2276, -0.1749] | 0.000 |
| full (MAD+gamma+groups) | critical_miss | +0.0410 | [+0.0170, +0.0670] | 0.000 |
| full (MAD+gamma+groups) | AUROC | +0.0155 | [+0.0087, +0.0227] | 0.000 |

+MAD: {'groups': [], 'gamma': 1.0, 'alpha': []}

+MAD+gamma: {'groups': [], 'gamma': 6.807, 'alpha': []}

+MAD+groups: {'groups': [['open_flame', 'smoke', 'personnel_collapse', 'smoking', 'oil_leakage', 'no_hard_hat', 'no_gloves', 'no_mask', 'mobile_phone', 'water_pooling', 'oil_accumulation', 'foreign_object_light', 'foreign_object_hard', 'nonmotor_vehicle']], 'gamma': 1.0, 'alpha': []}

full (MAD+gamma+groups): {'groups': [['open_flame', 'smoke', 'personnel_collapse', 'smoking', 'oil_leakage', 'no_hard_hat', 'no_gloves', 'no_mask', 'mobile_phone', 'water_pooling', 'oil_accumulation', 'foreign_object_light', 'foreign_object_hard', 'nonmotor_vehicle']], 'gamma': 5.922, 'alpha': []}
