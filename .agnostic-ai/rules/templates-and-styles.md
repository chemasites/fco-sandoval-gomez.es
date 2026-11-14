---
name: templates-and-styles
description: Tera template and SCSS conventions.
globs: "templates/**/*.html,sass/**/*.scss"
alwaysApply: false
---

Templates:

- Pages extend `templates/base.html`. Reusable pieces go in `partials/` and Tera 2 components in `components/` (called as `{{ <cards.post_card post={page} /> }}`, no import).
- Components only see their parameters. Pass `config` data in explicitly, such as `i18n={config.extra.i18n}`.
- Content embeds `gallery`, `media` and `youtube` (`{% <media align="left"> %}...{% </media> %}`). Wrap their output in `compact`: Markdown parses component output again.
- `default(value=...)` does not replace `null`. Use `a or b` for optional page fields.
- Read user-facing text from `config.extra.i18n`, never hardcode it.
- Links respect the current `lang` (ES `/`, EN `/en/`, IT `/it/`).
- EN/IT listings read the Spanish section (`get_section` with `lang=config.default_language`); cards carry the post's `lang` attribute.

Styles:

- Everything lives in `sass/style.scss` (`compile_sass = true`). No inline styles.
- HTML is minified and navigation uses view transitions: check visual changes under `zola serve`.
- Find the root-cause rule first, including global selectors (`a:hover`, `*`). No surface patches.
