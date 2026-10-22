# V44 overexposure under an OR policy (BDD-OIA test; atoms = stop reasons)

test images 4572 (stop 2103); visible cells 14814, clipped cells 10037

| model | AUROC (stop) | FP visible | FP clipped | reason recall | E1 traffic light ignored (emergency) acc on changed | E2 'obstacle: others' ignored acc on changed |
|---|---|---|---|---|---|---|
| zero-shot | 0.7799 | 0.0176 | 0.0432 | 0.276 | 0.452 (n=670) | 0.500 (n=86) |
| decision labels only | 0.8836 | 0.0240 | 0.1567 | 0.513 | 0.116 (n=670) | 0.465 (n=86) |
| decision + reason labels (spot metering) | 0.8837 | 0.0278 | 0.0223 | 0.692 | 0.821 (n=670) | 0.779 (n=86) |
| LUX-v2 (reason labels + prior fill) | 0.8825 | 0.0278 | 0.0212 | 0.684 | 0.818 (n=670) | 0.779 (n=86) |

## O1 difference-in-differences (FP clipped - FP visible), decision only - zero-shot (want > 0)

- +0.1071 [+0.1005, +0.1139] p=0.000

## vs decision labels only

| model | AUROC diff | clipped FP diff | E1 traffic light ignored (emergency) changed-acc diff | E2 'obstacle: others' ignored changed-acc diff |
|---|---|---|---|---|
| decision + reason labels (spot metering) | +0.0001 [-0.0035, +0.0039] | -0.1344 [-0.1415, -0.1278] | +0.7045 [+0.6701, +0.7418] | +0.3140 [+0.2093, +0.4186] |
| LUX-v2 (reason labels + prior fill) | -0.0011 [-0.0047, +0.0027] | -0.1355 [-0.1428, -0.1289] | +0.7015 [+0.6672, +0.7373] | +0.3140 [+0.2093, +0.4186] |
