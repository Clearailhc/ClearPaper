# SafeBuild-Bench hazard MCQ (test n=1708: id 1150, november 558; calibration n=492 from id)

| system | acc (all) | 95% CI | acc (Jul-Oct) | acc (Nov, shift) | macro acc over gt categories |
|---|---|---|---|---|---|
| direct MCQ (raw) | 0.427 | [0.403, 0.449] | 0.416 | 0.452 | 0.446 |
| direct MCQ + calibration (T, per-category bias) | 0.534 | [0.511, 0.558] | 0.524 | 0.554 | 0.429 |
| fan-out per-option verification (raw) | 0.522 | [0.498, 0.546] | 0.537 | 0.491 | 0.442 |
| fan-out + calibration (T, per-category bias) | 0.563 | [0.540, 0.587] | 0.558 | 0.572 | 0.439 |
| direct MCQ + calibration + logit adjustment (tau=1) | 0.455 | [0.431, 0.477] | 0.439 | 0.487 | 0.443 |
| direct MCQ + calibration + EM prior shift | 0.523 | [0.501, 0.547] | 0.509 | 0.552 | 0.397 |
| fan-out + calibration + logit adjustment (tau=1) | 0.512 | [0.490, 0.536] | 0.491 | 0.556 | 0.482 |
| fan-out + calibration + EM prior shift | 0.551 | [0.526, 0.576] | 0.544 | 0.565 | 0.382 |

## Paired bootstrap (fan-out minus direct, same calibration on both sides)

| comparison | metric | diff | 95% CI | p |
|---|---|---|---|---|
| fan-out per-option verification vs direct MCQ (raw) | acc | +0.095 | [+0.067, +0.125] | 0.000 |
| fan-out per-option verification vs direct MCQ (raw) | acc Nov | +0.039 | [-0.004, +0.087] | 0.092 |
| fan-out per-option verification vs direct MCQ (raw) | macro acc | -0.004 | [-0.028, +0.024] | 0.806 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc | +0.029 | [+0.006, +0.052] | 0.020 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc Nov | +0.018 | [-0.021, +0.059] | 0.374 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | macro acc | +0.010 | [-0.012, +0.034] | 0.356 |
| fan-out + calibration + logit adjustment vs direct MCQ + calibration + logit adjustment (tau=1) | acc | +0.057 | [+0.033, +0.081] | 0.000 |
| fan-out + calibration + logit adjustment vs direct MCQ + calibration + logit adjustment (tau=1) | acc Nov | +0.068 | [+0.025, +0.111] | 0.000 |
| fan-out + calibration + logit adjustment vs direct MCQ + calibration + logit adjustment (tau=1) | macro acc | +0.039 | [-0.007, +0.086] | 0.088 |
| fan-out + calibration + EM prior shift vs direct MCQ + calibration + EM prior shift  | acc | +0.028 | [+0.007, +0.053] | 0.010 |
| fan-out + calibration + EM prior shift vs direct MCQ + calibration + EM prior shift  | acc Nov | +0.013 | [-0.026, +0.054] | 0.532 |
| fan-out + calibration + EM prior shift vs direct MCQ + calibration + EM prior shift  | macro acc | -0.015 | [-0.058, +0.022] | 0.506 |
| fan-out + calibration + logit adjustment vs fan-out + calibration (tau=1) | acc | -0.050 | [-0.071, -0.029] | 0.000 |
| fan-out + calibration + logit adjustment vs fan-out + calibration (tau=1) | acc Nov | -0.016 | [-0.052, +0.021] | 0.452 |
| fan-out + calibration + logit adjustment vs fan-out + calibration (tau=1) | macro acc | +0.043 | [-0.012, +0.103] | 0.138 |
