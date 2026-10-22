# Figure 2-5 data package (research_log #115) - every number comes from saved model outputs

Scripts: `scripts/export_figdata.py` (CPU), `scripts/trace_logits.py` (GPU, raw logits). Backbone: Qwen3-VL-8B-Instruct.
Model names: zero-shot = untrained; verdict-only = trained on verdicts only (BDD: bdd_dec; InspecSafe: V34);
level-fill SFT = facts filled from the level constraint; LUX = LUX-v2 objective (BDD: bdd_v42; InspecSafe: V42 seed 0).

## Figure 2 - fig2_trace.json + fig2_raw_logits.json
| requested | where | note |
|---|---|---|
| ell_yes[j], ell_no[j], raw z | fig2_raw_logits.json -> traces[].ell_yes / ell_no / "z = ell_yes - ell_no" | full-vocabulary first-token log-probabilities (HF, bf16), same question wrapper and image resolution as the fan-out. `z_fanout` = the value used in all results (case variants pooled, top-20 floor); `z_fanout_style` reproduces it. BDD agrees within 0.25-0.5 (bf16). |
| raw_prob = sigmoid(z) | fig2_trace.json -> samples[].module_I_zero_shot.raw_prob_sigmoid_z; trained_models.*.raw_prob_sigmoid_z | |
| mu_0, sigma_0, temperature, gamma, whitened z, calibrated p | samples[].module_II_zero_shot_normal_referenced | used for InspecSafe zero-shot results. **There is no tau or beta parameter**: tau in the code is the correlation-group threshold, and groups are switched off in all reported results; the per-fact bias is `bias_b_j`. BDD results use temperature + bias only (MAD stage shown for illustration, flagged in the file). |
| trained-model calibration | samples[].trained_models.* (temperature, bias_b_j, calibrated_p) | trained models use temperature + per-fact bias, no MAD / gamma |
| exposure_old_rule[j] | module_III_training_samples[]."exposure_old_rule (exact ...)" | training images; exact from the annotated / described state |
| exposure_with_perm[j] | InspecSafe sample: "exposure_with_random_tables (rho = 0.3, 2000 draws, as in training)" | **BDD: not applicable** - the rule is binary OR, random tables leave it unchanged, and the BDD runs use alpha = 0 |
| posterior q vs prior | "prior_p0 (base model, calibrated)" and "posterior_q (...)" | exact posterior of the observation model given the verdict and the annotations |

## Figure 3 - fig3_calibration_stats.json
| requested | where | note |
|---|---|---|
| latency CoT / multi-turn / LUX | "latency_seconds_per_image" (8B, 32B) | measured: median, mean, P95, output tokens for direct / LUX ("prism") / describe-then-decide ("generative") / Thinking model. **Not measured: std, KV-cache memory, a 15-separate-requests mode.** |
| histograms, uncalibrated / whitened / LUX, negatives and positives | "inspecsafe_zero_shot_probe_distributions" (water_pooling, smoke = the two probes with the highest raw false-positive rate) | 60-bin histograms + quantiles. Bonus: "bddoia_trained_probe_distributions" (traffic_sign, obstacle_others) for zero-shot / verdict-only / LUX - the blind-zone surge of the verdict-only model |
| empirical FPR vs number of probes m | "inspecsafe_image_level_fpr_by_number_of_probes" | hazard-free test images, 100 random probe orders, mean and 5-95%. Three curves: uncalibrated; MAD + T + b fitted **without** gamma; full (with gamma). **Finding: the two calibrated curves coincide - the reduction comes from MAD whitening + T + b; gamma adds almost nothing.** |

## Figure 4 - fig4_training_dynamics.json
| requested | where | note |
|---|---|---|
| per-fact training exposure vs FPR | "bddoia_per_fact" (6), "inspecsafe_per_fact" (15) | exposure = mean over hazard training images (exact state); FPR on all absent cells and on clipped cells; recall. Paper convention: facts not written in the description = absent (as Table 1). |
| training curves over steps | **missing** ("training_curves": null) | the logs only record losses; validation accuracy / clipped FPR / rule-edit accuracy per step need checkpoint evaluation (new run, about 2 h GPU) |
| ablation of the loss terms | "inspecsafe_ablation", "bddoia_ablation", "component_names" | our terms are A (verdict + fact likelihood), B (random tables), KL prior (on U or on all facts), EM for c_j, fixed temperature. The figure's names ("Gentle Denoising / Priority Rotation / KL Prior Anchor") should map to these. Hot-plug was only run with level-fill SFT (Figure 5), not for each ablation. |

## Figure 5 - fig5_rule_edits_and_cases.json + images/fig5_*
- InspecSafe cases: R1 (level 2 -> 3) x2, R2 (level 3 -> 2) x2: per-fact probabilities of zero-shot / verdict-only / level-fill / LUX, old and new severity rows, predicted levels of LUX (table swapped) and Direct-SFT (old prompt, new rule in the prompt).
- Hot-plug x2: smoking never seen in training or calibration; level without / with the new table entry; Direct-holdout prediction.
- BDD per-reason recall / FPR for every model; only E1 and E2 were run (no other BDD edits).
- Caveat: InspecSafe rule-edit labels are derived from description facts (circular in LUX's favour; V36 was not run) - the paper puts this table in the appendix.

## Raw-logit consistency check (fig2_raw_logits.json)
- BDD-OIA: |z_exact - z_fanout| <= 0.25-0.5 for all three models (bf16 rounding).
- InspecSafe: differences up to 4 (zero-shot) and 20 (V34) occur only on saturated cells (|z| > 8); after the sigmoid the largest
  difference is 0.04 (level-fill) and <= 0.002 elsewhere. Use `z_fanout` for anything that must match the paper's numbers,
  and `ell_yes` / `ell_no` (full vocabulary) for the raw-logit panel.
