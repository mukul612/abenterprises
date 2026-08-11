/**
 * Contrast audit — checks every colour pairing the design system actually puts
 * on screen against the floors it sets in §2: 4.5:1 body, 3:1 large text and UI
 * borders. Run: npm run audit:contrast
 *
 * Reads the values straight out of src/styles/tokens.css so the audit can never
 * drift from the tokens it is auditing.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');

const T = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]),
);

const srgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lum = (h) =>
  srgb(h)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => {
  const [x, y] = [lum(T[a] ?? a), lum(T[b] ?? b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/** [foreground, background, floor, what it is] */
const PAIRS = [
  // Text on dark — §2 "never pure white, it glares against --steel-900"
  ['steel-100', 'steel-900', 4.5, 'body text on dark'],
  ['steel-100', 'steel-950', 4.5, 'body text on deepest'],
  ['steel-100', 'steel-800', 4.5, 'body text on raised card'],
  ['steel-300', 'steel-900', 4.5, 'secondary text on dark'],
  ['steel-300', 'steel-800', 4.5, 'secondary text on card'],
  ['steel-400', 'steel-900', 4.5, 'captions on dark [a11y remedy]'],
  ['steel-400', 'steel-950', 4.5, 'captions on deepest [a11y remedy]'],

  // Copper — §2 claims copper-500 passes on steel-900 but fails on zinc-50
  ['copper-500', 'steel-900', 4.5, 'copper link on dark'],
  ['copper-500', 'steel-950', 4.5, 'copper link on deepest'],
  ['copper-400', 'steel-800', 4.5, 'copper link on card [a11y remedy]'],
  ['copper-500', 'zinc-50', 4.5, 'copper-500 link on light (spec says FAILS)'],
  ['copper-700', 'zinc-50', 4.5, 'copper-700 link on light (spec remedy)'],
  ['copper-700', 'paper', 4.5, 'copper-700 link on paper'],

  // Primary button — §6 copper-500 fill, steel-950 text
  ['steel-950', 'copper-500', 4.5, 'primary button label'],
  ['steel-950', 'copper-400', 4.5, 'primary button label, hover [a11y remedy]'],

  // Secondary button — §6 1px border, steel-100 text
  ['steel-400', 'steel-900', 3.0, 'secondary button border [a11y remedy]'],

  // Focus ring — §6 2px copper, must clear BOTH grounds (SC 1.4.11, mandatory)
  ['copper-300', 'steel-900', 3.0, 'focus ring on dark'],
  ['copper-300', 'steel-950', 3.0, 'focus ring on deepest'],
  ['copper-300', 'steel-800', 3.0, 'focus ring on card'],
  ['copper-700', 'zinc-50', 3.0, 'focus ring on light [a11y remedy]'],
  ['copper-700', 'paper', 3.0, 'focus ring on paper [a11y remedy]'],

  // Body text on light sections
  ['steel-900', 'zinc-50', 4.5, 'body text on light'],
  ['steel-900', 'paper', 4.5, 'body text on paper'],
  ['steel-600', 'zinc-50', 4.5, 'secondary text on light'],

  // Division accents — §2 used as rules/eyebrows, i.e. large text + UI
  ['cherry-500', 'steel-900', 3.0, 'induction eyebrow/rule'],
  ['nickel-500', 'steel-900', 3.0, 'rectifier eyebrow/rule'],
  ['beam-500', 'steel-900', 3.0, 'laser eyebrow/rule'],
  ['cherry-700', 'zinc-50', 3.0, 'induction rule on light'],
  ['nickel-700', 'zinc-50', 3.0, 'rectifier rule on light'],
  ['beam-700', 'zinc-50', 3.0, 'laser rule on light'],

  // Semantic — these carry meaning as text, so 4.5 applies
  ['ok', 'steel-900', 4.5, 'success text on dark'],
  ['warn', 'steel-900', 4.5, 'warning text on dark'],
  ['error-300', 'steel-900', 4.5, 'error text on dark [a11y remedy]'],
  ['error', 'zinc-50', 4.5, 'error text on light'],

  // Heat-scale tick labels sit on dark, in mono
  ['steel-300', 'steel-950', 4.5, 'scale tick labels'],
];

/* Decorative hairlines are exempt from SC 1.4.11: they separate content but
   carry no information and are not the sole means of identifying a control.
   Reported for visibility, never failed on. §4 sets these deliberately faint. */
const DECORATIVE = [
  ['steel-700', 'steel-900', 'hairline border on dark'],
  ['steel-700', 'steel-800', 'row rule on card'],
  ['rule', 'zinc-50', 'hairline border on light'],
];

let fails = 0;
let warns = 0;
const rows = PAIRS.map(([fg, bg, floor, label]) => {
  const r = ratio(fg, bg);
  const expectedFail = label.includes('FAILS');
  const pass = r >= floor;
  let status;
  if (expectedFail) {
    status = pass ? 'UNEXPECTED PASS' : 'fails as documented';
    if (pass) warns++;
  } else if (pass) {
    status = 'pass';
  } else {
    status = 'FAIL';
    fails++;
  }
  return { fg, bg, floor, r, status, label };
});

const w = Math.max(...rows.map((r) => r.label.length));
console.log(`\n  ${'pairing'.padEnd(w)}  ${'ratio'.padStart(6)}  floor  status`);
console.log(`  ${'-'.repeat(w)}  ------  -----  ------`);
for (const r of rows) {
  const flag = r.status === 'FAIL' ? '  <<<' : '';
  console.log(
    `  ${r.label.padEnd(w)}  ${r.r.toFixed(2).padStart(6)}  ${r.floor.toFixed(1)}   ${r.status}${flag}`,
  );
}

console.log(`\n  decorative hairlines (exempt from SC 1.4.11, reported only)`);
for (const [fg, bg, label] of DECORATIVE) {
  console.log(`  ${label.padEnd(w)}  ${ratio(fg, bg).toFixed(2).padStart(6)}    --   exempt`);
}

console.log(
  `\n  ${rows.length} enforced pairings — ${fails} failing, ${warns} unexpected.\n`,
);
process.exit(fails > 0 ? 1 : 0);
