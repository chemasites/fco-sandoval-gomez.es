---
name: release-content
description: Use to publish pending content to production ("publish", "release content", "publica el artículo").
---

1. Run the `verify-site` checks; all must pass.
2. Commit with Conventional Commits (`feat: add articulo <slug>`). Never commit `.en.md` or `.it.md` for a post.
3. Push to `main`.
4. Watch `Check website` and `Build and deploy GH Pages`: `gh run list --limit 5`, then `gh run watch <id>`.
5. Confirm live: `curl -sI https://fco-sandoval-gomez.es/<section>/<slug>/ | head -1` returns 200, and `/en/<section>/` and `/it/<section>/` list the post.

If a run fails, report the run URL and failing step. Do not retry blindly.
