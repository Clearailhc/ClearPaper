# Example images for the figures (selected from model outputs, research_log #112)

Selection rule: the image must show the mechanism of the paper - the decision-only (or level-fill) model reads an
absent atom as present on a clipped / masked cell (p > 0.5), LUX-v2 does not (p < 0.5); ranked by the gap.
BDD-OIA: images whose only annotated stop reason is the red light (under E1 the correct decision becomes 'go').
Licences: BDD-OIA CC-BY-SA 4.0; MVTec AD (in MMAD) CC BY-NC-SA 4.0 (non-commercial); InspecSafe - check before publishing.

## BDD-OIA: rule edit E1 (traffic lights ignored); truth after the edit = go

### bddoia/bddoia_1.jpg
- note (checked by eye): a blue mandatory-direction sign is visible, but no stop / yield sign; the decision-only model's 'traffic_sign 0.89' confuses 'a sign is present' with 'a sign requires stopping'
- source: `bddoia/test/4135eca0-583f6210.jpg`
- annotated stop reasons: traffic_light only (truth under E1: go)
- decision-only model, reason probabilities: obstacle_car 0.23, traffic_sign 0.89, obstacle_rider 0.13, obstacle_person 0.09, traffic_light 0.94, obstacle_others 0.65 -> still STOP under E1
- LUX-v2, reason probabilities: obstacle_car 0.03, traffic_sign 0.01, obstacle_rider 0.00, obstacle_person 0.00, traffic_light 0.99, obstacle_others 0.01 -> GO under E1

### bddoia/bddoia_2.jpg
- source: `bddoia/test/e4a5d833-469222b6.jpg`
- annotated stop reasons: traffic_light only (truth under E1: go)
- decision-only model, reason probabilities: obstacle_car 0.14, traffic_sign 0.88, obstacle_rider 0.08, obstacle_person 0.08, traffic_light 0.95, obstacle_others 0.59 -> still STOP under E1
- LUX-v2, reason probabilities: obstacle_car 0.03, traffic_sign 0.02, obstacle_rider 0.00, obstacle_person 0.00, traffic_light 0.99, obstacle_others 0.02 -> GO under E1

### bddoia/bddoia_3.jpg
- source: `bddoia/test/3a060876-4f306603.jpg`
- annotated stop reasons: traffic_light only (truth under E1: go)
- decision-only model, reason probabilities: obstacle_car 0.10, traffic_sign 0.89, obstacle_rider 0.09, obstacle_person 0.09, traffic_light 0.96, obstacle_others 0.50 -> still STOP under E1
- LUX-v2, reason probabilities: obstacle_car 0.02, traffic_sign 0.03, obstacle_rider 0.00, obstacle_person 0.01, traffic_light 0.99, obstacle_others 0.04 -> GO under E1

### bddoia/bddoia_4.jpg
- note (checked by eye): night scene, red lights, no traffic sign at all - a clean hallucinated reason
- source: `bddoia/test/0001542f-ec815219.jpg`
- annotated stop reasons: traffic_light only (truth under E1: go)
- decision-only model, reason probabilities: obstacle_car 0.27, traffic_sign 0.91, obstacle_rider 0.08, obstacle_person 0.07, traffic_light 0.94, obstacle_others 0.54 -> still STOP under E1
- LUX-v2, reason probabilities: obstacle_car 0.06, traffic_sign 0.04, obstacle_rider 0.00, obstacle_person 0.01, traffic_light 0.99, obstacle_others 0.06 -> GO under E1

## MMAD: clipped false positives (the image is already defective)

### mmad/mmad_1.png
- source: `DS-MVTec/leather/image/cut/003.png`
- category MVTec/leather; true defect type: cut
- decision-only model: color 0.11, cut 0.95, fold 0.60, glue 0.85, poke 0.97
- LUX-v2: color 0.01, cut 0.98, fold 0.01, glue 0.02, poke 0.04

### mmad/mmad_2.png
- source: `DS-MVTec/hazelnut/image/cut/005.png`
- category MVTec/hazelnut; true defect type: cut
- decision-only model: crack 0.99, cut 0.76, hole 0.05, print 0.36
- LUX-v2: crack 0.06, cut 0.98, hole 0.00, print 0.01

### mmad/mmad_3.png
- source: `DS-MVTec/carpet/image/color/008.png`
- category MVTec/carpet; true defect type: color
- decision-only model: color 0.96, cut 0.54, hole 0.95, metal_contamination 0.04, thread 0.72
- LUX-v2: color 0.94, cut 0.03, hole 0.05, metal_contamination 0.01, thread 0.06

