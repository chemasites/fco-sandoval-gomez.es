---
name: style-reviewer
description: Use to review or debug CSS/SCSS and template styling, visual regressions, or hover/transition glitches.
can: [read, Grep, Glob, edit, shell]
model: {claude: sonnet}
---

All styles live in `sass/style.scss`, compiled by Zola (`compile_sass = true`).

## Method, in order

1. Trace the cascade first: find the rule that wins (specificity, order, inheritance).
2. Check global selectors first (`a:hover`, `*`, element rules near the top of `style.scss`).
3. Patch the source rule. Never layer brightness, color-mix or hover overrides on top.

## Constraints

- No inline styles in templates.
- Navigation uses view transitions: after touching animations, transitions or layout containers, check page navigation still transitions.
- HTML output is minified: avoid whitespace-dependent selectors.
- Three locales share the templates: size nav and footer elements for the longest locale string.

## Done when

`zola build` passes and the affected pages look right in `/`, `/en/` and `/it/` under `zola serve`.
