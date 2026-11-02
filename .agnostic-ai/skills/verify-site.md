---
name: verify-site
description: Use before a push to validate build, links and locale parity ("verify site", "check the site", "i18n check").
---

1. `zola check`: content, frontmatter, internal links.
2. `zola build`: must succeed (output `public/`, gitignored).
3. `python3 .github/scripts/check-translations.py` (Python 3.11+):
   - Static pages and section `_index.md` need `name.en.md` and `name.it.md`.
   - Posts (`articulos`, `investigacion`, `trabajos`, `publicaciones`) have none.
   - Every `[extra.i18n.es]` key in `config.toml` exists in `[extra.i18n.en]` and `[extra.i18n.it]`.
4. `python3 .github/scripts/check-metadata.py`: metadata and hreflang links.
5. Report failures with file paths.
