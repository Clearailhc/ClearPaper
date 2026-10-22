# E5 leave-one-industry-out (InspecSafe, Qwen3-VL-8B)

Trained without the held-out industry; calibrated on val images of the other industries only; tested on the held-out industry's test images.

## held out: tunnel (test n=316, hazards 72; val used 429)

| system | acc | AUROC | hazard recall | false alarm | RPS |
|---|---|---|---|---|---|
| zero-shot direct | 0.918 | 1.000 | 1.000 | 0.012 | 0.0326 |
| zero-shot PRISM | 0.921 | 0.998 | 0.972 | 0.025 | 0.0375 |
| Direct-SFT (saw this industry) | 0.978 | 1.000 | 1.000 | 0.000 | 0.0084 |
| PRISM-SFT (saw this industry) | 0.956 | 1.000 | 1.000 | 0.000 | 0.0146 |
| Direct-LOIO | 0.839 | 1.000 | 1.000 | 0.107 | 0.0673 |
| PRISM-LOIO | 0.896 | 1.000 | 1.000 | 0.012 | 0.0400 |
| PRISM-LOIO closed-world labels | 0.896 | 0.999 | 0.986 | 0.033 | 0.0398 |
| PRISM-LOIO PU (closed-world + Elkan-Noto) | 0.892 | 0.996 | 0.986 | 0.037 | 0.0457 |
| PRISM-LOIO latent MIL | 0.937 | 1.000 | 0.986 | 0.012 | 0.0229 |

PRISM-LOIO closed-world labels - Direct-LOIO accuracy: +0.057 [+0.016, +0.101] p=0.007

PRISM-LOIO PU (closed-world + Elkan-Noto) - Direct-LOIO accuracy: +0.054 [+0.013, +0.098] p=0.012

PRISM-LOIO latent MIL - Direct-LOIO accuracy: +0.098 [+0.054, +0.146] p=0.000

PRISM-LOIO - Direct-LOIO accuracy: +0.057 [+0.009, +0.108] p=0.019; on hazard images: -0.069 [-0.236, +0.097] p=0.469

## held out: oil_gas (test n=245, hazards 74; val used 456)

| system | acc | AUROC | hazard recall | false alarm | RPS |
|---|---|---|---|---|---|
| zero-shot direct | 0.804 | 0.933 | 0.622 | 0.029 | 0.1125 |
| zero-shot PRISM | 0.841 | 0.947 | 0.554 | 0.029 | 0.0938 |
| Direct-SFT (saw this industry) | 0.988 | 1.000 | 0.959 | 0.000 | 0.0085 |
| PRISM-SFT (saw this industry) | 0.971 | 1.000 | 0.919 | 0.000 | 0.0150 |
| Direct-LOIO | 0.845 | 0.993 | 0.959 | 0.000 | 0.0496 |
| PRISM-LOIO | 0.947 | 0.999 | 0.959 | 0.006 | 0.0171 |
| PRISM-LOIO closed-world labels | 0.898 | 0.980 | 0.662 | 0.000 | 0.0698 |
| PRISM-LOIO PU (closed-world + Elkan-Noto) | 0.898 | 0.980 | 0.676 | 0.000 | 0.0695 |
| PRISM-LOIO latent MIL | 0.918 | 0.974 | 0.784 | 0.012 | 0.0508 |

PRISM-LOIO closed-world labels - Direct-LOIO accuracy: +0.053 [+0.008, +0.098] p=0.023

PRISM-LOIO PU (closed-world + Elkan-Noto) - Direct-LOIO accuracy: +0.053 [+0.008, +0.098] p=0.023

PRISM-LOIO latent MIL - Direct-LOIO accuracy: +0.073 [+0.033, +0.118] p=0.001

PRISM-LOIO - Direct-LOIO accuracy: +0.102 [+0.065, +0.147] p=0.000; on hazard images: +0.351 [+0.243, +0.459] p=0.000

## pooled over the held-out folds

| system | acc | AUROC | hazard recall | false alarm |
|---|---|---|---|---|
| PRISM-LOIO closed-world labels | 0.897 | 0.973 | 0.822 | 0.019 |
| PRISM-LOIO PU (closed-world + Elkan-Noto) | 0.895 | 0.972 | 0.829 | 0.022 |
| PRISM-LOIO latent MIL | 0.929 | 0.989 | 0.884 | 0.012 |
