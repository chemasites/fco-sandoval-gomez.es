---
name: content-and-translations
description: Content model, languages and translations.
globs: "content/**/*.md"
alwaysApply: true
---

Spanish is served at `/`, EN at `/en/`, IT at `/it/`.

- Posts are Spanish-only: one `name.md`, never `.en.md` or `.it.md` (`.github/scripts/check-translations.py` fails otherwise).
- Sections: `articulos` (opinion), `investigacion` (type, year, co-authors, link), `trabajos` (category, location, year), `publicaciones` (source, URL).
- Static pages (`_index.md`, `sobre-mi.md`, `contacto.md`, `legal.md`, `404.md`) and the four section `_index.md` exist as `name.md`, `name.en.md` and `name.it.md`. EN/IT section pages list the Spanish posts under the `spanish_only_note` string, unsorted and unpaginated.
- Posts published before September 2026 carry `aliases` for retired `/en/` and `/it/` URLs. Keep them.
- Content normally arrives through GitHub issue forms (`.github/workflows/crear-contenido.yml`); fields are in `GUIA.md`.
- Translate static pages by hand; no workflow calls a translation service. Change a Spanish static page and its `.en.md` and `.it.md` in the same commit. A new top-level page needs all three variants.
- UI strings live in `config.toml` under `[extra.i18n.es]`, `[extra.i18n.en]`, `[extra.i18n.it]`. Add every new key to all three.
