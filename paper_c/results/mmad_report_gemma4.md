# Paper C evaluation (test n=5806, val n=2491, eta=5.0)

| system | acc | macro_f1 | qwk | risk_cost | critical_miss | false_alarm | anomaly_recall | ece | cs_rps | acc 95% CI | risk 95% CI |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 direct (argmax) | 0.451 | 0.384 | 0.075 | 2.738 | 0.900 | 0.006 | 0.100 | 0.490 | 2.460 | [0.438, 0.463] | [2.674, 2.801] |
| S1 direct (cost-aware) | 0.500 | 0.464 | 0.136 | 2.450 | 0.802 | 0.032 | 0.198 | 0.490 | 2.460 | [0.488, 0.513] | [2.383, 2.512] |
| S1 direct, val-calibrated (argmax) | 0.629 | 0.566 | 0.159 | 0.777 | 0.167 | 0.685 | 0.833 | 0.016 | 0.579 | [0.617, 0.642] | [0.739, 0.813] |
| S1 direct, val-calibrated (cost-aware) | 0.607 | 0.378 | 0.000 | 0.393 | 0.000 | 1.000 | 1.000 | 0.016 | 0.579 | [0.595, 0.619] | [0.381, 0.405] |
| S1 fan-out, raw noisy-OR | 0.563 | 0.561 | 0.185 | 1.865 | 0.587 | 0.204 | 0.413 | 0.385 | 1.908 | [0.549, 0.575] | [1.806, 1.932] |
| S1 fan-out, calibrated (argmax) | 0.669 | 0.629 | 0.269 | 0.771 | 0.181 | 0.563 | 0.819 | 0.028 | 0.559 | [0.657, 0.681] | [0.730, 0.810] |
| S1 fan-out, calibrated (cost-aware) | 0.612 | 0.390 | 0.013 | 0.389 | 0.000 | 0.989 | 1.000 | 0.028 | 0.559 | [0.599, 0.623] | [0.377, 0.402] |

## Paired bootstrap: fan-out (calibrated) minus direct (val-calibrated)

| metric | diff | 95% CI | p |
|---|---|---|---|
| accuracy (argmax) | +0.039 | [+0.027, +0.053] | 0.000 |
| risk_cost (cost-aware) | -0.003 | [-0.006, -0.001] | 0.013 |
| critical_miss (cost-aware) | +0.000 | [+0.000, +0.001] | 0.710 |
| false_alarm (cost-aware) | -0.011 | [-0.015, -0.007] | 0.000 |

## Branch diagnostics (test, vs description weak labels)

weak labels + industry table reproduce the true level on 39.3% of scenes

