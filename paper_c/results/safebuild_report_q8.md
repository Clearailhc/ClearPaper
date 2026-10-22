# SafeBuild-Bench hazard MCQ (test n=1708: id 1150, november 558; calibration n=492 from id)

| system | acc (all) | 95% CI | acc (Jul-Oct) | acc (Nov, shift) | macro acc over gt categories |
|---|---|---|---|---|---|
| direct MCQ (raw) | 0.427 | [0.403, 0.449] | 0.416 | 0.452 | 0.446 |
| direct MCQ + calibration (T, per-category bias) | 0.534 | [0.511, 0.558] | 0.524 | 0.554 | 0.429 |
| fan-out per-option verification (raw) | 0.522 | [0.498, 0.546] | 0.537 | 0.491 | 0.442 |
| fan-out + calibration (T, per-category bias) | 0.563 | [0.540, 0.587] | 0.558 | 0.572 | 0.439 |
| thinking (unparsed->direct: 0) | 0.410 | [0.386, 0.434] | 0.383 | 0.466 | 0.431 |

## Paired bootstrap (fan-out minus direct, same calibration on both sides)

| comparison | metric | diff | 95% CI | p |
|---|---|---|---|---|
| fan-out per-option verification vs direct MCQ (raw) | acc | +0.095 | [+0.067, +0.125] | 0.000 |
| fan-out per-option verification vs direct MCQ (raw) | acc Nov | +0.039 | [-0.004, +0.087] | 0.092 |
| fan-out per-option verification vs direct MCQ (raw) | macro acc | -0.004 | [-0.028, +0.024] | 0.806 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc | +0.029 | [+0.006, +0.052] | 0.020 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | acc Nov | +0.018 | [-0.021, +0.059] | 0.374 |
| fan-out + calibration vs direct MCQ + calibration (T, per-category bias) | macro acc | +0.010 | [-0.012, +0.034] | 0.356 |
