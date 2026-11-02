---
name: new-content
description: Use to add a new artículo, trabajo, investigación or publicación ("new article", "nuevo artículo", "new content").
---

1. Get the section: `articulos`, `trabajos`, `investigacion` or `publicaciones` (field meaning in `GUIA.md`).
2. Read a recent file in that section and copy its frontmatter shape.
3. Write `content/<section>/YYYY-MM-DD-kebab-slug.md` in Spanish. Never add `.en.md` or `.it.md`.
4. Run `zola check`. Offer `zola serve` to preview.

Required fields:

- `articulos`: title, description, category (`Patrimonio` or `Reflexiones`).
- `trabajos`: title, description, category (`Rehabilitación` or `Investigación`), location.
- `investigacion`: title, description, category (publication type); optional coauthors and `[[extra.links]]`.
- `publicaciones`: title, description, source, url; fixed body linking the external page.

`image` and a body are optional where not listed as fixed.
