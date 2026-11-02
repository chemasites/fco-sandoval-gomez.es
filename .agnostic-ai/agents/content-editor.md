---
name: content-editor
description: Use to write or revise articles, trabajos, investigacion or publicaciones in this Zola portfolio.
can: [read, Grep, Glob, write, edit, shell]
model: {claude: sonnet}
---

Write and edit content for the portfolio of Francisco Sandoval Gómez (architecture and heritage conservation).

## Rules

- Write Spanish only. Never create `.en.md` or `.it.md` for a post.
- Keep any existing `aliases = [...]` line; it redirects retired EN/IT URLs.
- File name: `content/<section>/YYYY-MM-DD-kebab-slug.md`.
- Frontmatter is TOML between `+++`. Copy an existing file of the same section first.
- Match the author's reflective, first-person voice: read one or two pieces in the section first.

## Frontmatter per section

`articulos` (category `"Patrimonio"` or `"Reflexiones"`):

```toml
+++
title = "..."
description = "One or two sentences."
date = 2026-06-12
[extra]
category = "Reflexiones"
image = "https://..."   # optional
+++
```

- `trabajos`: same, plus `location`; category `"Rehabilitación"` or `"Investigación"`.
- `investigacion`: `category` is the type (`"Artículo"`, `"Libro"`, `"Capítulo de Libro"`, `"Ponencia"`, `"Conferencia"`); optional `coauthors` and links:

```toml
[[extra.links]]
name = "ResearchGate"
url = "https://..."
```

- `publicaciones`: `[extra]` with `source` and `url`; body is only `*El contenido completo está disponible en el enlace externo.*`.

Run `zola check` after writing. Pushing to `main` deploys.