| primitive | labelled | positives | AUROC |
|---|---|---|---|
| MVTec/zipper/fabric_texture_disruption | 22 | 0 | nan |
| MVTec/zipper/broken_teeth | 22 | 0 | nan |
| MVTec/zipper/split_teeth | 22 | 0 | nan |
| MVTec/zipper/squeezed_teeth | 22 | 0 | nan |
| MVTec/zipper/zipper_teeth_damage | 22 | 0 | nan |
| MVTec/zipper/fabric_border_fraying | 22 | 0 | nan |
| MVTec/cable/cable_swap_and_missing_wire | 41 | 0 | nan |
| MVTec/cable/inner_insulation_cut | 41 | 0 | nan |
| MVTec/cable/missing_wire | 41 | 0 | nan |
| MVTec/cable/shape | 41 | 0 | nan |
| MVTec/cable/surface_integrity | 41 | 0 | nan |
| MVTec/cable/location | 41 | 0 | nan |
| MVTec/cable/structural_integrity | 41 | 0 | nan |
| MVTec/cable/missing_cable | 41 | 0 | nan |
| MVTec/cable/wire_misalignment_and_deformation | 41 | 0 | nan |
| MVTec/cable/color_contrast | 41 | 0 | nan |
| MVTec/cable/texture_difference | 41 | 0 | nan |
| MVTec/cable/additional_indicators | 41 | 0 | nan |
| MVTec/toothbrush/missing_bristles | 8 | 0 | nan |
| MVTec/toothbrush/misaligned_or_disordered_bristles | 8 | 0 | nan |
| MVTec/toothbrush/contamination | 8 | 0 | nan |
| MVTec/grid/broken_grid | 13 | 0 | nan |
| MVTec/grid/threading_anomaly | 13 | 0 | nan |
| MVTec/grid/metal_contamination | 13 | 0 | nan |
| MVTec/grid/bent_grid_anomaly | 13 | 0 | nan |
| MVTec/grid/foreign_material_anomaly | 13 | 0 | nan |
| MVTec/transistor/cut_lead | 42 | 0 | nan |
| MVTec/transistor/bent_lead | 42 | 0 | nan |
| MVTec/transistor/damaged_case | 42 | 0 | nan |
| MVTec/transistor/transistor_misalignment | 42 | 0 | nan |
| MVTec/pill/contamination_and_structural_defects | 18 | 0 | nan |
| MVTec/pill/surface_scratch_or_abrasion | 18 | 0 | nan |
| MVTec/pill/faulty_imprint | 18 | 0 | nan |
| MVTec/pill/crack_and_contamination | 18 | 0 | nan |
| MVTec/pill/color_anomalies_in_pills | 18 | 0 | nan |
| MVTec/metal_nut/scratch_defect | 15 | 0 | nan |
| MVTec/metal_nut/metal_nut_deformation_and_surface_defect | 15 | 0 | nan |
| MVTec/metal_nut/color_anomalies | 15 | 0 | nan |
| MVTec/metal_nut/texture_disruption | 15 | 0 | nan |
| MVTec/tile/gray_stroke_defect | 23 | 0 | nan |
| MVTec/tile/glue_strip_defect | 23 | 0 | nan |
| MVTec/tile/color_stain_or_contamination | 23 | 0 | nan |
| MVTec/tile/crack_in_tile | 23 | 0 | nan |
| MVTec/tile/surface_texture_anomaly | 23 | 0 | nan |
| MVTec/capsule/poke_or_indentation_defect | 16 | 0 | nan |
| MVTec/capsule/scratch_defect | 16 | 0 | nan |
| MVTec/capsule/capsule_deformation_squeeze | 16 | 0 | nan |
| MVTec/capsule/faulty_imprint | 16 | 0 | nan |
| MVTec/capsule/crack_on_capsule | 16 | 0 | nan |
| MVTec/hazelnut/print_defect_on_hazelnut_shell | 28 | 0 | nan |
| MVTec/hazelnut/hazelnut_shell_hole | 28 | 0 | nan |
| MVTec/hazelnut/hazelnut_shell_crack | 28 | 0 | nan |
| MVTec/hazelnut/hazelnut_shell_cuts | 28 | 0 | nan |
| MVTec/screw/thread_top_defect | 29 | 0 | nan |
| MVTec/screw/surface_scratch | 29 | 0 | nan |
| MVTec/screw/scratch_on_screw_neck | 29 | 0 | nan |
| MVTec/screw/thread_deformation | 29 | 0 | nan |
| MVTec/screw/tip_deformation | 29 | 0 | nan |
| MVTec/carpet/thread_anomaly | 20 | 0 | nan |
| MVTec/carpet/metal_contamination | 20 | 0 | nan |
| MVTec/carpet/fabric_hole | 20 | 0 | nan |
| MVTec/carpet/color_inconsistency | 20 | 0 | nan |
| MVTec/carpet/cut_in_fabric | 20 | 0 | nan |
| MVTec/leather/fold_defect | 22 | 0 | nan |
| MVTec/leather/puncture_defect | 22 | 0 | nan |
| MVTec/leather/adhesive_residue | 22 | 0 | nan |
| MVTec/leather/color_anomaly_in_leather | 22 | 0 | nan |
| MVTec/leather/leather_cut_defect | 22 | 0 | nan |
| MVTec/wood/wood_surface_scratches | 13 | 0 | nan |
| MVTec/wood/wood_surface_defects | 13 | 0 | nan |
| MVTec/wood/color_anomalies | 13 | 0 | nan |
| MVTec/wood/wood_liquid_stain | 13 | 0 | nan |
| MVTec/bottle/contamination | 14 | 0 | nan |
| MVTec/bottle/broken_large | 14 | 0 | nan |
| MVTec/bottle/small_breakage_or_chip | 14 | 0 | nan |
| MVTec-LOCO/pushpins/structural_anomaly | 97 | 0 | nan |
| MVTec-LOCO/pushpins/logical_anomaly_missing_or_additional_pu | 97 | 0 | nan |
| MVTec-LOCO/breakfast_box/fruit_damage_and_contamination | 71 | 0 | nan |
| MVTec-LOCO/breakfast_box/logical_anomalies | 71 | 0 | nan |
| MVTec-LOCO/screw_bag/shape_and_structure | 85 | 0 | nan |
| MVTec-LOCO/screw_bag/color_contrast | 85 | 0 | nan |
| MVTec-LOCO/screw_bag/texture_difference | 85 | 0 | nan |
| MVTec-LOCO/screw_bag/additional_or_missing_components | 85 | 0 | nan |
| MVTec-LOCO/screw_bag/packaging_issues | 85 | 0 | nan |
| MVTec-LOCO/screw_bag/missing_components | 85 | 0 | nan |
| MVTec-LOCO/screw_bag/excess_components | 85 | 0 | nan |
| MVTec-LOCO/screw_bag/size_discrepancies | 85 | 0 | nan |
| MVTec-LOCO/juice_bottle/label_anomalies | 67 | 0 | nan |
| MVTec-LOCO/juice_bottle/label_misalignment | 67 | 0 | nan |
| MVTec-LOCO/juice_bottle/missing_labels | 67 | 0 | nan |
| MVTec-LOCO/juice_bottle/fill_level_deviations | 67 | 0 | nan |
| MVTec-LOCO/juice_bottle/label_content_mismatch | 67 | 0 | nan |
| MVTec-LOCO/splicing_connectors/orientation_issues | 83 | 0 | nan |
| MVTec-LOCO/splicing_connectors/physical_deformations | 83 | 0 | nan |
| MVTec-LOCO/splicing_connectors/misalignment_or_incomplete_connections | 83 | 0 | nan |
| MVTec-LOCO/splicing_connectors/color_anomalies | 83 | 0 | nan |
| MVTec-LOCO/splicing_connectors/cable_anomaly | 83 | 0 | nan |
| VisA/macaroni1/color_spot_defects_and_physical_anomalie | 70 | 0 | nan |
| VisA/cashew/defects_in_cashew_nuts | 35 | 0 | nan |
| VisA/candle/color_contrast | 70 | 0 | nan |
| VisA/candle/shape_and_texture_irregularities | 70 | 0 | nan |
| VisA/candle/physical_damage | 70 | 0 | nan |
| VisA/candle/foreign_particles | 70 | 0 | nan |
| VisA/pipe_fryum/stuck_or_fused_fryums | 27 | 0 | nan |
| VisA/macaroni2/macaroni_defects | 70 | 0 | nan |
| VisA/pcb3/melt_or_heat_damage | 69 | 0 | nan |
| VisA/fryum/fryum_defects | 36 | 0 | nan |
| VisA/pcb2/melt_and_deformation | 69 | 0 | nan |
| VisA/capsules/capsule_anomalies | 42 | 0 | nan |
| VisA/pcb1/melt_and_deformation_anomaly | 69 | 0 | nan |
| VisA/chewinggum/material_missing_and_surface_damage | 35 | 0 | nan |
| VisA/pcb4/burnt_area | 71 | 0 | nan |
| GoodsAD/food_box/shape | 101 | 0 | nan |
| GoodsAD/food_box/color_contrast | 101 | 0 | nan |
| GoodsAD/food_box/texture_difference | 101 | 0 | nan |
| GoodsAD/food_box/location | 101 | 0 | nan |
| GoodsAD/food_box/shape_distortion | 101 | 0 | nan |
| GoodsAD/food_box/texture_changes | 101 | 0 | nan |
| GoodsAD/food_box/color_variances | 101 | 0 | nan |
| GoodsAD/food_box/location_patterns | 101 | 0 | nan |
| GoodsAD/food_box/opened_or_tampered_packaging | 101 | 0 | nan |
| GoodsAD/cigarette_box/packaging_tampering | 128 | 0 | nan |
| GoodsAD/food_bottle/surface_damage | 161 | 0 | nan |
| GoodsAD/food_bottle/deformation | 161 | 0 | nan |
| GoodsAD/food_bottle/compromised_seal_opened_packaging | 161 | 0 | nan |
| GoodsAD/food_package/surface_anomaly_in_packaging | 177 | 0 | nan |
| GoodsAD/food_package/packaging_compromise | 177 | 0 | nan |
| GoodsAD/drink_bottle/surface_damage | 241 | 0 | nan |
| GoodsAD/drink_bottle/open_cap | 241 | 0 | nan |
| GoodsAD/drink_bottle/cap_seal_defect | 241 | 0 | nan |
| GoodsAD/drink_can/missing_straw | 81 | 0 | nan |
| GoodsAD/drink_can/surface_damage | 81 | 0 | nan |
| GoodsAD/drink_can/carton_deformation | 81 | 0 | nan |
