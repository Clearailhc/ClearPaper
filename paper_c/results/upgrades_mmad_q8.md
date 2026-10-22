# PRISM upgrades (test n=5806, val n=2491, eta=5.0, K=2)

| variant | acc (argmax) | risk_cost | critical_miss | false_alarm | AUROC (binary) |
|---|---|---|---|---|---|
| base noisy-OR | 0.730 | 0.379 | 0.004 | 0.934 | 0.8062 |
| +MAD | 0.720 | 0.388 | 0.002 | 0.975 | 0.7972 |
| +MAD+gamma | 0.742 | 0.378 | 0.016 | 0.839 | 0.8294 |
| +MAD+groups | 0.721 | 0.388 | 0.002 | 0.975 | 0.7983 |
| full (MAD+gamma+groups) | 0.746 | 0.378 | 0.015 | 0.849 | 0.8298 |

## Paired bootstrap against base noisy-OR

| variant | metric | diff | 95% CI | p |
|---|---|---|---|---|
| full (MAD+gamma+groups) | acc | +0.0155 | [+0.0079, +0.0241] | 0.000 |
| full (MAD+gamma+groups) | risk_cost | -0.0005 | [-0.0131, +0.0131] | 0.962 |
| full (MAD+gamma+groups) | false_alarm | -0.0847 | [-0.0970, -0.0730] | 0.000 |
| full (MAD+gamma+groups) | critical_miss | +0.0108 | [+0.0072, +0.0147] | 0.000 |
| full (MAD+gamma+groups) | AUROC | +0.0236 | [+0.0180, +0.0294] | 0.000 |

+MAD: {'groups': [], 'gamma': 1.0, 'alpha': []}

+MAD+gamma: {'groups': [], 'gamma': 4.688, 'alpha': []}

+MAD+groups: {'groups': [['MVTec-LOCO/screw_bag/shape_and_structure', 'MVTec-LOCO/screw_bag/color_contrast', 'MVTec-LOCO/screw_bag/texture_difference', 'MVTec-LOCO/screw_bag/additional_or_missing_components', 'MVTec-LOCO/screw_bag/packaging_issues', 'MVTec-LOCO/screw_bag/missing_components', 'MVTec-LOCO/screw_bag/excess_components', 'MVTec-LOCO/screw_bag/size_discrepancies'], ['MVTec-LOCO/juice_bottle/label_anomalies', 'MVTec-LOCO/juice_bottle/label_misalignment', 'MVTec-LOCO/juice_bottle/fill_level_deviations', 'MVTec-LOCO/juice_bottle/label_content_mismatch'], ['MVTec-LOCO/splicing_connectors/orientation_issues', 'MVTec-LOCO/splicing_connectors/physical_deformations', 'MVTec-LOCO/splicing_connectors/misalignment_or_incomplete_connections', 'MVTec-LOCO/splicing_connectors/cable_anomaly'], ['VisA/candle/color_contrast', 'VisA/candle/shape_and_texture_irregularities', 'VisA/candle/physical_damage', 'VisA/candle/foreign_particles'], ['GoodsAD/food_box/shape', 'GoodsAD/food_box/color_contrast', 'GoodsAD/food_box/texture_difference', 'GoodsAD/food_box/location', 'GoodsAD/food_box/shape_distortion', 'GoodsAD/food_box/texture_changes', 'GoodsAD/food_box/color_variances', 'GoodsAD/food_box/location_patterns', 'GoodsAD/food_box/opened_or_tampered_packaging'], ['GoodsAD/food_bottle/surface_damage', 'GoodsAD/food_bottle/deformation', 'GoodsAD/food_bottle/compromised_seal_opened_packaging'], ['GoodsAD/food_package/surface_anomaly_in_packaging', 'GoodsAD/food_package/packaging_compromise'], ['GoodsAD/drink_bottle/open_cap', 'GoodsAD/drink_bottle/cap_seal_defect'], ['GoodsAD/drink_can/surface_damage', 'GoodsAD/drink_can/carton_deformation']], 'gamma': 1.0, 'alpha': []}

full (MAD+gamma+groups): {'groups': [['MVTec-LOCO/screw_bag/shape_and_structure', 'MVTec-LOCO/screw_bag/color_contrast', 'MVTec-LOCO/screw_bag/texture_difference', 'MVTec-LOCO/screw_bag/additional_or_missing_components', 'MVTec-LOCO/screw_bag/packaging_issues', 'MVTec-LOCO/screw_bag/missing_components', 'MVTec-LOCO/screw_bag/excess_components', 'MVTec-LOCO/screw_bag/size_discrepancies'], ['MVTec-LOCO/juice_bottle/label_anomalies', 'MVTec-LOCO/juice_bottle/label_misalignment', 'MVTec-LOCO/juice_bottle/fill_level_deviations', 'MVTec-LOCO/juice_bottle/label_content_mismatch'], ['MVTec-LOCO/splicing_connectors/orientation_issues', 'MVTec-LOCO/splicing_connectors/physical_deformations', 'MVTec-LOCO/splicing_connectors/misalignment_or_incomplete_connections', 'MVTec-LOCO/splicing_connectors/cable_anomaly'], ['VisA/candle/color_contrast', 'VisA/candle/shape_and_texture_irregularities', 'VisA/candle/physical_damage', 'VisA/candle/foreign_particles'], ['GoodsAD/food_box/shape', 'GoodsAD/food_box/color_contrast', 'GoodsAD/food_box/texture_difference', 'GoodsAD/food_box/location', 'GoodsAD/food_box/shape_distortion', 'GoodsAD/food_box/texture_changes', 'GoodsAD/food_box/color_variances', 'GoodsAD/food_box/location_patterns', 'GoodsAD/food_box/opened_or_tampered_packaging'], ['GoodsAD/food_bottle/surface_damage', 'GoodsAD/food_bottle/deformation', 'GoodsAD/food_bottle/compromised_seal_opened_packaging'], ['GoodsAD/food_package/surface_anomaly_in_packaging', 'GoodsAD/food_package/packaging_compromise'], ['GoodsAD/drink_bottle/open_cap', 'GoodsAD/drink_bottle/cap_seal_defect'], ['GoodsAD/drink_can/surface_damage', 'GoodsAD/drink_can/carton_deformation']], 'gamma': 4.12, 'alpha': []}
