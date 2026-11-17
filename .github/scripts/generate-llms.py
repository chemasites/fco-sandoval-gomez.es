"""Write public/llms.txt, a plain-text index of the built site for AI agents."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import sys
import xml.etree.ElementTree as ET

SECTIONS = [
    ("articulos", "Artículos"),
    ("trabajos", "Trabajos"),
    ("investigacion", "Investigación"),
    ("publicaciones", "Publicaciones externas"),
]
PAGES = ["sobre-mi"]


class Meta(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta":
            key = attrs.get("name") or attrs.get("property")
            if key and key not in self.meta:
                self.meta[key] = attrs.get("content") or ""


def read_meta(root, url):
    file = root / unquote(urlparse(url).path.lstrip("/")) / "index.html"
    parser = Meta()
    parser.feed(file.read_text())
    return parser.meta


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "public")
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [loc.text for loc in ET.parse(root / "sitemap.xml").findall(".//s:loc", namespace)]
    # Posts are published in Spanish only; EN/IT URLs repeat the interface, not the content.
    spanish = [url for url in urls if not urlparse(url).path.startswith(("/en/", "/it/"))]
    home = next(url for url in spanish if urlparse(url).path in ("", "/"))
    home_meta = read_meta(root, home)

    lines = [
        f"# {home_meta.get('og:site_name', 'Francisco Sandoval Gómez')}",
        "",
        f"> {home_meta.get('description', '')}",
        "",
        "Portfolio of an architect specialised in architectural heritage conservation. "
        "Content is published in Spanish; the interface is also available in English (/en/) and Italian (/it/).",
        "",
        "## Sobre el autor",
        "",
    ]
    for slug in PAGES:
        url = next((u for u in spanish if urlparse(u).path.strip("/") == slug), None)
        if url:
            meta = read_meta(root, url)
            lines.append(f"- [{meta.get('og:title', slug)}]({url}): {meta.get('description', '')}")

    for slug, title in SECTIONS:
        entries = [u for u in spanish if urlparse(u).path.strip("/").split("/")[0] == slug and urlparse(u).path.strip("/").count("/") == 1]
        if not entries:
            continue
        lines += ["", f"## {title}", ""]
        dated = sorted(((read_meta(root, url), url) for url in entries), key=lambda item: item[0].get("article:published_time", ""), reverse=True)
        for meta, url in dated:
            description = meta.get("description", "").replace("\n", " ").strip()
            lines.append(f"- [{meta.get('og:title', url)}]({url}){': ' + description if description else ''}")

    lines += ["", "## Optional", "", f"- [Atom feed]({home.rstrip('/')}/atom.xml)", f"- [Sitemap]({home.rstrip('/')}/sitemap.xml)", ""]
    (root / "llms.txt").write_text("\n".join(lines))
    print(f"Wrote llms.txt with {sum(1 for line in lines if line.startswith('- ['))} links.")


if __name__ == "__main__":
    main()
