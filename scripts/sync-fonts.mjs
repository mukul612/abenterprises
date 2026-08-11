/**
 * Font pipeline — builds the self-hosted WOFF2 set in public/fonts/.
 *
 * Design system §3 asks for three faces, Latin subset only:
 *   Archivo       display, variable, needs BOTH wght and wdth axes (wdth 108/112)
 *   IBM Plex Sans body, 400/500/600/700
 *   IBM Plex Mono numerals, 400/500
 *
 * Fontsource ships Archivo's dual-axis Latin file at 88 kB, which is too heavy for
 * the one face the brief says to preload. The design system only ever renders three
 * display settings — hero (700 / wdth 112), h1 (700 / wdth 108) and h2 (600 / wdth
 * 100) — so we instance both axes down to exactly that span. Both axes stay
 * continuous; only unreachable deltas are dropped. 88 kB -> 32 kB.
 *
 * Plex faces are already Latin-subset by Fontsource and are copied verbatim.
 *
 * Run: npm run fonts
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, copyFileSync, statSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public', 'fonts');
const modules = join(root, 'node_modules');

// Google Fonts "latin" range, plus the arrow and bullet glyphs our copy uses.
const UNICODES = [
  'U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA',
  'U+02DC', 'U+0304', 'U+0308', 'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122',
  'U+2190-2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD',
].join(',');

const kb = (p) => `${(statSync(p).size / 1024).toFixed(1)} kB`;

mkdirSync(out, { recursive: true });

/* ── Archivo: instance axis ranges, then subset ─────────────────────────── */
const archivoSrc = join(modules, '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2');
const archivoTmp = join(out, '.archivo-instanced.ttf');
const archivoOut = join(out, 'archivo-latin-var.woff2');

console.log('Archivo  source          ', kb(archivoSrc));

// instancer needs an uncompressed face; decompile the woff2 first
execFileSync('python3', ['-c', `
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
f = TTFont(sys.argv[1])
f.flavor = None
instancer.instantiateVariableFont(f, {"wght": (600, 700, 700), "wdth": (100, 112, 112)}, inplace=True)
f.save(sys.argv[2])
`, archivoSrc, archivoTmp], { stdio: 'inherit' });

execFileSync('python3', ['-m', 'fontTools.subset', archivoTmp,
  `--unicodes=${UNICODES}`,
  '--layout-features=kern,liga,calt,tnum,frac,ccmp,locl,mark,mkmk',
  '--flavor=woff2',
  '--with-zopfli',
  '--desubroutinize',
  '--no-hinting',
  `--output-file=${archivoOut}`,
], { stdio: 'inherit' });

rmSync(archivoTmp, { force: true });
console.log('Archivo  instanced+subset', kb(archivoOut));

/* ── IBM Plex: copy the Latin subsets Fontsource already ships ──────────── */
const plex = [
  ['@fontsource/ibm-plex-sans', 'ibm-plex-sans', [400, 500, 600, 700]],
  ['@fontsource/ibm-plex-mono', 'ibm-plex-mono', [400, 500]],
];

for (const [pkg, name, weights] of plex) {
  for (const w of weights) {
    const file = `${name}-latin-${w}-normal.woff2`;
    const dest = join(out, file);
    copyFileSync(join(modules, pkg, 'files', file), dest);
    console.log(`${name}-${w}`.padEnd(24), kb(dest));
  }
}

console.log('\nFonts written to public/fonts/');
