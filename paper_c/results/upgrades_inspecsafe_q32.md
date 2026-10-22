# PRISM upgrades (test n=1250, val n=573, eta=5.0, K=4)

| variant | acc (argmax) | risk_cost | critical_miss | false_alarm | AUROC (binary) |
|---|---|---|---|---|---|
| base noisy-OR | 0.889 | 0.451 | 0.025 | 0.202 | 0.9728 |
| +MAD | 0.904 | 1.783 | 0.000 | 1.000 | 0.9688 |
| +MAD+gamma | 0.915 | 0.352 | 0.033 | 0.105 | 0.9823 |
| +MAD+groups | 0.913 | 1.706 | 0.000 | 0.967 | 0.9774 |
| full (MAD+gamma+groups) | 0.914 | 0.350 | 0.045 | 0.093 | 0.9827 |

## Paired bootstrap against base noisy-OR

| variant | metric | diff | 95% CI | p |
|---|---|---|---|---|
| full (MAD+gamma+groups) | acc | +0.0256 | [+0.0080, +0.0432] | 0.002 |
| full (MAD+gamma+groups) | risk_cost | -0.1016 | [-0.1720, -0.0304] | 0.002 |
| full (MAD+gamma+groups) | false_alarm | -0.1091 | [-0.1312, -0.0883] | 0.000 |
| full (MAD+gamma+groups) | critical_miss | +0.0205 | [+0.0000, +0.0412] | 0.076 |
| full (MAD+gamma+groups) | AUROC | +0.0100 | [+0.0033, +0.0177] | 0.002 |

+MAD: {'groups': [], 'gamma': 1.0, 'alpha': []}

+MAD+gamma: {'groups': [], 'gamma': 6.665, 'alpha': []}

+MAD+groups: {'groups': [['open_flame', 'smoke', 'personnel_collapse', 'smoking', 'oil_leakage', 'no_hard_hat', 'no_gloves', 'no_mask', 'mobile_phone', 'water_pooling', 'oil_accumulation', 'foreign_object_light', 'foreign_object_hard', 'cabinet_door_open', 'nonmotor_vehicle']], 'gamma': 1.0, 'alpha': []}

full (MAD+gamma+groups): {'groups': [['open_flame', 'smoke', 'personnel_collapse', 'smoking', 'oil_leakage', 'no_hard_hat', 'no_gloves', 'no_mask', 'mobile_phone', 'water_pooling', 'oil_accumulation', 'foreign_object_light', 'foreign_object_hard', 'cabinet_door_open', 'nonmotor_vehicle']], 'gamma': 5.519, 'alpha': []}
