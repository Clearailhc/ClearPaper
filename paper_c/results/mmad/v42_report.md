# V40 overexposure under an OR policy (MMAD test; atoms = defect types)

test images 5776 (defective 3497); visible cells 4455, clipped cells 5572

| model | image AUROC | FP visible | FP clipped | defect-type accuracy |
|---|---|---|---|---|
| zero-shot | 0.7945 | 0.0662 | 0.1319 | 0.463 |
| decision labels only | 0.9027 | 0.0810 | 0.3629 | 0.603 |
| decision + atom labels (spot metering) | 0.8901 | 0.0539 | 0.0784 | 0.755 |
| LUX-v2 (V42: atom labels + prior fill) | 0.8986 | 0.0604 | 0.0879 | 0.756 |

## paired bootstrap over test images (clipped-cell FP rate)

- decision labels only - zero-shot: +0.2310 [+0.2152, +0.2461] p=0.000
- decision + atom labels (spot metering) - decision labels only: -0.2845 [-0.2994, -0.2704] p=0.000

## O1 difference-in-differences (FP clipped - FP visible), decision only - zero-shot (want > 0)

- +0.2162 [+0.1983, +0.2334] p=0.000

## O3 image AUROC, atom - decision only (non-inferior if CI low > -0.01)

- -0.0125 [-0.0182, -0.0076] p=0.000

## V42 on MMAD (#100): vs decision labels only

- O3' image AUROC (non-inferior if CI low > -0.01): -0.0041 [-0.0087, +0.0003]
- O2' clipped FP (want < 0): -0.2749 [-0.2896, -0.2613]
