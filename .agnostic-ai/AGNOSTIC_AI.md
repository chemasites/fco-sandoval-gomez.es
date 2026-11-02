# fco-sandoval-gomez.es

Portfolio of Francisco Sandoval Gómez (architecture and heritage conservation), built with Zola 0.21+. Spanish is the main language at `/`; static pages also exist in `/en/` and `/it/`.

- Dev server: `zola serve` (http://127.0.0.1:1111/). Build and link check: `zola build`, `zola check`.
- Checks (from README): `npm test --prefix .github/scripts -- --runInBand`, `python3 .github/scripts/check-translations.py`, `python3 .github/scripts/check-metadata.py`.
- Content in `content/`, templates in `templates/`, styles in `sass/style.scss`. Details in the rules under `.agnostic-ai/rules/`.
