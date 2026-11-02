---
name: templates-and-styles
description: Tera template and SCSS conventions.
globs: "templates/**/*.html,sass/**/*.scss"
alwaysApply: false
---

Templates:

- Pages extend `templates/base.html`. Reusable pieces go in `partials/` and `macros/`; snippets embedded in content go in `shortcodes/`.
- Read user-facing text from `config.extra.i18n`, never hardcode it.
- Links respect the current `lang` (ES `/`, EN `/en/`, IT `/it/`).
- EN/IT listings read the Spanish section (`get_section` without `lang`); cards carry the post's `lang` attribute.

Styles:

- Everything lives in `sass/style.scss` (`compile_sass = true`). No inline styles.
- HTML is minified and navigation uses view transitions: check visual changes under `zola serve`.
- Find the root-cause rule first, including global selectors (`a:hover`, `*`). No surface patches.
