# V5 branch escalation (test n=1250, eta=5.0)

verifier answers on val: 354; branch accuracy S1 (calibrated, p>0.5) 0.988, verifier 0.842

| primitive | sens | spec |
|---|---|---|
| open_flame | 0.33 | 0.97 |
| smoke | 0.61 | 0.75 |
| personnel_collapse | 0.42 | 0.96 |
| smoking | 0.33 | 0.89 |
| oil_leakage | 0.42 | 0.95 |
| no_hard_hat | 0.42 | 0.99 |
| no_gloves | 0.42 | 0.98 |
| no_mask | 0.42 | 0.97 |
| mobile_phone | 0.42 | 0.89 |
| water_pooling | 0.53 | 0.70 |
| oil_accumulation | 0.42 | 0.84 |
| foreign_object_light | 0.33 | 0.87 |
| foreign_object_hard | 0.42 | 0.88 |
| cabinet_door_open | 0.42 | 0.98 |
| nonmotor_vehicle | 0.33 | 0.91 |

no escalation: acc 0.762, risk 0.550, critical_miss 0.025, false_alarm 0.243

mean verifier tokens per branch query 1; per scene query 1

| policy | budget (queries / N) | verifier tokens / scene | acc | risk_cost | critical_miss | false_alarm |
|---|---|---|---|---|---|---|
| scene (Bayes risk) | 0.05 | 0 | 0.793 | 0.493 | 0.037 | 0.205 |
| sym-VOI | 0.05 | 0 | 0.782 | 0.502 | 0.025 | 0.218 |
| asym-VOI | 0.05 | 0 | 0.774 | 0.518 | 0.020 | 0.230 |
| random branch | 0.05 | 0 | 0.762 | 0.550 | 0.025 | 0.243 |
| oracle (asym-VOI picks) | 0.05 | 0 | 0.783 | 0.484 | 0.020 | 0.220 |
| scene (Bayes risk) | 0.10 | 0 | 0.815 | 0.474 | 0.049 | 0.176 |
| sym-VOI | 0.10 | 0 | 0.791 | 0.506 | 0.033 | 0.207 |
| asym-VOI | 0.10 | 0 | 0.774 | 0.526 | 0.029 | 0.228 |
| random branch | 0.10 | 0 | 0.762 | 0.550 | 0.025 | 0.243 |
| oracle (asym-VOI picks) | 0.10 | 0 | 0.794 | 0.474 | 0.025 | 0.208 |
| scene (Bayes risk) | 0.20 | 0 | 0.836 | 0.450 | 0.049 | 0.148 |
| sym-VOI | 0.20 | 0 | 0.807 | 0.482 | 0.037 | 0.192 |
| asym-VOI | 0.20 | 0 | 0.784 | 0.505 | 0.029 | 0.220 |
| random branch | 0.20 | 0 | 0.762 | 0.547 | 0.025 | 0.243 |
| oracle (asym-VOI picks) | 0.20 | 0 | 0.810 | 0.429 | 0.020 | 0.196 |
| scene (Bayes risk) | 0.30 | 0 | 0.850 | 0.478 | 0.057 | 0.133 |
| sym-VOI | 0.30 | 0 | 0.810 | 0.478 | 0.037 | 0.187 |
| asym-VOI | 0.30 | 0 | 0.782 | 0.502 | 0.029 | 0.222 |
| random branch | 0.30 | 0 | 0.762 | 0.547 | 0.025 | 0.243 |
| oracle (asym-VOI picks) | 0.30 | 0 | 0.818 | 0.410 | 0.020 | 0.185 |
| scene (Bayes risk) | 0.50 | 0 | 0.853 | 0.480 | 0.053 | 0.129 |
| sym-VOI | 0.50 | 0 | 0.814 | 0.463 | 0.033 | 0.183 |
| asym-VOI | 0.50 | 0 | 0.785 | 0.485 | 0.025 | 0.220 |
| random branch | 0.50 | 0 | 0.761 | 0.552 | 0.029 | 0.244 |
| oracle (asym-VOI picks) | 0.50 | 0 | 0.826 | 0.372 | 0.012 | 0.180 |
| scene (Bayes risk) | 1.00 | 1 | 0.835 | 0.623 | 0.102 | 0.124 |
| sym-VOI | 1.00 | 1 | 0.811 | 0.475 | 0.037 | 0.184 |
| asym-VOI | 1.00 | 1 | 0.786 | 0.483 | 0.025 | 0.218 |
| random branch | 1.00 | 1 | 0.762 | 0.551 | 0.029 | 0.243 |
| oracle (asym-VOI picks) | 1.00 | 0 | 0.826 | 0.372 | 0.012 | 0.180 |
