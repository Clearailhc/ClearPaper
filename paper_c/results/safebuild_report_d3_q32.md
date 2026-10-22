# SafeBuild-Bench hazard MCQ (test n=1708: id 1150, november 558; calibration n=492 from id)

| system | acc (all) | 95% CI | acc (Jul-Oct) | acc (Nov, shift) | macro acc over gt categories |
|---|---|---|---|---|---|
| direct MCQ (raw) | 0.468 | [0.444, 0.491] | 0.457 | 0.491 | 0.487 |
| direct MCQ + calibration (T, per-category bias) | 0.549 | [0.526, 0.571] | 0.537 | 0.573 | 0.453 |
| fan-out per-option verification (raw) | 0.513 | [0.489, 0.536] | 0.523 | 0.491 | 0.470 |
| fan-out + calibration (T, per-category bias) | 0.597 | [0.573, 0.619] | 0.586 | 0.618 | 0.483 |
| direct MCQ + calibration + logit adjustment (tau=1) | 0.460 | [0.437, 0.484] | 0.441 | 0.500 | 0.476 |
| direct MCQ + calibration + EM prior shift | 0.520 | [0.496, 0.544] | 0.510 | 0.541 | 0.420 |
| fan-out + calibration + logit adjustment (tau=1) | 0.522 | [0.498, 0.545] | 0.499 | 0.570 | 0.536 |
| fan-out + calibration + EM prior shift | 0.570 | [0.547, 0.594] | 0.561 | 0.590 | 0.431 |

## Paired bootstrap (fan-out minus direct, same calibration on both sides)

| comparison | metric | diff | 95% CI | p |
|---|---|---|---|---|
| fan-out per-option verification vs direct MCQ (raw) | acc | +0.045 | [+0.020, +0.071] | 0.002 |
| fan-out per-option verification vs direct MCQ (raw) | acc Nov | +0.000 | [-0.040, +0.038] | 0.968 |
| fan-out per-option verification vs direct MCQ (raw) | macro acc | -0.016 | [-0.053, +0.074] | 0.922 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc | +0.048 | [+0.024, +0.072] | 0.000 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc Nov | +0.045 | [+0.005, +0.083] | 0.022 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | macro acc | +0.030 | [-0.006, +0.077] | 0.134 |
| fan-out + calibration + logit adjustment vs direct MCQ + calibration + logit adjustment (tau=1) | acc | +0.062 | [+0.038, +0.087] | 0.000 |
| fan-out + calibration + logit adjustment vs direct MCQ + calibration + logit adjustment (tau=1) | acc Nov | +0.070 | [+0.030, +0.112] | 0.002 |
| fan-out + calibration + logit adjustment vs direct MCQ + calibration + logit adjustment (tau=1) | macro acc | +0.060 | [-0.007, +0.168] | 0.086 |
| fan-out + calibration + EM prior shift vs direct MCQ + calibration + EM prior shift  | acc | +0.050 | [+0.028, +0.075] | 0.000 |
| fan-out + calibration + EM prior shift vs direct MCQ + calibration + EM prior shift  | acc Nov | +0.048 | [+0.007, +0.088] | 0.026 |
| fan-out + calibration + EM prior shift vs direct MCQ + calibration + EM prior shift  | macro acc | +0.011 | [-0.032, +0.106] | 0.370 |
| fan-out + calibration + logit adjustment vs fan-out + calibration (tau=1) | acc | -0.074 | [-0.097, -0.053] | 0.000 |
| fan-out + calibration + logit adjustment vs fan-out + calibration (tau=1) | acc Nov | -0.048 | [-0.085, -0.009] | 0.016 |
| fan-out + calibration + logit adjustment vs fan-out + calibration (tau=1) | macro acc | +0.053 | [-0.007, +0.109] | 0.090 |
