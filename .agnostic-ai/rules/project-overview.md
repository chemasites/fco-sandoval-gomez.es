---
name: project-overview
description: What the project is and how to run it.
globs: "**/*"
alwaysApply: true
---

Portfolio of Francisco Sandoval Gómez (architecture and heritage conservation), built with [Zola](https://www.getzola.org/) >= 0.21.0. Every push to `main` deploys to GitHub Pages (`.github/workflows/main.yml`).

- `zola serve`: dev server at http://127.0.0.1:1111/
- `zola build`: build into `public/` (gitignored)
- `zola check`: validate content and internal links

Layout:

- `config.toml`: site config, languages, all UI strings in `[extra.i18n.*]`
- `content/`: `articulos/`, `investigacion/`, `trabajos/`, `publicaciones/`, top-level pages
- `templates/`: Tera templates with `macros/`, `partials/`, `shortcodes/`
- `sass/style.scss`: the only stylesheet
- `static/`: assets (`static/processed_images/` is generated, gitignored)
- `GUIA.md`: Spanish guide to creating content through issue forms
