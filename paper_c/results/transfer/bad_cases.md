# Bad-case analysis (InspecSafe test, Qwen3-VL-8B)

Elkan-Noto label frequencies c_j: open_flame 0.93, smoke 0.90, personnel_collapse 0.92, smoking 0.82, oil_leakage 0.92, no_hard_hat 0.95, no_gloves 0.95, no_mask 0.90, mobile_phone 0.87, water_pooling 0.80, oil_accumulation 0.92, foreign_object_light 0.99, foreign_object_hard 0.92, cabinet_door_open 0.92, nonmotor_vehicle 0.94
## A. Masked false positives (hazard images, closed-world truth negatives)

| model | FP rate, severity > level (supervised) | FP rate, 0 < severity <= level (masked) | FP rate on normal images | level-raising FPs (normal + hazard) |
|---|---|---|---|---|
| zero-shot | 0.0225 (10/444) | 0.1388 (306/2205) | 0.0089 | 121 |
| SFT 50 s0 | 0.0450 (20/444) | 0.1029 (227/2205) | 0.0028 | 55 |
| SFT 200 s0 | 0.0518 (23/444) | 0.1469 (324/2205) | 0.0048 | 83 |
| SFT 3190 s0 (level-fill) | 0.0518 (23/444) | 0.2952 (651/2205) | 0.0005 | 29 |
| SFT 3190 s1 (level-fill) | 0.1081 (48/444) | 0.4050 (893/2205) | 0.0002 | 51 |
| SFT 3190 closed-world | 0.0383 (17/444) | 0.0744 (164/2205) | 0.0000 | 17 |
| SFT 3190 PU (closed-world + Elkan-Noto) | 0.0450 (20/444) | 0.0762 (168/2205) | 0.0002 | 22 |
| SFT 3190 latent MIL | 0.0428 (19/444) | 0.1265 (279/2205) | 0.0004 | 24 |

masked FPs of SFT 3190 s0 (level-fill) by primitive: water_pooling 142, no_mask 114, mobile_phone 80, foreign_object_light 78, no_gloves 72, no_hard_hat 52, cabinet_door_open 30, smoke 20
masked FPs of closed-world by primitive: no_gloves 36, no_mask 34, mobile_phone 29, water_pooling 15, smoking 14, foreign_object_light 14, open_flame 8, cabinet_door_open 8

## B. Branch AUROC per primitive (closed-world truth, images of industries where it is a hazard)

| primitive | positives | zero-shot | SFT 50 s0 | SFT 200 s0 | SFT 3190 s0 (level-fill) | SFT 3190 s1 (level-fill) | SFT 3190 closed-world | SFT 3190 PU (closed-world + Elkan-Noto) | SFT 3190 latent MIL |
|---|---|---|---|---|---|---|---|---|---|
| open_flame | 27 | 0.973 | 0.980 | 0.982 | 0.993 | 0.991 | 0.997 | 0.996 | 0.998 |
| smoke | 30 | 0.925 | 0.965 | 0.965 | 0.995 | 0.998 | 1.000 | 1.000 | 0.998 |
| smoking | 32 | 0.937 | 0.961 | 0.943 | 0.958 | 0.964 | 0.973 | 0.971 | 0.970 |
| oil_leakage | 15 | 0.932 | 0.933 | 0.919 | 0.973 | 0.981 | 0.995 | 0.995 | 0.992 |
| no_hard_hat | 60 | 0.964 | 0.973 | 0.978 | 0.985 | 0.985 | 0.990 | 0.985 | 0.988 |
| no_gloves | 119 | 0.980 | 0.983 | 0.983 | 0.976 | 0.981 | 0.989 | 0.984 | 0.988 |
| no_mask | 69 | 0.960 | 0.971 | 0.969 | 0.974 | 0.976 | 0.984 | 0.974 | 0.980 |
| mobile_phone | 27 | 0.977 | 0.980 | 0.979 | 0.979 | 0.981 | 0.985 | 0.980 | 0.985 |
| water_pooling | 8 | 0.938 | 0.958 | 0.967 | 0.914 | 0.985 | 0.994 | 0.995 | 0.989 |
| foreign_object_light | 25 | 0.941 | 0.960 | 0.968 | 0.982 | 0.982 | 0.996 | 0.997 | 0.992 |
| cabinet_door_open | 5 | 0.957 | 0.960 | 0.964 | 0.977 | 0.975 | 0.983 | 0.983 | 0.968 |
| nonmotor_vehicle | 25 | 0.999 | 0.999 | 0.994 | 0.991 | 0.991 | 0.998 | 0.997 | 0.999 |
| **mean** | | **0.957** | **0.969** | **0.968** | **0.975** | **0.982** | **0.990** | **0.988** | **0.987** |

branch recall at p > 0.5 on positives / FP rate on all negatives:
- zero-shot: recall 0.732, FP 0.0283
- SFT 50 s0: recall 0.691, FP 0.0187
- SFT 200 s0: recall 0.802, FP 0.0270
- SFT 3190 s0 (level-fill): recall 0.914, FP 0.0450
- SFT 3190 s1 (level-fill): recall 0.966, FP 0.0625
- SFT 3190 closed-world: recall 0.851, FP 0.0120
- SFT 3190 PU (closed-world + Elkan-Noto): recall 0.851, FP 0.0126
- SFT 3190 latent MIL: recall 0.874, FP 0.0201

## C. Level-two test images (75): errors and their cause

- SFT 3190 s0 (level-fill): right 57/75; down: no level-two primitive in description x4; up: FP nonmotor_vehicle x4; up: FP smoking x3; down: missed water_pooling x3; up: leak / soft evidence x2; up: FP no_hard_hat x1; up: FP open_flame,smoke x1
- SFT 3190 s1 (level-fill): right 44/75; up: FP smoking x13; down: no level-two primitive in description x4; up: FP nonmotor_vehicle x4; up: FP oil_leakage x3; up: leak / soft evidence x2; up: FP open_flame x2; up: FP foreign_object_hard x2; up: FP no_hard_hat x1
- SFT 3190 closed-world: right 54/75; down: no level-two primitive in description x5; up: FP smoking x4; up: FP nonmotor_vehicle x4; down: missed foreign_object_light x3; up: leak / soft evidence x2; up: FP open_flame x1; up: FP no_hard_hat x1; down: missed water_pooling x1
- SFT 3190 PU (closed-world + Elkan-Noto): right 54/75; up: FP smoking x6; down: no level-two primitive in description x5; up: FP nonmotor_vehicle x4; down: missed foreign_object_light x3; up: FP open_flame x1; up: FP no_hard_hat x1; down: missed water_pooling x1
- SFT 3190 latent MIL: right 51/75; down: no level-two primitive in description x5; up: FP foreign_object_hard x5; up: FP smoking x4; up: FP nonmotor_vehicle x4; up: leak / soft evidence x2; down: missed water_pooling x2; up: FP no_hard_hat x1; down: missed foreign_object_light x1
- zero-shot: right 41/75; down: no level-two primitive in description x13; down: missed foreign_object_light x6; down: missed water_pooling x4; up: leak / soft evidence x3; up: FP smoking x2; down: missed mobile_phone x2; up: FP foreign_object_hard x2; down: missed no_gloves x1
