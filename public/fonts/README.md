# Self-hosted fonts

The company profile uses **Glacial Indifference** for body copy. It is a free (SIL OFL) font but is not on
Google Fonts, so the site ships with **Jost** as the default body font (a close geometric match).

To use the original, drop these files here and pick "Glacial Indifference" in the editor's Theme panel:

- `GlacialIndifference-Regular.woff2`
- `GlacialIndifference-Bold.woff2`
- `GlacialIndifference-Italic.woff2`

(`.otf` also works; adjust `@font-face` in `src/app/globals.css` if you use a different extension.)
