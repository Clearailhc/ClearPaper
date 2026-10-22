# PRISM upgrades (test n=5806, val n=2491, eta=5.0, K=2)

| variant | acc (argmax) | risk_cost | critical_miss | false_alarm | AUROC (binary) |
|---|---|---|---|---|---|
| base noisy-OR | 0.751 | 0.374 | 0.010 | 0.872 | 0.8313 |
| +MAD | 0.731 | 0.386 | 0.003 | 0.962 | 0.8139 |
| +MAD+gamma | 0.762 | 0.368 | 0.014 | 0.828 | 0.8437 |
| +MAD+groups | 0.736 | 0.386 | 0.003 | 0.962 | 0.8158 |
| full (MAD+gamma+groups) | 0.761 | 0.372 | 0.016 | 0.825 | 0.8447 |

## Paired bootstrap against base noisy-OR

| variant | metric | diff | 95% CI | p |
|---|---|---|---|---|
| full (MAD+gamma+groups) | acc | +0.0096 | [+0.0029, +0.0164] | 0.004 |
| full (MAD+gamma+groups) | risk_cost | -0.0021 | [-0.0145, +0.0107] | 0.720 |
| full (MAD+gamma+groups) | false_alarm | -0.0470 | [-0.0588, -0.0364] | 0.000 |
| full (MAD+gamma+groups) | critical_miss | +0.0054 | [+0.0014, +0.0095] | 0.010 |
| full (MAD+gamma+groups) | AUROC | +0.0133 | [+0.0093, +0.0176] | 0.000 |

+MAD: {'groups': [], 'gamma': 1.0, 'alpha': []}

+MAD+gamma: {'groups': [], 'gamma': 4.898, 'alpha': []}

+MAD+groups: {'groups': [['MVTec-LOCO/pushpins/structural_anomaly', 'MVTec-LOCO/pushpins/logical_anomaly_missing_or_additional_pu'], ['MVTec-LOCO/breakfast_box/fruit_damage_and_contamination', 'MVTec-LOCO/breakfast_box/logical_anomalies'], ['MVTec-LOCO/screw_bag/shape_and_structure', 'MVTec-LOCO/screw_bag/color_contrast', 'MVTec-LOCO/screw_bag/texture_difference', 'MVTec-LOCO/screw_bag/additional_or_missing_components', 'MVTec-LOCO/screw_bag/packaging_issues', 'MVTec-LOCO/screw_bag/missing_components', 'MVTec-LOCO/screw_bag/excess_components', 'MVTec-LOCO/screw_bag/size_discrepancies'], ['MVTec-LOCO/juice_bottle/label_anomalies', 'MVTec-LOCO/juice_bottle/label_misalignment', 'MVTec-LOCO/juice_bottle/missing_labels', 'MVTec-LOCO/juice_bottle/fill_level_deviations', 'MVTec-LOCO/juice_bottle/label_content_mismatch'], ['MVTec-LOCO/splicing_connectors/orientation_issues', 'MVTec-LOCO/splicing_connectors/physical_deformations', 'MVTec-LOCO/splicing_connectors/misalignment_or_incomplete_connections', 'MVTec-LOCO/splicing_connectors/color_anomalies'], ['VisA/candle/color_contrast', 'VisA/candle/shape_and_texture_irregularities', 'VisA/candle/physical_damage', 'VisA/candle/foreign_particles'], ['GoodsAD/food_box/shape', 'GoodsAD/food_box/color_contrast', 'GoodsAD/food_box/texture_difference', 'GoodsAD/food_box/location', 'GoodsAD/food_box/shape_distortion', 'GoodsAD/food_box/texture_changes', 'GoodsAD/food_box/color_variances', 'GoodsAD/food_box/location_patterns', 'GoodsAD/food_box/opened_or_tampered_packaging'], ['GoodsAD/food_bottle/surface_damage', 'GoodsAD/food_bottle/deformation', 'GoodsAD/food_bottle/compromised_seal_opened_packaging'], ['GoodsAD/food_package/surface_anomaly_in_packaging', 'GoodsAD/food_package/packaging_compromise'], ['GoodsAD/drink_bottle/open_cap', 'GoodsAD/drink_bottle/cap_seal_defect'], ['GoodsAD/drink_can/surface_damage', 'GoodsAD/drink_can/carton_deformation']], 'gamma': 1.0, 'alpha': []}

full (MAD+gamma+groups): {'groups': [['MVTec-LOCO/pushpins/structural_anomaly', 'MVTec-LOCO/pushpins/logical_anomaly_missing_or_additional_pu'], ['MVTec-LOCO/breakfast_box/fruit_damage_and_contamination', 'MVTec-LOCO/breakfast_box/logical_anomalies'], ['MVTec-LOCO/screw_bag/shape_and_structure', 'MVTec-LOCO/screw_bag/color_contrast', 'MVTec-LOCO/screw_bag/texture_difference', 'MVTec-LOCO/screw_bag/additional_or_missing_components', 'MVTec-LOCO/screw_bag/packaging_issues', 'MVTec-LOCO/screw_bag/missing_components', 'MVTec-LOCO/screw_bag/excess_components', 'MVTec-LOCO/screw_bag/size_discrepancies'], ['MVTec-LOCO/juice_bottle/label_anomalies', 'MVTec-LOCO/juice_bottle/label_misalignment', 'MVTec-LOCO/juice_bottle/missing_labels', 'MVTec-LOCO/juice_bottle/fill_level_deviations', 'MVTec-LOCO/juice_bottle/label_content_mismatch'], ['MVTec-LOCO/splicing_connectors/orientation_issues', 'MVTec-LOCO/splicing_connectors/physical_deformations', 'MVTec-LOCO/splicing_connectors/misalignment_or_incomplete_connections', 'MVTec-LOCO/splicing_connectors/color_anomalies'], ['VisA/candle/color_contrast', 'VisA/candle/shape_and_texture_irregularities', 'VisA/candle/physical_damage', 'VisA/candle/foreign_particles'], ['GoodsAD/food_box/shape', 'GoodsAD/food_box/color_contrast', 'GoodsAD/food_box/texture_difference', 'GoodsAD/food_box/location', 'GoodsAD/food_box/shape_distortion', 'GoodsAD/food_box/texture_changes', 'GoodsAD/food_box/color_variances', 'GoodsAD/food_box/location_patterns', 'GoodsAD/food_box/opened_or_tampered_packaging'], ['GoodsAD/food_bottle/surface_damage', 'GoodsAD/food_bottle/deformation', 'GoodsAD/food_bottle/compromised_seal_opened_packaging'], ['GoodsAD/food_package/surface_anomaly_in_packaging', 'GoodsAD/food_package/packaging_compromise'], ['GoodsAD/drink_bottle/open_cap', 'GoodsAD/drink_bottle/cap_seal_defect'], ['GoodsAD/drink_can/surface_damage', 'GoodsAD/drink_can/carton_deformation']], 'gamma': 4.745, 'alpha': []}
