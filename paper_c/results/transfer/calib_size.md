# Calibration-set size vs the strongest direct baseline (InspecSafe test)

PRISM calibrated on n random val images (mean ± sd over reps) vs the direct question with matrix scaling on n images and on all val images. Risk = cost-aware (eta = 5).

## Qwen3-VL-8B  (direct + matrix scaling on all 573 val: acc 0.897, AUROC 0.975, risk 0.479)

| n | PRISM base acc | PRISM base AUROC | PRISM base risk | PRISM MAD+γ AUROC | direct MS(n) acc | direct MS(n) AUROC | direct MS(n) risk | reps with PRISM base acc ≥ ref | reps with PRISM base risk ≤ ref |
|---|---|---|---|---|---|---|---|---|---|
| 20 | 0.842±0.021 | 0.959±0.007 | 0.601±0.064 | 0.965±0.011 | 0.848±0.024 | 0.929±0.033 | 0.997±0.364 | 0/20 | 0/20 |
| 50 | 0.865±0.023 | 0.964±0.004 | 0.581±0.048 | 0.976±0.007 | 0.868±0.020 | 0.955±0.021 | 0.664±0.168 | 0/20 | 0/20 |
| 100 | 0.878±0.015 | 0.966±0.002 | 0.553±0.020 | 0.980±0.004 | 0.881±0.009 | 0.953±0.020 | 0.643±0.143 | 2/20 | 0/20 |
| 200 | 0.874±0.007 | 0.966±0.001 | 0.551±0.012 | 0.982±0.003 | 0.891±0.011 | 0.967±0.008 | 0.513±0.077 | 0/20 | 0/20 |

## Qwen3-VL-32B  (direct + matrix scaling on all 573 val: acc 0.901, AUROC 0.973, risk 0.470)

| n | PRISM base acc | PRISM base AUROC | PRISM base risk | PRISM MAD+γ AUROC | direct MS(n) acc | direct MS(n) AUROC | direct MS(n) risk | reps with PRISM base acc ≥ ref | reps with PRISM base risk ≤ ref |
|---|---|---|---|---|---|---|---|---|---|
| 20 | 0.870±0.023 | 0.967±0.007 | 0.492±0.048 | 0.971±0.008 | 0.839±0.030 | 0.945±0.023 | 0.811±0.448 | 3/20 | 6/20 |
| 50 | 0.886±0.022 | 0.971±0.006 | 0.464±0.048 | 0.975±0.006 | 0.866±0.023 | 0.954±0.023 | 0.677±0.097 | 5/20 | 11/20 |
| 100 | 0.888±0.015 | 0.972±0.005 | 0.465±0.033 | 0.979±0.005 | 0.888±0.007 | 0.964±0.010 | 0.548±0.077 | 4/20 | 15/20 |
| 200 | 0.891±0.011 | 0.972±0.004 | 0.459±0.019 | 0.982±0.002 | 0.898±0.004 | 0.968±0.008 | 0.487±0.038 | 3/20 | 15/20 |

## Qwen3.5-9B  (direct + matrix scaling on all 573 val: acc 0.904, AUROC 0.979, risk 0.430)

| n | PRISM base acc | PRISM base AUROC | PRISM base risk | PRISM MAD+γ AUROC | direct MS(n) acc | direct MS(n) AUROC | direct MS(n) risk | reps with PRISM base acc ≥ ref | reps with PRISM base risk ≤ ref |
|---|---|---|---|---|---|---|---|---|---|
| 20 | 0.881±0.015 | 0.960±0.008 | 0.504±0.062 | 0.975±0.004 | 0.840±0.034 | 0.952±0.039 | 0.889±0.307 | 2/20 | 1/20 |
| 50 | 0.901±0.018 | 0.968±0.008 | 0.511±0.061 | 0.978±0.004 | 0.871±0.025 | 0.963±0.024 | 0.600±0.173 | 12/20 | 1/20 |
| 100 | 0.902±0.019 | 0.968±0.008 | 0.450±0.033 | 0.980±0.003 | 0.884±0.014 | 0.974±0.004 | 0.478±0.045 | 11/20 | 7/20 |
| 200 | 0.898±0.016 | 0.967±0.006 | 0.453±0.026 | 0.981±0.002 | 0.896±0.008 | 0.977±0.002 | 0.452±0.034 | 9/20 | 4/20 |

## Gemma 4 E4B  (direct + matrix scaling on all 573 val: acc 0.815, AUROC 0.820, risk 1.311)

| n | PRISM base acc | PRISM base AUROC | PRISM base risk | PRISM MAD+γ AUROC | direct MS(n) acc | direct MS(n) AUROC | direct MS(n) risk | reps with PRISM base acc ≥ ref | reps with PRISM base risk ≤ ref |
|---|---|---|---|---|---|---|---|---|---|
| 20 | 0.778±0.054 | 0.936±0.016 | 0.836±0.079 | 0.946±0.012 | 0.737±0.059 | 0.727±0.102 | 1.796±0.318 | 5/20 | 20/20 |
| 50 | 0.814±0.040 | 0.944±0.009 | 0.807±0.051 | 0.957±0.005 | 0.782±0.027 | 0.755±0.058 | 1.613±0.300 | 10/20 | 20/20 |
| 100 | 0.831±0.023 | 0.945±0.005 | 0.795±0.039 | 0.960±0.005 | 0.807±0.006 | 0.798±0.019 | 1.399±0.080 | 16/20 | 20/20 |
| 200 | 0.824±0.017 | 0.944±0.003 | 0.786±0.018 | 0.962±0.003 | 0.811±0.005 | 0.813±0.008 | 1.342±0.050 | 13/20 | 20/20 |

