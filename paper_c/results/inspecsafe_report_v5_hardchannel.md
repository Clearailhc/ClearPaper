# V5 branch escalation (test n=1250, eta=5.0)

verifier answers on val: 354; branch accuracy S1 (calibrated, p>0.5) 0.988, verifier 0.686

| primitive | sens | spec |
|---|---|---|
| open_flame | 0.27 | 0.94 |
| smoke | 0.39 | 0.52 |
| personnel_collapse | 0.33 | 0.92 |
| smoking | 0.27 | 0.77 |
| oil_leakage | 0.33 | 0.78 |
| no_hard_hat | 0.33 | 0.59 |
| no_gloves | 0.33 | 0.92 |
| no_mask | 0.33 | 0.78 |
| mobile_phone | 0.33 | 0.77 |
| water_pooling | 0.47 | 0.69 |
| oil_accumulation | 0.33 | 0.81 |
| foreign_object_light | 0.27 | 0.73 |
| foreign_object_hard | 0.33 | 0.89 |
| cabinet_door_open | 0.33 | 0.49 |
| nonmotor_vehicle | 0.29 | 0.81 |

no escalation: acc 0.762, risk 0.550, critical_miss 0.025, false_alarm 0.243

mean verifier tokens per branch query 97; per scene query nan

| policy | budget (queries / N) | verifier tokens / scene | acc | risk_cost | critical_miss | false_alarm |
|---|---|---|---|---|---|---|
| sym-VOI | 0.05 | 5 | 0.767 | 0.552 | 0.029 | 0.236 |
| asym-VOI | 0.05 | 5 | 0.763 | 0.555 | 0.029 | 0.242 |
| random branch | 0.05 | 5 | 0.762 | 0.550 | 0.025 | 0.243 |
| oracle (asym-VOI picks) | 0.05 | 0 | 0.783 | 0.506 | 0.025 | 0.220 |
| sym-VOI | 0.10 | 10 | 0.768 | 0.574 | 0.037 | 0.236 |
| asym-VOI | 0.10 | 10 | 0.762 | 0.560 | 0.033 | 0.243 |
| random branch | 0.10 | 10 | 0.762 | 0.550 | 0.025 | 0.243 |
| oracle (asym-VOI picks) | 0.10 | 0 | 0.794 | 0.470 | 0.020 | 0.212 |
| sym-VOI | 0.20 | 19 | 0.760 | 0.624 | 0.041 | 0.245 |
| asym-VOI | 0.20 | 19 | 0.759 | 0.563 | 0.033 | 0.247 |
| random branch | 0.20 | 19 | 0.761 | 0.550 | 0.025 | 0.244 |
| oracle (asym-VOI picks) | 0.20 | 0 | 0.798 | 0.464 | 0.020 | 0.207 |
| sym-VOI | 0.30 | 29 | 0.744 | 0.670 | 0.041 | 0.261 |
| asym-VOI | 0.30 | 29 | 0.759 | 0.563 | 0.033 | 0.247 |
| random branch | 0.30 | 29 | 0.761 | 0.550 | 0.025 | 0.244 |
| oracle (asym-VOI picks) | 0.30 | 0 | 0.798 | 0.464 | 0.020 | 0.207 |