### mmad/mmad_4.png
- source: `DS-MVTec/tile/image/glue_strip/014.png`
- category MVTec/tile; true defect type: glue_strip
- decision-only model: crack 0.45, glue_strip 0.83, gray_stroke 0.90, oil 0.24, rough 0.60
- LUX-v2: crack 0.03, glue_strip 0.97, gray_stroke 0.03, oil 0.00, rough 0.02

## InspecSafe: masked false positives (the hazard level is already fixed by another hazard)

### inspecsafe/inspecsafe_1.jpg
- note (checked by eye): oil leaking onto the floor; level-fill SFT also reads it as water pooling
- source: `oil_chemical-Level01-Wheeled-002333-001`
- industry oil_gas; level 3 (0 = none, 3 = Level one)
- description: In the oil and gas chemical scene, there is oil leakage on the ground. The safety level is grade one.
- level-fill SFT: open_flame 0.01, smoke 0.02, personnel_collapse 0.00, smoking 0.01, oil_leakage 0.98, no_hard_hat 0.00, no_gloves 0.00, no_mask 0.00, mobile_phone 0.01, water_pooling 0.99, foreign_object_light 0.09, foreign_object_hard 0.01
- LUX-v2: open_flame 0.00, smoke 0.00, personnel_collapse 0.00, smoking 0.00, oil_leakage 1.00, no_hard_hat 0.00, no_gloves 0.00, no_mask 0.00, mobile_phone 0.00, water_pooling 0.00, foreign_object_light 0.00, foreign_object_hard 0.00

### inspecsafe/inspecsafe_2.jpg
- source: `tunnel-Level02-SuspendedRail-002457-001`
- industry tunnel; level 2 (0 = none, 3 = Level one)
- description: In the tunnel scenario, personnel do not wear gloves, masks, or safety helmets. The safety level is Grade Two.
- level-fill SFT: open_flame 0.04, smoke 0.02, personnel_collapse 0.04, smoking 0.08, no_hard_hat 0.98, no_gloves 0.99, no_mask 0.98, mobile_phone 0.26, water_pooling 0.91, oil_accumulation 0.15, foreign_object_light 0.98, foreign_object_hard 0.02, cabinet_door_open 0.20, nonmotor_vehicle 0.03
- LUX-v2: open_flame 0.00, smoke 0.00, personnel_collapse 0.00, smoking 0.00, no_hard_hat 1.00, no_gloves 0.99, no_mask 0.99, mobile_phone 0.00, water_pooling 0.00, oil_accumulation 0.00, foreign_object_light 0.01, foreign_object_hard 0.00, cabinet_door_open 0.01, nonmotor_vehicle 0.00

### inspecsafe/inspecsafe_3.jpg
- source: `oil_chemical-Level01-Wheeled-002371-001`
- industry oil_gas; level 3 (0 = none, 3 = Level one)
- description: In the oil and gas chemical scenario, there is smoke. The safety level is grade one.
- level-fill SFT: open_flame 0.54, smoke 0.98, personnel_collapse 0.00, smoking 0.01, oil_leakage 0.32, no_hard_hat 0.00, no_gloves 0.00, no_mask 0.00, mobile_phone 0.01, water_pooling 0.98, foreign_object_light 0.17, foreign_object_hard 0.01
- LUX-v2: open_flame 0.00, smoke 1.00, personnel_collapse 0.00, smoking 0.00, oil_leakage 0.00, no_hard_hat 0.00, no_gloves 0.00, no_mask 0.00, mobile_phone 0.00, water_pooling 0.02, foreign_object_light 0.00, foreign_object_hard 0.00

### inspecsafe/inspecsafe_4.jpg
- source: `oil_chemical-Level01-Wheeled-002350-001`
- industry oil_gas; level 3 (0 = none, 3 = Level one)
- description: In the oil and gas chemical scenario, personnel are not wearing masks and not wearing gloves. The safety level is grade one.
- level-fill SFT: open_flame 0.04, smoke 0.07, personnel_collapse 0.01, smoking 0.04, oil_leakage 0.98, no_hard_hat 0.07, no_gloves 0.99, no_mask 0.97, mobile_phone 0.29, water_pooling 0.74, foreign_object_light 0.99, foreign_object_hard 0.02
- LUX-v2: open_flame 0.00, smoke 0.00, personnel_collapse 0.00, smoking 0.00, oil_leakage 0.02, no_hard_hat 0.01, no_gloves 1.00, no_mask 1.00, mobile_phone 0.00, water_pooling 0.01, foreign_object_light 0.01, foreign_object_hard 0.00

