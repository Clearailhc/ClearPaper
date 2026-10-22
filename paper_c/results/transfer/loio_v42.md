# E5 leave-one-industry-out (InspecSafe, Qwen3-VL-8B)

Trained without the held-out industry; calibrated on val images of the other industries only; tested on the held-out industry's test images.

## held out: coal_conveyor (test n=299, hazards 84; val used 445)

| system | acc | AUROC | hazard recall | false alarm | RPS |
|---|---|---|---|---|---|
| zero-shot direct | 0.783 | 0.942 | 0.810 | 0.107 | 0.1132 |
| zero-shot PRISM | 0.856 | 0.974 | 0.905 | 0.056 | 0.0696 |
| Direct-SFT (saw this industry) | 0.916 | 1.000 | 0.964 | 0.000 | 0.0289 |
| PRISM-SFT (saw this industry) | 0.916 | 0.999 | 0.976 | 0.023 | 0.0281 |
| Direct-LOIO | 0.826 | 0.990 | 1.000 | 0.121 | 0.0969 |
| PRISM-LOIO | 0.896 | 0.993 | 0.988 | 0.051 | 0.0550 |
| PRISM-LOIO V26 | 0.873 | 0.997 | 0.845 | 0.009 | 0.0440 |
| PRISM-LOIO V42 | 0.880 | 0.995 | 0.893 | 0.000 | 0.0429 |
| PRISM-LOIO latent MIL | 0.886 | 0.994 | 0.976 | 0.037 | 0.0434 |

PRISM-LOIO latent MIL - Direct-LOIO accuracy: +0.060 [+0.013, +0.107] p=0.015

PRISM-LOIO V26 - Direct-LOIO accuracy: +0.047 [-0.003, +0.097] p=0.073

PRISM-LOIO V42 - Direct-LOIO accuracy: +0.054 [+0.003, +0.100] p=0.036

PRISM-LOIO - Direct-LOIO accuracy: +0.070 [+0.037, +0.107] p=0.000; on hazard images: +0.071 [+0.000, +0.155] p=0.089

## held out: oil_gas (test n=245, hazards 74; val used 456)

| system | acc | AUROC | hazard recall | false alarm | RPS |
|---|---|---|---|---|---|
| zero-shot direct | 0.804 | 0.933 | 0.622 | 0.029 | 0.1125 |
| zero-shot PRISM | 0.841 | 0.947 | 0.554 | 0.029 | 0.0938 |
| Direct-SFT (saw this industry) | 0.988 | 1.000 | 0.959 | 0.000 | 0.0085 |
| PRISM-SFT (saw this industry) | 0.971 | 1.000 | 0.919 | 0.000 | 0.0150 |
| Direct-LOIO | 0.829 | 0.999 | 0.959 | 0.023 | 0.0615 |
| PRISM-LOIO | 0.955 | 1.000 | 0.851 | 0.000 | 0.0256 |
| PRISM-LOIO V26 | 0.869 | 0.958 | 0.635 | 0.000 | 0.0786 |
| PRISM-LOIO V42 | 0.898 | 0.972 | 0.716 | 0.012 | 0.0507 |
| PRISM-LOIO closed-world labels | 0.898 | 0.980 | 0.662 | 0.000 | 0.0698 |
| PRISM-LOIO PU (closed-world + Elkan-Noto) | 0.898 | 0.980 | 0.676 | 0.000 | 0.0695 |
| PRISM-LOIO latent MIL | 0.918 | 0.974 | 0.784 | 0.012 | 0.0508 |

PRISM-LOIO closed-world labels - Direct-LOIO accuracy: +0.069 [+0.024, +0.118] p=0.004

PRISM-LOIO PU (closed-world + Elkan-Noto) - Direct-LOIO accuracy: +0.069 [+0.024, +0.118] p=0.004

PRISM-LOIO latent MIL - Direct-LOIO accuracy: +0.090 [+0.049, +0.135] p=0.000

PRISM-LOIO V26 - Direct-LOIO accuracy: +0.041 [+0.000, +0.082] p=0.080

PRISM-LOIO V42 - Direct-LOIO accuracy: +0.069 [+0.024, +0.114] p=0.003

PRISM-LOIO - Direct-LOIO accuracy: +0.127 [+0.078, +0.176] p=0.000; on hazard images: +0.365 [+0.230, +0.486] p=0.000

## held out: tunnel (test n=316, hazards 72; val used 429)

| system | acc | AUROC | hazard recall | false alarm | RPS |
|---|---|---|---|---|---|
| zero-shot direct | 0.918 | 1.000 | 1.000 | 0.012 | 0.0326 |
| zero-shot PRISM | 0.921 | 0.998 | 0.972 | 0.025 | 0.0375 |
| Direct-SFT (saw this industry) | 0.978 | 1.000 | 1.000 | 0.000 | 0.0084 |
| PRISM-SFT (saw this industry) | 0.956 | 1.000 | 1.000 | 0.000 | 0.0146 |
| Direct-LOIO | 0.934 | 1.000 | 1.000 | 0.000 | 0.0190 |
| PRISM-LOIO | 0.905 | 1.000 | 1.000 | 0.000 | 0.0310 |
| PRISM-LOIO V26 | 0.892 | 0.992 | 0.958 | 0.033 | 0.0526 |
| PRISM-LOIO V42 | 0.915 | 1.000 | 0.986 | 0.004 | 0.0270 |
| PRISM-LOIO closed-world labels | 0.896 | 0.999 | 0.986 | 0.033 | 0.0398 |
| PRISM-LOIO PU (closed-world + Elkan-Noto) | 0.892 | 0.996 | 0.986 | 0.037 | 0.0457 |
| PRISM-LOIO latent MIL | 0.937 | 1.000 | 0.986 | 0.012 | 0.0229 |

