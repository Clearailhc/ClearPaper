# SafeBuild-Bench hazard MCQ (test n=1708: id 1150, november 558; calibration n=492 from id)

| system | acc (all) | 95% CI | acc (Jul-Oct) | acc (Nov, shift) | macro acc over gt categories |
|---|---|---|---|---|---|
| direct MCQ (raw) | 0.445 | [0.422, 0.468] | 0.436 | 0.464 | 0.521 |
| direct MCQ + calibration (T, per-category bias) | 0.534 | [0.510, 0.558] | 0.538 | 0.525 | 0.453 |
| fan-out per-option verification (raw) | 0.480 | [0.456, 0.504] | 0.477 | 0.484 | 0.497 |
| fan-out + calibration (T, per-category bias) | 0.559 | [0.537, 0.582] | 0.552 | 0.573 | 0.489 |

## Paired bootstrap (fan-out minus direct, same calibration on both sides)

| comparison | metric | diff | 95% CI | p |
|---|---|---|---|---|
| fan-out per-option verification vs direct MCQ (raw) | acc | +0.035 | [+0.014, +0.056] | 0.000 |
| fan-out per-option verification vs direct MCQ (raw) | acc Nov | +0.020 | [-0.017, +0.058] | 0.294 |
| fan-out per-option verification vs direct MCQ (raw) | macro acc | -0.024 | [-0.080, +0.034] | 0.520 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc | +0.025 | [+0.002, +0.048] | 0.030 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc Nov | +0.048 | [+0.009, +0.089] | 0.016 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | macro acc | +0.036 | [-0.007, +0.088] | 0.124 |
