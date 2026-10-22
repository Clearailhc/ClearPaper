# SafeBuild-Bench hazard MCQ (test n=1708: id 1150, november 558; calibration n=492 from id)

| system | acc (all) | 95% CI | acc (Jul-Oct) | acc (Nov, shift) | macro acc over gt categories |
|---|---|---|---|---|---|
| direct MCQ (raw) | 0.445 | [0.422, 0.468] | 0.436 | 0.464 | 0.521 |
| direct MCQ + calibration (T, per-category bias) | 0.534 | [0.510, 0.558] | 0.538 | 0.525 | 0.453 |
| fan-out per-option verification (raw) | 0.480 | [0.456, 0.504] | 0.477 | 0.484 | 0.497 |
| fan-out + calibration (T, per-category bias) | 0.559 | [0.537, 0.582] | 0.552 | 0.573 | 0.489 |
| direct MCQ + calibration + logit adjustment (tau=1) | 0.482 | [0.459, 0.506] | 0.463 | 0.520 | 0.503 |
| direct MCQ + calibration + EM prior shift | 0.527 | [0.504, 0.550] | 0.524 | 0.532 | 0.440 |
| fan-out + calibration + logit adjustment (tau=1) | 0.524 | [0.500, 0.548] | 0.492 | 0.590 | 0.557 |
| fan-out + calibration + EM prior shift | 0.546 | [0.523, 0.569] | 0.539 | 0.561 | 0.453 |

## Paired bootstrap (fan-out minus direct, same calibration on both sides)

| comparison | metric | diff | 95% CI | p |
|---|---|---|---|---|
| fan-out per-option verification vs direct MCQ (raw) | acc | +0.035 | [+0.014, +0.056] | 0.000 |
| fan-out per-option verification vs direct MCQ (raw) | acc Nov | +0.020 | [-0.017, +0.058] | 0.294 |
| fan-out per-option verification vs direct MCQ (raw) | macro acc | -0.024 | [-0.080, +0.034] | 0.520 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc | +0.025 | [+0.002, +0.048] | 0.030 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc Nov | +0.048 | [+0.009, +0.089] | 0.016 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | macro acc | +0.036 | [-0.007, +0.088] | 0.124 |
| fan-out + calibration + logit adjustment vs direct MCQ + calibration + logit adjustment (tau=1) | acc | +0.042 | [+0.017, +0.068] | 0.002 |
| fan-out + calibration + logit adjustment vs direct MCQ + calibration + logit adjustment (tau=1) | acc Nov | +0.070 | [+0.028, +0.113] | 0.002 |
| fan-out + calibration + logit adjustment vs direct MCQ + calibration + logit adjustment (tau=1) | macro acc | +0.054 | [+0.009, +0.098] | 0.026 |
| fan-out + calibration + EM prior shift vs direct MCQ + calibration + EM prior shift  | acc | +0.019 | [-0.000, +0.039] | 0.060 |
| fan-out + calibration + EM prior shift vs direct MCQ + calibration + EM prior shift  | acc Nov | +0.029 | [-0.005, +0.064] | 0.102 |
| fan-out + calibration + EM prior shift vs direct MCQ + calibration + EM prior shift  | macro acc | +0.013 | [-0.034, +0.056] | 0.522 |
| fan-out + calibration + logit adjustment vs fan-out + calibration (tau=1) | acc | -0.035 | [-0.056, -0.015] | 0.000 |
| fan-out + calibration + logit adjustment vs fan-out + calibration (tau=1) | acc Nov | +0.016 | [-0.021, +0.055] | 0.412 |
| fan-out + calibration + logit adjustment vs fan-out + calibration (tau=1) | macro acc | +0.068 | [-0.005, +0.134] | 0.068 |
