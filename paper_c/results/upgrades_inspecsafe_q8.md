# PRISM upgrades (test n=1250, val n=573, eta=5.0, K=4)

| variant | acc (argmax) | risk_cost | critical_miss | false_alarm | AUROC (binary) |
|---|---|---|---|---|---|
| base noisy-OR | 0.878 | 0.550 | 0.025 | 0.243 | 0.9665 |
| +MAD | 0.899 | 1.843 | 0.000 | 1.000 | 0.9728 |
| +MAD+gamma | 0.919 | 0.416 | 0.012 | 0.173 | 0.9834 |
| +MAD+groups | 0.914 | 1.941 | 0.000 | 0.988 | 0.9793 |
| full (MAD+gamma+groups) | 0.922 | 0.422 | 0.020 | 0.160 | 0.9848 |

## Paired bootstrap against base noisy-OR

| variant | metric | diff | 95% CI | p |
|---|---|---|---|---|
| full (MAD+gamma+groups) | acc | +0.0448 | [+0.0288, +0.0608] | 0.000 |
| full (MAD+gamma+groups) | risk_cost | -0.1280 | [-0.1968, -0.0624] | 0.002 |
| full (MAD+gamma+groups) | false_alarm | -0.0831 | [-0.1040, -0.0625] | 0.000 |
| full (MAD+gamma+groups) | critical_miss | -0.0041 | [-0.0226, +0.0128] | 0.794 |
| full (MAD+gamma+groups) | AUROC | +0.0184 | [+0.0122, +0.0250] | 0.000 |

+MAD: {'groups': [], 'gamma': 1.0, 'alpha': []}

+MAD+gamma: {'groups': [], 'gamma': 6.551, 'alpha': []}

+MAD+groups: {'groups': [['open_flame', 'smoke', 'personnel_collapse', 'smoking', 'oil_leakage', 'no_hard_hat', 'no_gloves', 'no_mask', 'mobile_phone', 'water_pooling', 'oil_accumulation', 'foreign_object_light', 'foreign_object_hard', 'cabinet_door_open', 'nonmotor_vehicle']], 'gamma': 1.0, 'alpha': []}

full (MAD+gamma+groups): {'groups': [['open_flame', 'smoke', 'personnel_collapse', 'smoking', 'oil_leakage', 'no_hard_hat', 'no_gloves', 'no_mask', 'mobile_phone', 'water_pooling', 'oil_accumulation', 'foreign_object_light', 'foreign_object_hard', 'cabinet_door_open', 'nonmotor_vehicle']], 'gamma': 5.825, 'alpha': []}
