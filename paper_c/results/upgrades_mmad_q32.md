# PRISM upgrades (test n=5806, val n=2491, eta=5.0, K=2)

| variant | acc (argmax) | risk_cost | critical_miss | false_alarm | AUROC (binary) |
|---|---|---|---|---|---|
| base noisy-OR | 0.751 | 0.371 | 0.014 | 0.833 | 0.8281 |
| +MAD | 0.735 | 0.398 | 0.007 | 0.961 | 0.8104 |
| +MAD+gamma | 0.755 | 0.396 | 0.028 | 0.795 | 0.8364 |
| +MAD+groups | 0.736 | 0.396 | 0.007 | 0.958 | 0.8112 |
| full (MAD+gamma+groups) | 0.757 | 0.389 | 0.026 | 0.787 | 0.8407 |

## Paired bootstrap against base noisy-OR

| variant | metric | diff | 95% CI | p |
|---|---|---|---|---|
| full (MAD+gamma+groups) | acc | +0.0059 | [-0.0021, +0.0136] | 0.148 |
| full (MAD+gamma+groups) | risk_cost | +0.0179 | [+0.0024, +0.0338] | 0.024 |
| full (MAD+gamma+groups) | false_alarm | -0.0465 | [-0.0625, -0.0323] | 0.000 |
| full (MAD+gamma+groups) | critical_miss | +0.0119 | [+0.0073, +0.0166] | 0.000 |
| full (MAD+gamma+groups) | AUROC | +0.0126 | [+0.0070, +0.0187] | 0.000 |

+MAD: {'groups': [], 'gamma': 1.0, 'alpha': []}

+MAD+gamma: {'groups': [], 'gamma': 5.427, 'alpha': []}

+MAD+groups: {'groups': [['MVTec-LOCO/pushpins/structural_anomaly', 'MVTec-LOCO/pushpins/logical_anomaly_missing_or_additional_pu'], ['MVTec-LOCO/breakfast_box/fruit_damage_and_contamination', 'MVTec-LOCO/breakfast_box/logical_anomalies'], ['MVTec-LOCO/screw_bag/shape_and_structure', 'MVTec-LOCO/screw_bag/color_contrast', 'MVTec-LOCO/screw_bag/texture_difference', 'MVTec-LOCO/screw_bag/additional_or_missing_components', 'MVTec-LOCO/screw_bag/packaging_issues', 'MVTec-LOCO/screw_bag/missing_components', 'MVTec-LOCO/screw_bag/excess_components', 'MVTec-LOCO/screw_bag/size_discrepancies'], ['MVTec-LOCO/juice_bottle/label_anomalies', 'MVTec-LOCO/juice_bottle/label_misalignment', 'MVTec-LOCO/juice_bottle/missing_labels', 'MVTec-LOCO/juice_bottle/fill_level_deviations', 'MVTec-LOCO/juice_bottle/label_content_mismatch'], ['MVTec-LOCO/splicing_connectors/orientation_issues', 'MVTec-LOCO/splicing_connectors/physical_deformations', 'MVTec-LOCO/splicing_connectors/misalignment_or_incomplete_connections', 'MVTec-LOCO/splicing_connectors/color_anomalies', 'MVTec-LOCO/splicing_connectors/cable_anomaly'], ['VisA/candle/color_contrast', 'VisA/candle/shape_and_texture_irregularities', 'VisA/candle/physical_damage', 'VisA/candle/foreign_particles'], ['GoodsAD/food_box/shape', 'GoodsAD/food_box/color_contrast', 'GoodsAD/food_box/texture_difference', 'GoodsAD/food_box/location', 'GoodsAD/food_box/shape_distortion', 'GoodsAD/food_box/texture_changes', 'GoodsAD/food_box/color_variances', 'GoodsAD/food_box/location_patterns', 'GoodsAD/food_box/opened_or_tampered_packaging'], ['GoodsAD/food_bottle/surface_damage', 'GoodsAD/food_bottle/deformation', 'GoodsAD/food_bottle/compromised_seal_opened_packaging'], ['GoodsAD/food_package/surface_anomaly_in_packaging', 'GoodsAD/food_package/packaging_compromise'], ['GoodsAD/drink_bottle/surface_damage', 'GoodsAD/drink_bottle/open_cap', 'GoodsAD/drink_bottle/cap_seal_defect'], ['GoodsAD/drink_can/surface_damage', 'GoodsAD/drink_can/carton_deformation']], 'gamma': 1.0, 'alpha': []}

full (MAD+gamma+groups): {'groups': [['MVTec-LOCO/pushpins/structural_anomaly', 'MVTec-LOCO/pushpins/logical_anomaly_missing_or_additional_pu'], ['MVTec-LOCO/breakfast_box/fruit_damage_and_contamination', 'MVTec-LOCO/breakfast_box/logical_anomalies'], ['MVTec-LOCO/screw_bag/shape_and_structure', 'MVTec-LOCO/screw_bag/color_contrast', 'MVTec-LOCO/screw_bag/texture_difference', 'MVTec-LOCO/screw_bag/additional_or_missing_components', 'MVTec-LOCO/screw_bag/packaging_issues', 'MVTec-LOCO/screw_bag/missing_components', 'MVTec-LOCO/screw_bag/excess_components', 'MVTec-LOCO/screw_bag/size_discrepancies'], ['MVTec-LOCO/juice_bottle/label_anomalies', 'MVTec-LOCO/juice_bottle/label_misalignment', 'MVTec-LOCO/juice_bottle/missing_labels', 'MVTec-LOCO/juice_bottle/fill_level_deviations', 'MVTec-LOCO/juice_bottle/label_content_mismatch'], ['MVTec-LOCO/splicing_connectors/orientation_issues', 'MVTec-LOCO/splicing_connectors/physical_deformations', 'MVTec-LOCO/splicing_connectors/misalignment_or_incomplete_connections', 'MVTec-LOCO/splicing_connectors/color_anomalies', 'MVTec-LOCO/splicing_connectors/cable_anomaly'], ['VisA/candle/color_contrast', 'VisA/candle/shape_and_texture_irregularities', 'VisA/candle/physical_damage', 'VisA/candle/foreign_particles'], ['GoodsAD/food_box/shape', 'GoodsAD/food_box/color_contrast', 'GoodsAD/food_box/texture_difference', 'GoodsAD/food_box/location', 'GoodsAD/food_box/shape_distortion', 'GoodsAD/food_box/texture_changes', 'GoodsAD/food_box/color_variances', 'GoodsAD/food_box/location_patterns', 'GoodsAD/food_box/opened_or_tampered_packaging'], ['GoodsAD/food_bottle/surface_damage', 'GoodsAD/food_bottle/deformation', 'GoodsAD/food_bottle/compromised_seal_opened_packaging'], ['GoodsAD/food_package/surface_anomaly_in_packaging', 'GoodsAD/food_package/packaging_compromise'], ['GoodsAD/drink_bottle/surface_damage', 'GoodsAD/drink_bottle/open_cap', 'GoodsAD/drink_bottle/cap_seal_defect'], ['GoodsAD/drink_can/surface_damage', 'GoodsAD/drink_can/carton_deformation']], 'gamma': 5.345, 'alpha': []}
