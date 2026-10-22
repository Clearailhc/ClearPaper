# Figure 1 material on BDD-OIA (research_log #112)

Four test frames whose ONLY annotated stop reason is the red light. Panels, mirroring the InspecSafe Figure 1:
- (a) Training, old rule "stop if any reason": the red light alone decides STOP. Training exposure of each reason
      (probability that flipping it changes the verdict) - traffic_light ~0.95, every other reason ~0.007:
      the other reasons receive (almost) no supervision. -> field "exposure_under_old_rule".
- (b) Rule edit E1 "in an emergency, traffic lights may be ignored" (truth becomes GO). The verdict-only model
      reads absent reasons as present (traffic_sign ~0.89, obstacle_others ~0.5-0.65) and still STOPS. -> "verdict-only".
- (c) LUX, same edit, table edited, zero retraining: traffic_light 0.99, all others <= 0.06, P(stop) 0.05 -> GO. -> "LUX".
- zero-shot probabilities are included for reference.

Aggregate numbers for the panels (all from research_log #110 / #112):
- affected images (n = 670): untrained 0.452, verdict-only 0.166, LUX 0.810
- all 4,572 test images under E1: verdict-only 0.695, LUX 0.799 (+10.4 points)
- clipped-cell false-positive rate: zero-shot 0.043, verdict-only 0.199, LUX 0.021

Caveat (do not draw): the "missed real reason" case of the InspecSafe figure (a true fact drowned) does NOT hold on
BDD-OIA - on frames with a red light AND a real obstacle the verdict-only model keeps stopping more often (0.95 vs 0.77).
FP_1: a blue mandatory-direction sign is visible (not a stop / yield sign). FP_4: night, no sign at all (cleanest).
