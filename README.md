# AB Induction — abinduction.com

Static marketing and specification site for A.B. Enterprises, Faridabad —
induction heating and heat-treatment machines, IGBT electroplating rectifiers,
and fibre laser welding systems.

Astro 7 · Tailwind CSS 4 · MDX content collections · TypeScript · static output
for Cloudflare Pages.

## Getting started

```bash
npm install
npm run fonts   # builds the self-hosted WOFF2 set into public/fonts/
npm run dev
```

`npm run fonts` needs Python 3 with `fonttools[woff]` and `brotli`
(`pip install "fonttools[woff]" brotli`). The generated fonts are committed, so
this is only needed when changing the font set.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Type-check, build, then run the SEO audit |
| `npm run preview` | Serve the built site |
| `npm run fonts` | Rebuild `public/fonts/` from Fontsource |
| `npm run audit:contrast` | Check every colour pairing against the §2 floors |

## Layout

```
src/
  components/    HeatScale.astro and friends
  layouts/       Document shells
  lib/           scales.ts — the three instrument scales
  pages/         Routes. /design-system/ is a noindex token reference.
  styles/        tokens.css (single source of truth) -> base.css -> global.css
scripts/         Font pipeline, audits, artifact packaging
docs/            BUILD-NOTES.md — every deviation from the spec
```

## Design tokens

`src/styles/tokens.css` is the single tokens layer and the only place a value is
defined. It is a Tailwind 4 `@theme` block, so each token is emitted as a `:root`
custom property *and* generates its utility from one declaration — no aliasing,
no drift. `--color-copper-500` is usable as `var(--color-copper-500)` or as
`bg-copper-500`.

## Read this before changing anything

`docs/BUILD-NOTES.md` records every deviation from the supplied specification
and the open decisions. One is outstanding: the heat scale cannot represent the
five sub-incandescent processes in the sitemap.
