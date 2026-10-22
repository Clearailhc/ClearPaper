# V36: rule edits re-scored against blind human labels (InspecSafe)

items 128 (changed 107, controls 21); human = derived new level on changed items: 0.879

| system | changed: vs human | changed: vs derived | all 128: vs human | R1 (human) | R2 (human) | R3 (human) |
|---|---|---|---|---|---|---|
| LUX zero-shot | 0.832 | 0.785 | 0.844 | 0.958 | 0.651 | 0.938 |
| verdict-only (V34) | 0.850 | 0.794 | 0.875 | 0.958 | 0.721 | 0.875 |
| LUX level-fill SFT s0 | 0.804 | 0.748 | 0.836 | 0.958 | 0.605 | 0.875 |
| LUX level-fill SFT s1 | 0.701 | 0.645 | 0.750 | 0.958 | 0.302 | 1.000 |
| LUX (V42) s0 | 0.888 | 0.860 | 0.891 | 0.958 | 0.767 | 1.000 |
| LUX (V42) s1 | 0.879 | 0.860 | 0.898 | 0.938 | 0.767 | 1.000 |
| Direct-SFT, old prompt | 0.215 | 0.131 | 0.344 | 0.062 | 0.233 | 0.625 |
| Direct-SFT, new rule in prompt | 0.262 | 0.168 | 0.383 | 0.167 | 0.233 | 0.625 |
| zero-shot direct, new rule in prompt | 0.421 | 0.393 | 0.492 | 0.583 | 0.372 | 0.062 |
| rule-conditioned Direct-SFT, new rule in prompt | 0.449 | 0.421 | 0.523 | 0.417 | 0.349 | 0.812 |
| Direct-SFT + 200 relabelled, new prompt | 0.673 | 0.579 | 0.719 | 0.896 | 0.395 | 0.750 |
| Direct-SFT retrained on relabelled train (upper bound) | 0.570 | 0.514 | 0.641 | 0.812 | 0.442 | 0.188 |

## paired bootstrap on the changed items, against the human label

- LUX level-fill SFT s0 - Direct-SFT, new rule in prompt: +0.542 [+0.430, +0.645] p=0.000
- LUX level-fill SFT s0 - rule-conditioned Direct-SFT, new rule in prompt: +0.355 [+0.252, +0.458] p=0.000
- LUX level-fill SFT s0 - Direct-SFT retrained on relabelled train (upper bound): +0.234 [+0.140, +0.327] p=0.000
- LUX (V42) s0 - Direct-SFT, new rule in prompt: +0.626 [+0.514, +0.729] p=0.000
- LUX (V42) s0 - rule-conditioned Direct-SFT, new rule in prompt: +0.439 [+0.336, +0.533] p=0.000
- LUX (V42) s0 - Direct-SFT retrained on relabelled train (upper bound): +0.318 [+0.215, +0.411] p=0.000
