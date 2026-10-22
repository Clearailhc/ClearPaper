# V5 branch escalation (test n=1250, eta=5.0)

verifier answers on val: 8595; branch accuracy S1 (calibrated, p>0.5) 0.988, verifier 0.692

| primitive | sens | spec |
|---|---|---|
| open_flame | 0.86 | 0.99 |
| smoke | 0.53 | 0.90 |
| personnel_collapse | 0.89 | 0.99 |
| smoking | 0.47 | 0.99 |
| oil_leakage | 0.78 | 0.99 |
| no_hard_hat | 0.99 | 0.94 |
| no_gloves | 0.99 | 0.97 |
| no_mask | 0.99 | 0.96 |
| mobile_phone | 0.89 | 0.99 |
| water_pooling | 0.88 | 0.92 |
| oil_accumulation | 0.87 | 0.94 |
| foreign_object_light | 0.91 | 0.99 |
| foreign_object_hard | 0.87 | 0.98 |
| cabinet_door_open | 0.87 | 0.90 |
| nonmotor_vehicle | 0.50 | 0.99 |

no escalation: acc 0.762, risk 0.550, critical_miss 0.025, false_alarm 0.243

mean verifier tokens per branch query 97; per scene query 841

| policy | budget (queries / N) | verifier tokens / scene | acc | risk_cost | critical_miss | false_alarm |
|---|---|---|---|---|---|---|
| scene (Bayes risk) | 0.05 | 42 | 0.776 | 0.572 | 0.049 | 0.222 |
| sym-VOI | 0.05 | 5 | 0.767 | 0.552 | 0.029 | 0.236 |
| asym-VOI | 0.05 | 5 | 0.768 | 0.554 | 0.033 | 0.234 |
| random branch | 0.05 | 5 | 0.762 | 0.550 | 0.025 | 0.243 |
| oracle (asym-VOI picks) | 0.05 | 0 | 0.791 | 0.481 | 0.025 | 0.208 |
| scene (Bayes risk) | 0.10 | 84 | 0.789 | 0.602 | 0.070 | 0.201 |
| sym-VOI | 0.10 | 10 | 0.768 | 0.574 | 0.037 | 0.236 |
| asym-VOI | 0.10 | 10 | 0.770 | 0.559 | 0.033 | 0.234 |
| random branch | 0.10 | 10 | 0.762 | 0.550 | 0.025 | 0.243 |
| oracle (asym-VOI picks) | 0.10 | 0 | 0.811 | 0.439 | 0.020 | 0.188 |
| scene (Bayes risk) | 0.20 | 168 | 0.794 | 0.634 | 0.078 | 0.187 |
| sym-VOI | 0.20 | 19 | 0.760 | 0.624 | 0.041 | 0.245 |
| asym-VOI | 0.20 | 19 | 0.768 | 0.582 | 0.037 | 0.235 |
| random branch | 0.20 | 19 | 0.762 | 0.548 | 0.025 | 0.243 |
| oracle (asym-VOI picks) | 0.20 | 0 | 0.833 | 0.402 | 0.020 | 0.164 |
| scene (Bayes risk) | 0.30 | 252 | 0.800 | 0.694 | 0.094 | 0.180 |
| sym-VOI | 0.30 | 29 | 0.744 | 0.670 | 0.041 | 0.261 |
| asym-VOI | 0.30 | 29 | 0.752 | 0.641 | 0.045 | 0.252 |
| random branch | 0.30 | 29 | 0.762 | 0.552 | 0.025 | 0.242 |
| oracle (asym-VOI picks) | 0.30 | 0 | 0.847 | 0.343 | 0.012 | 0.152 |
| scene (Bayes risk) | 0.50 | 420 | 0.782 | 0.803 | 0.107 | 0.191 |
| sym-VOI | 0.50 | 48 | 0.734 | 0.708 | 0.045 | 0.273 |
| asym-VOI | 0.50 | 48 | 0.742 | 0.669 | 0.045 | 0.264 |
| random branch | 0.50 | 48 | 0.761 | 0.562 | 0.029 | 0.243 |
| oracle (asym-VOI picks) | 0.50 | 0 | 0.858 | 0.311 | 0.012 | 0.144 |
| scene (Bayes risk) | 1.00 | 841 | 0.722 | 1.210 | 0.152 | 0.202 |
| sym-VOI | 1.00 | 97 | 0.724 | 0.730 | 0.045 | 0.282 |
| asym-VOI | 1.00 | 97 | 0.730 | 0.698 | 0.045 | 0.280 |
| random branch | 1.00 | 97 | 0.759 | 0.570 | 0.029 | 0.244 |
| oracle (asym-VOI picks) | 1.00 | 0 | 0.868 | 0.282 | 0.012 | 0.136 |
