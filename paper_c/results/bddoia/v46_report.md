# V44 overexposure under an OR policy (BDD-OIA test; atoms = stop reasons)

test images 4572 (stop 2103); visible cells 14814, clipped cells 10037

| model | AUROC (stop) | FP visible | FP clipped | reason recall | E1 traffic light ignored (emergency) acc on changed | E2 'obstacle: others' ignored acc on changed |
|---|---|---|---|---|---|---|
| zero-shot | 0.7799 | 0.0176 | 0.0432 | 0.276 | 0.452 (n=670) | 0.500 (n=86) |
| decision labels only | 0.8836 | 0.0302 | 0.1989 | 0.577 | 0.166 (n=670) | 0.453 (n=86) |
| decision + reason labels (spot metering) | 0.8792 | 0.0223 | 0.0219 | 0.644 | 0.816 (n=670) | 0.779 (n=86) |
| LUX-v2 (reason labels + prior fill) | 0.8785 | 0.0223 | 0.0208 | 0.630 | 0.810 (n=670) | 0.756 (n=86) |
| half labels: concept supervision (unlabeled = absent) | 0.8679 | 0.0191 | 0.0155 | 0.552 | 0.860 (n=670) | 0.767 (n=86) |
| half labels: LUX-v2 online EM | 0.8783 | 0.0242 | 0.0387 | 0.629 | 0.761 (n=670) | 0.512 (n=86) |
| half labels: LUX-v2 cross-fitted c | 0.8751 | 0.0222 | 0.0265 | 0.593 | 0.806 (n=670) | 0.640 (n=86) |
| half labels: LUX-v2 oracle c | 0.8765 | 0.0229 | 0.0237 | 0.616 | 0.804 (n=670) | 0.640 (n=86) |

## O1 difference-in-differences (FP clipped - FP visible), decision only - zero-shot (want > 0)

- +0.1430 [+0.1345, +0.1520] p=0.000

## vs decision labels only

| model | AUROC diff | clipped FP diff | E1 traffic light ignored (emergency) changed-acc diff | E2 'obstacle: others' ignored changed-acc diff |
|---|---|---|---|---|
| decision + reason labels (spot metering) | -0.0044 [-0.0081, -0.0007] | -0.1769 [-0.1857, -0.1686] | +0.6507 [+0.6149, +0.6881] | +0.3256 [+0.2209, +0.4302] |
| LUX-v2 (reason labels + prior fill) | -0.0051 [-0.0085, -0.0016] | -0.1780 [-0.1871, -0.1695] | +0.6448 [+0.6090, +0.6821] | +0.3023 [+0.1977, +0.4073] |
| half labels: concept supervision (unlabeled = absent) | -0.0157 [-0.0209, -0.0108] | -0.1833 [-0.1926, -0.1750] | +0.6940 [+0.6582, +0.7299] | +0.3140 [+0.2093, +0.4186] |
| half labels: LUX-v2 online EM | -0.0053 [-0.0083, -0.0023] | -0.1602 [-0.1684, -0.1527] | +0.5955 [+0.5612, +0.6328] | +0.0581 [+0.0116, +0.1163] |
| half labels: LUX-v2 cross-fitted c | -0.0085 [-0.0123, -0.0052] | -0.1724 [-0.1804, -0.1643] | +0.6403 [+0.6060, +0.6776] | +0.1860 [+0.1047, +0.2791] |
| half labels: LUX-v2 oracle c | -0.0071 [-0.0107, -0.0039] | -0.1752 [-0.1835, -0.1669] | +0.6388 [+0.6030, +0.6761] | +0.1860 [+0.0930, +0.2791] |
