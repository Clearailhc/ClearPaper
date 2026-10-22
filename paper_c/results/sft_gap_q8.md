# Why fine-tuned direct beats fine-tuned PRISM (InspecSafe test)

test n=1250; changed cells in learned severity table: 13

## 1. Structural ceiling (primitives answered as the description says)

| severity table | ceiling accuracy |
|---|---|
| official | 0.954 |
| learned from train | 0.965 |

| system | accuracy |
|---|---|
| PRISM-SFT (official table) | 0.960 |
| PRISM-SFT (learned table) | 0.960 |
| direct-SFT | 0.982 |

## 2. PRISM-SFT error decomposition

- PRISM-SFT errors: 50
  - ceiling also wrong (rule / annotation mismatch or text gap): 11
  - ceiling right (primitive perception error): 39

## 3. Where direct-SFT wins

| subset | n | direct-SFT acc | PRISM-SFT acc |
|---|---|---|---|
| ceiling right | 1192 | 0.987 | 0.967 |
| ceiling wrong | 58 | 0.879 | 0.810 |

direct right & PRISM wrong: 33 (of which ceiling wrong: 4)
PRISM right & direct wrong: 6

## 4. Ceiling-wrong cases by (true level, ceiling level, industry)

- true 0 / ceiling 1 / tunnel: 23
- true 0 / ceiling 3 / metallurgy: 14
- true 0 / ceiling 2 / tunnel: 4
- true 0 / ceiling 3 / oil_gas: 3
- true 1 / ceiling 2 / coal_conveyor: 3
- true 3 / ceiling 2 / oil_gas: 3
- true 2 / ceiling 0 / oil_gas: 3
- true 3 / ceiling 2 / tunnel: 3
- true 2 / ceiling 1 / tunnel: 2

examples:
- [metallurgy] true=0 ceiling=3: In the metallurgical plant scene, a car is parked near a plank road with a railing, adjacent to a slag pot emitting smoke and liquid, no abnormalities observed.
- [metallurgy] true=0 ceiling=3: In the metallurgical plant scene, a car is parked near a plank road with a railing, adjacent to a slag pot emitting smoke and liquid, no abnormalities observed.
- [metallurgy] true=0 ceiling=3: In the metallurgical plant scene, liquid flows near a slag pot alongside a plank road, with smoke rising in the background, no abnormalities observed.
- [metallurgy] true=0 ceiling=3: In the metallurgical plant scene, liquid flows near a slag pot alongside a plank road, with smoke rising in the background, no abnormalities observed.
- [metallurgy] true=0 ceiling=3: In the metallurgical plant scene, liquid flows near a slag pot alongside a plank road, with smoke rising in the background, no abnormalities observed.
- [metallurgy] true=0 ceiling=3: In the metallurgical plant scene, liquid flows near a slag pot alongside a plank road while smoke rises in the background, no abnormalities observed.
- [metallurgy] true=0 ceiling=3: In the metallurgical plant scene, liquid flows near a slag pot alongside a plank road, with smoke rising in the background, no abnormalities observed.
- [metallurgy] true=0 ceiling=3: In the metallurgical plant scene, liquid flows near a slag pot alongside a plank road, with smoke rising in the background, no abnormalities observed.
- [metallurgy] true=0 ceiling=3: In the metallurgical plant scene, liquid flows near a slag pot beside a plank road while smoke rises in the background, no abnormalities observed.
- [metallurgy] true=0 ceiling=3: In the metallurgical plant scene, liquid flows near a slag pot beside a plank road while smoke rises in the background, no abnormalities observed.

## 5. Error types (test)

| type | PRISM-SFT | direct-SFT |
|---|---|---|
| false alarm on normal | 5 | 0 |
| miss (hazard -> normal) | 8 | 6 |
| wrong level (hazard -> other hazard level) | 37 | 17 |

## 6. Branch errors of PRISM-SFT (test, against weak labels with the level enforced)

| primitive | labelled | positives | false pos | false neg |
|---|---|---|---|---|
| open_flame | 1108 | 27 | 4 | 5 |
| smoke | 1111 | 30 | 2 | 3 |
| personnel_collapse | 1083 | 2 | 0 | 0 |
| smoking | 1083 | 32 | 4 | 16 |
| oil_leakage | 195 | 15 | 0 | 2 |
| no_hard_hat | 1096 | 60 | 2 | 5 |
| no_gloves | 1128 | 116 | 7 | 1 |
| no_mask | 1077 | 66 | 5 | 1 |
| mobile_phone | 1033 | 27 | 6 | 2 |
| water_pooling | 1008 | 8 | 1 | 3 |
| oil_accumulation | 614 | 0 | 0 | 0 |
| foreign_object_light | 1031 | 25 | 3 | 0 |
| foreign_object_hard | 1033 | 0 | 0 | 0 |
| cabinet_door_open | 448 | 8 | 0 | 0 |
| nonmotor_vehicle | 299 | 25 | 4 | 0 |

branch accuracy 0.9943; images with >= 1 wrong branch: 0.047; accuracy^15 = 0.918

## 7. PRISM-SFT level errors on hazard images: decisive primitive

- decisive primitive missed: smoking: 10
- description/table mismatch: 8
- false positive on a more severe primitive: nonmotor_vehicle: 4
- false positive on a more severe primitive: smoking: 3
- no primitive in description (text gap): 3
- decisive primitive missed: water_pooling: 3
- decisive primitive missed: smoke: 3
- decisive primitive missed: open_flame: 2
- other: 2
- decisive primitive missed: oil_leakage: 2
- false positive on a more severe primitive: no_hard_hat: 1
- false positive on a more severe primitive: no_gloves: 1
- false positive on a more severe primitive: open_flame,smoke,foreign_object_light: 1
- false positive on a more severe primitive: open_flame,no_hard_hat,foreign_object_light: 1
- false positive on a more severe primitive: open_flame,foreign_object_light: 1
