/**
 * Builds a self-contained review copy of /design-system/ for publishing.
 *
 * It is generated from the real dist/ output rather than hand-written, so what
 * gets reviewed is exactly what the site renders — same tokens, same component,
 * same CSS. Artifacts run under a strict CSP that blocks every external host, so
 * the stylesheet is inlined and the WOFF2 faces are embedded as data URIs.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const html = readFileSync(join(dist, 'design-system/index.html'), 'utf8');

/* Collect the built stylesheet(s) in document order */
const hrefs = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]);
let css = hrefs.map((h) => readFileSync(join(dist, h.replace(/^\//, '')), 'utf8')).join('\n');

/* Embed each face the stylesheet references */
const fontDir = join(root, 'public/fonts');
for (const file of readdirSync(fontDir).filter((f) => f.endsWith('.woff2'))) {
  const b64 = readFileSync(join(fontDir, file)).toString('base64');
  css = css.replaceAll(`/fonts/${file}`, `data:font/woff2;base64,${b64}`);
}

/* The artifact host supplies doctype/html/head/body, so emit only page content */
const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? '';

const out = `<title>AB Induction — Design System</title>
<style>
${css}
</style>
${body.trim()}
`;

const target = join(root, 'artifacts/design-system.html');
writeFileSync(target, out);

const kb = (n) => `${(n / 1024).toFixed(0)} kB`;
console.log(`design-system.html  ${kb(Buffer.byteLength(out))}  (css ${kb(css.length)}, ${hrefs.length} sheet(s))`);
