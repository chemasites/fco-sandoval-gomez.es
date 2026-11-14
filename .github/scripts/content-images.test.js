const fs = require('fs');
const os = require('os');
const path = require('path');
const { localizeImages } = require('./content-images');

const asset = id => `https://github.com/user-attachments/assets/${id}`;
const HERO = '11111111-1111-4111-8111-111111111111';
const BODY = '22222222-2222-4222-8222-222222222222';
const GONE = '33333333-3333-4333-8333-333333333333';
const post = (...bodyIds) => `+++\ntitle = "Post"\n\n[extra]\nimage = "${asset(HERO)}"\n+++\n\n${bodyIds.map(id => `![foto](${asset(id)})`).join('\n\n')}\n`;

describe('localizeImages', () => {
  let root, options, fetched;
  const respond = (type, ok = true) => ({ ok, status: ok ? 200 : 404, headers: { get: () => type }, arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer });
  const run = content => {
    const filename = path.join(root, '2026-09-08-post.md');
    fs.writeFileSync(filename, content);
    return localizeImages({ filename, content, contentType: 'articulos' }, options);
  };
  const folder = () => path.join(root, 'static', 'images', 'articulos', 'post');

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'content-images-'));
    fetched = [];
    options = {
      staticRoot: path.join(root, 'static'),
      log: () => {},
      resize: async buffer => Buffer.concat([buffer, Buffer.from('resized')]),
      fetch: async url => { fetched.push(url); return respond(url.endsWith(BODY) ? 'image/png' : 'image/jpeg'); },
    };
  });
  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  it('stores resized copies and points the post at them', async () => {
    const result = await run(post(BODY, BODY));
    expect(result.content).toContain(`image = "images/articulos/post/${HERO}.jpg"`);
    expect(result.content).toContain(`![foto](/images/articulos/post/${BODY}.png)`);
    expect(result.content).not.toContain('user-attachments');
    expect(fs.readFileSync(result.filename, 'utf8')).toBe(result.content);
    expect(fs.readFileSync(path.join(folder(), `${HERO}.jpg`), 'utf8')).toContain('resized');
    expect(fetched).toHaveLength(2);
  });

  it('reuses stored images on an edit and removes the ones no longer used', async () => {
    await run(post(BODY, GONE));
    fetched.length = 0;
    fs.writeFileSync(path.join(folder(), 'portada-manual.jpg'), 'manual');
    const result = await run(post(BODY));
    expect(fetched).toEqual([]);
    expect(result.content).toContain(`/images/articulos/post/${BODY}.png`);
    expect(fs.readdirSync(folder()).sort()).toEqual([`${HERO}.jpg`, `${BODY}.png`, 'portada-manual.jpg'].sort());
  });

  it.each([
    ['is not an image', async () => respond('video/mp4')],
    ['cannot be downloaded', async () => respond('image/jpeg', false)],
    ['times out', async () => { throw new Error('timeout'); }],
  ])('keeps the GitHub URL when the file %s', async (_, fetch) => {
    const content = post(BODY);
    const result = await run(content, options.fetch = fetch);
    expect(result.content).toBe(content);
    expect(fs.existsSync(folder())).toBe(false);
  });

  it('keeps the GitHub URL when the image cannot be resized', async () => {
    options.resize = async () => { throw new Error('unsupported image'); };
    expect((await run(post())).content).toBe(post());
  });
});
