# Paper C evaluation (test n=5806, val n=2491, eta=5.0)

| system | acc | macro_f1 | qwk | risk_cost | critical_miss | false_alarm | anomaly_recall | ece | cs_rps | acc 95% CI | risk 95% CI |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 direct (argmax) | 0.695 | 0.685 | 0.370 | 0.992 | 0.283 | 0.341 | 0.717 | 0.196 | 0.791 | [0.682, 0.707] | [0.945, 1.043] |
| S1 direct (cost-aware) | 0.694 | 0.661 | 0.328 | 0.725 | 0.172 | 0.514 | 0.828 | 0.196 | 0.791 | [0.682, 0.705] | [0.690, 0.766] |
| S1 direct, val-calibrated (argmax) | 0.694 | 0.670 | 0.342 | 0.813 | 0.209 | 0.458 | 0.791 | 0.033 | 0.535 | [0.682, 0.705] | [0.775, 0.859] |
| S1 direct, val-calibrated (cost-aware) | 0.624 | 0.432 | 0.056 | 0.394 | 0.008 | 0.946 | 0.992 | 0.033 | 0.535 | [0.611, 0.636] | [0.380, 0.409] |
| S1 fan-out, raw noisy-OR | 0.643 | 0.643 | 0.306 | 1.412 | 0.434 | 0.236 | 0.566 | 0.308 | 1.470 | [0.632, 0.655] | [1.360, 1.470] |
| S1 fan-out, calibrated (argmax) | 0.730 | 0.715 | 0.430 | 0.772 | 0.207 | 0.367 | 0.793 | 0.021 | 0.512 | [0.719, 0.742] | [0.732, 0.813] |
| S1 fan-out, calibrated (cost-aware) | 0.631 | 0.445 | 0.075 | 0.379 | 0.004 | 0.934 | 0.996 | 0.021 | 0.512 | [0.619, 0.643] | [0.365, 0.393] |

## Paired bootstrap: fan-out (calibrated) minus direct (val-calibrated)

| metric | diff | 95% CI | p |
|---|---|---|---|
| accuracy (argmax) | +0.037 | [+0.024, +0.050] | 0.000 |
| risk_cost (cost-aware) | -0.016 | [-0.027, -0.005] | 0.003 |
| critical_miss (cost-aware) | -0.004 | [-0.007, -0.000] | 0.036 |
| false_alarm (cost-aware) | -0.012 | [-0.022, -0.002] | 0.020 |
| S2 thinking (unparsed->S1: 0) | 0.644 | 0.643 | 0.333 | 1.601 | 0.512 | 0.115 | 0.488 | - | - | [0.631, 0.656] | [1.540, 1.660] |

accuracy (argmax vs argmax): S1->S2 gap -0.051; fan-out recovers +0.036
risk_cost (cost-aware vs cost-aware): direct 0.725 -> fan-out 0.379; S2 1.601
rescue/harm (S1 direct -> S2): {'rescue': 660, 'harm': 955, 'both_wrong': 1113, 'both_right': 3078}

## Scene-level escalation (S1 direct -> S2), accuracy / risk_cost

| score | 10% | 20% | 30% |
|---|---|---|---|
| MSP | 0.694 / 1.072 | 0.685 / 1.168 | 0.680 / 1.244 |
| entropy | 0.694 / 1.072 | 0.685 / 1.168 | 0.680 / 1.244 |
| fan-out Bayes risk | 0.698 / 1.002 | 0.705 / 1.021 | 0.702 / 1.071 |
| random | 0.688 / 1.061 | 0.680 / 1.127 | 0.676 / 1.188 |

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
