# LUX - CVPR 2027 submission (LaTeX)

Built on the official CVPR author kit (`cvpr.sty`, `ieeenat_fullname.bst`, `rebuttal.tex`; github.com/cvpr-org/author-kit,
main branch of 2026-05-28 = CVPR 2026 kit + fixes). The 2027 kit is not released yet - replace `cvpr.sty` when it is.
The untouched template and its formatting guide are in `kit_reference/`.

## CVPR 2027 (official call for papers, checked 2026-10-20)
- Paper enrollment **Nov 10 2026**, submission **Nov 16 2026**, supplementary **Nov 23 2026** (all 11:59 PM AoE; no extension), OpenReview.
- Every co-author needs an up-to-date OpenReview profile (non-institutional e-mails: moderation can take two weeks).
- 2026 rules (2027 author guidelines not yet online): **8 pages including figures and tables**, references extra;
  over-length or non-template or non-anonymous papers are rejected without review; no external links; code may only be
  promised ("will be released"); rebuttal one page with `rebuttal.tex`; citations of non-existent material lead to rejection.
- Dual submission window Nov 16 2026 - Feb 22 2027; work online after Sep 15 2026 counts as contemporaneous.

## Layout
- `main.tex` - review mode (`\usepackage[review]{cvpr}`), confYear 2027, supplementary compiled after the references.
- `preamble.tex` - packages, theorem environments, `\lux`, drafting marks `\TBD{}` (red) and `\FIG{}` (blue).
  **Before submission:** uncomment the two `\renewcommand` lines to blank them, and check no TBD remains.
- `fig/teaser.tex` - Figure 1 (two-column teaser); drop the drawn figure as `figures/teaser.pdf`.
- `sec/0_abstract.tex` ... `sec/6_discussion.tex`, `sec/X_suppl.tex` - text; `refs.bib` - bibliography ("verify" entries
  still need checking against the published versions).
- Data behind every number: `../docs/research_log.md`, `../results/` (Figure 1: `../results/fig1_industrial/`).

## Compile
No TeX on this machine. Either upload the folder to Overleaf (pdfLaTeX), or install TeX locally and run
`latexmk -pdf main.tex`.