PRISM-LOIO closed-world labels - Direct-LOIO accuracy: -0.038 [-0.082, +0.003] p=0.093

PRISM-LOIO PU (closed-world + Elkan-Noto) - Direct-LOIO accuracy: -0.041 [-0.086, +0.000] p=0.069

PRISM-LOIO latent MIL - Direct-LOIO accuracy: +0.003 [-0.035, +0.041] p=0.973

PRISM-LOIO V26 - Direct-LOIO accuracy: -0.041 [-0.082, +0.000] p=0.066

PRISM-LOIO V42 - Direct-LOIO accuracy: -0.019 [-0.060, +0.022] p=0.410

PRISM-LOIO - Direct-LOIO accuracy: -0.028 [-0.047, -0.013] p=0.000; on hazard images: -0.125 [-0.208, -0.056] p=0.000

## held out: power (test n=213, hazards 21; val used 472)

| system | acc | AUROC | hazard recall | false alarm | RPS |
|---|---|---|---|---|---|
| zero-shot direct | 0.939 | 0.995 | 0.667 | 0.000 | 0.0216 |
| zero-shot PRISM | 0.967 | 0.993 | 0.810 | 0.010 | 0.0168 |
| Direct-SFT (saw this industry) | 0.995 | 1.000 | 1.000 | 0.000 | 0.0017 |
| PRISM-SFT (saw this industry) | 0.991 | 1.000 | 1.000 | 0.000 | 0.0030 |
| Direct-LOIO | 0.981 | 1.000 | 1.000 | 0.000 | 0.0043 |
| PRISM-LOIO | 0.986 | 1.000 | 1.000 | 0.000 | 0.0052 |
| PRISM-LOIO V26 | 0.972 | 0.955 | 0.905 | 0.000 | 0.0118 |
| PRISM-LOIO V42 | 0.977 | 1.000 | 0.952 | 0.000 | 0.0077 |
| PRISM-LOIO latent MIL | 0.981 | 1.000 | 0.952 | 0.000 | 0.0066 |

PRISM-LOIO latent MIL - Direct-LOIO accuracy: +0.000 [-0.023, +0.023] p=1.000

PRISM-LOIO V26 - Direct-LOIO accuracy: -0.009 [-0.033, +0.009] p=0.535

PRISM-LOIO V42 - Direct-LOIO accuracy: -0.005 [-0.028, +0.014] p=0.815

PRISM-LOIO - Direct-LOIO accuracy: +0.005 [-0.014, +0.023] p=0.848; on hazard images: +0.048 [-0.143, +0.238] p=0.820

## pooled over the held-out folds

| system | acc | AUROC | hazard recall | false alarm |
|---|---|---|---|---|
| zero-shot direct | 0.858 | 0.957 | 0.797 | 0.038 |
| zero-shot PRISM | 0.894 | 0.969 | 0.813 | 0.030 |
| Direct-SFT (saw this industry) | 0.966 | 1.000 | 0.976 | 0.000 |
| PRISM-SFT (saw this industry) | 0.955 | 0.998 | 0.968 | 0.006 |
| Direct-LOIO | 0.889 | 0.991 | 0.988 | 0.036 |
| PRISM-LOIO | 0.930 | 0.992 | 0.952 | 0.013 |
| PRISM-LOIO V26 | 0.897 | 0.967 | 0.821 | 0.012 |
| PRISM-LOIO V42 | 0.913 | 0.984 | 0.873 | 0.004 |
| PRISM-LOIO latent MIL | 0.927 | 0.991 | 0.920 | 0.016 |
| PRISM-LOIO closed-world labels | 0.897 | 0.973 | 0.822 | 0.019 |
| PRISM-LOIO PU (closed-world + Elkan-Noto) | 0.895 | 0.972 | 0.829 | 0.022 |

pooled PRISM-LOIO V42 - Direct-LOIO accuracy: +0.024 [+0.003, +0.047] p=0.034
pooled PRISM-LOIO V42 - PRISM-LOIO (level-fill) accuracy: -0.017 [-0.035, +0.001] p=0.080

pooled V26 - Direct-LOIO accuracy: +0.008 [-0.013, +0.030] p=0.463
pooled V26 - PRISM-LOIO (level-fill) accuracy: -0.033 [-0.051, -0.015] p=0.002

pooled latent MIL - Direct-LOIO accuracy: +0.038 [+0.019, +0.059] p=0.000
pooled latent MIL - PRISM-LOIO (level-fill) accuracy: -0.003 [-0.018, +0.013] p=0.771

(closed-world rows, if present, pool only the folds that were run)
pooled PRISM-LOIO - Direct-LOIO accuracy: +0.041 [+0.025, +0.057] p=0.000; hazard images: +0.100 [+0.044, +0.155] p=0.001
