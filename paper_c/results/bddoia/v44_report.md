# V44 overexposure under an OR policy (BDD-OIA test; atoms = stop reasons)

test images 4572 (stop 2103); visible cells 14814, clipped cells 10037

| model | AUROC (stop) | FP visible | FP clipped | reason recall | E1 traffic light ignored (emergency) acc on changed | E2 'obstacle: others' ignored acc on changed |
|---|---|---|---|---|---|---|
| zero-shot | 0.7799 | 0.0176 | 0.0432 | 0.276 | 0.452 (n=670) | 0.500 (n=86) |
| decision labels only | 0.8836 | 0.0302 | 0.1989 | 0.577 | 0.166 (n=670) | 0.453 (n=86) |
| decision + reason labels (spot metering) | 0.8792 | 0.0223 | 0.0219 | 0.644 | 0.816 (n=670) | 0.779 (n=86) |
| LUX-v2 (reason labels + prior fill) | 0.8785 | 0.0223 | 0.0208 | 0.630 | 0.810 (n=670) | 0.756 (n=86) |

## O1 difference-in-differences (FP clipped - FP visible), decision only - zero-shot (want > 0)

- +0.1430 [+0.1345, +0.1520] p=0.000

## vs decision labels only

| model | AUROC diff | clipped FP diff | E1 traffic light ignored (emergency) changed-acc diff | E2 'obstacle: others' ignored changed-acc diff |
|---|---|---|---|---|
| decision + reason labels (spot metering) | -0.0044 [-0.0081, -0.0007] | -0.1769 [-0.1857, -0.1686] | +0.6507 [+0.6149, +0.6881] | +0.3256 [+0.2209, +0.4302] |
| LUX-v2 (reason labels + prior fill) | -0.0051 [-0.0085, -0.0016] | -0.1780 [-0.1871, -0.1695] | +0.6448 [+0.6090, +0.6821] | +0.3023 [+0.1977, +0.4073] |
