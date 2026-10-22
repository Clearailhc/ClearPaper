# SafeBuild-Bench hazard MCQ (test n=1708: id 1150, november 558; calibration n=492 from id)

| system | acc (all) | 95% CI | acc (Jul-Oct) | acc (Nov, shift) | macro acc over gt categories |
|---|---|---|---|---|---|
| direct MCQ (raw) | 0.340 | [0.318, 0.362] | 0.323 | 0.376 | 0.334 |
| direct MCQ + calibration (T, per-category bias) | 0.454 | [0.431, 0.477] | 0.469 | 0.423 | 0.339 |
| fan-out per-option verification (raw) | 0.453 | [0.430, 0.475] | 0.484 | 0.389 | 0.362 |
| fan-out + calibration (T, per-category bias) | 0.485 | [0.461, 0.508] | 0.493 | 0.468 | 0.334 |

## Paired bootstrap (fan-out minus direct, same calibration on both sides)

| comparison | metric | diff | 95% CI | p |
|---|---|---|---|---|
| fan-out per-option verification vs direct MCQ (raw) | acc | +0.113 | [+0.081, +0.143] | 0.000 |
| fan-out per-option verification vs direct MCQ (raw) | acc Nov | +0.013 | [-0.039, +0.062] | 0.674 |
| fan-out per-option verification vs direct MCQ (raw) | macro acc | +0.028 | [-0.038, +0.093] | 0.378 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc | +0.031 | [+0.006, +0.056] | 0.016 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc Nov | +0.045 | [+0.004, +0.085] | 0.030 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | macro acc | -0.004 | [-0.048, +0.030] | 0.958 |
