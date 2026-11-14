const path = require('path');

const ASSET_URL = /https:\/\/github\.com\/user-attachments\/assets\/([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})/g;
const ASSET_FILE = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(?:jpg|png|webp)$/;
const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_WIDTH = 1600;

function resizeImage(buffer) {
  return require('sharp')(buffer).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }).toBuffer();
}

async function download(url, fetch) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  const extension = EXTENSIONS[(response.headers.get('content-type') || '').split(';')[0].trim()];
  if (!response.ok || !extension) throw new Error(`HTTP ${response.status}, ${response.headers.get('content-type')}`);
  return { extension, buffer: Buffer.from(await response.arrayBuffer()) };
}

// Copies the images dragged into the form into static/images, resized, and
// points the post at the copies. An image that cannot be fetched or resized
// keeps its GitHub URL, so the post still publishes.
async function localizeImages(result, { fetch = globalThis.fetch, fs = require('fs'), resize = resizeImage, staticRoot = 'static', log = console.warn } = {}) {
  const slug = path.basename(result.filename, '.md');
  const folder = path.posix.join('images', result.contentType, slug);
  const directory = path.join(staticRoot, folder);
  const stored = new Map();
  if (fs.existsSync(directory)) {
    for (const name of fs.readdirSync(directory)) {
      if (ASSET_FILE.test(name)) stored.set(path.parse(name).name, name);
    }
  }

  const assets = new Map();
  for (const [url, id] of result.content.matchAll(ASSET_URL)) assets.set(url, id);

  const local = new Map();
  for (const [url, id] of assets) {
    if (!stored.has(id)) {
      try {
        const { extension, buffer } = await download(url, fetch);
        const resized = await resize(buffer);
        fs.mkdirSync(directory, { recursive: true });
        fs.writeFileSync(path.join(directory, `${id}.${extension}`), resized);
        stored.set(id, `${id}.${extension}`);
      } catch (error) {
        log(`Image kept on GitHub: ${url} (${error.message})`);
        continue;
      }
    }
    local.set(url, path.posix.join(folder, stored.get(id)));
  }

  const ids = new Set(assets.values());
  for (const [id, name] of stored) {
    if (!ids.has(id) && !result.content.includes(`${folder}/${name}`)) fs.rmSync(path.join(directory, name));
  }

  let content = result.content;
  for (const [url, file] of local) {
    // The front matter image is a path under static/; body images are site URLs.
    content = content.replace(`\nimage = "${url}"\n`, `\nimage = "${file}"\n`).replaceAll(url, `/${file}`);
  }
  if (content !== result.content) fs.writeFileSync(result.filename, content);
  return { ...result, content };
}

module.exports = { localizeImages };
