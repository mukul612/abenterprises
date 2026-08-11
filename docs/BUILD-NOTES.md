# Build notes — deviations from the specification

The three supplied documents are the specification and win over defaults. This
file records every place the build departs from them, why, and what it would
take to go back. Nothing here was decided silently.

---

## 1. Astro 7.2.0, not Astro 5 — *decided*

`00-BUILD-BRIEF.md` §8 specifies Astro 5. Astro 5.18.2 (the latest 5.x) carries
eight unpatched XSS advisories with no remedy inside the 5.x line, plus
`sharp` <0.35 libvips CVEs. Two are directly relevant to this spec: *reflected
XSS via unescaped View Transition animation properties* (§5 motion) and *XSS via
unescaped attribute names in spread props* (every component).

Confirmed with the client; pinned to Astro 7.2.0. `npm audit` reports 0
vulnerabilities. Every API the brief relies on — Zod content collections,
`<ClientRouter />`, `@tailwindcss/vite`, MDX — is identical in 7. The deviation
is the version number only; no specified behaviour changes.

---

## 2. Six contrast failures in the palette — *fixed, inside the palette*

`01-DESIGN-SYSTEM.md` §2 sets its own floors: 4.5:1 body, 3:1 large text and UI
borders. Six pairings the design system specifies do not clear them. Remedies
stay inside the existing palette — no new hues except one error tint. Verify any
time with `npm run audit:contrast` (35 enforced pairings, currently 0 failing).

| Pairing | Spec | Ratio | Remedy | Ratio |
|---|---|---|---|---|
| Captions on dark | steel-500 on steel-900 | 2.86 | steel-400 | 5.30 |
| Card links | copper-500 on steel-800 | 4.41 | copper-400 | 5.89 |
| Primary button hover | steel-950 on copper-600 | 3.93 | copper-400 | 7.04 |
| Secondary button border | steel-500 on steel-900 | 2.86 | steel-400 | 5.30 |
| Error text on dark | error on steel-900 | 2.88 | error-300 `#E05B49` | 5.01 |
| **Focus ring on light** | copper-300 on zinc-50 | **1.77** | copper-700 | 5.85 |

Two notes:

- **The focus ring is the serious one.** SC 1.4.11 makes 3:1 mandatory for focus
  indicators, and copper-300 on a light section is effectively invisible. It is
  now ground-dependent (`--focus-ring` / `--focus-ring-light`) rather than a
  single value, which is why `.ground-light` and `.ground-paper` re-point it.
- **"Buttons darken one step" (§6) cannot work as written.** As copper darkens,
  its contrast against a near-black steel-950 label *falls*. The primary button
  therefore lightens to copper-400 on hover. The alternative that preserves the
  darkening is copper-600 fill with a `--paper` label (4.97:1), at the cost of a
  label-colour flip on hover. **Your call** — currently lightening.

§2's own claim that "copper-500 on zinc-50 does not pass for body text" is
correct (3.26) and copper-700 is the right remedy (5.85). That one is kept.

Decorative hairlines (steel-700 on steel-900, 1.35) are reported by the audit
but never failed — they separate content without carrying information, so
SC 1.4.11 does not apply. §4 sets them deliberately faint.

---

## 3. Heat scale marker positioning — *resolved, no spec change*

§2's gradient stops (0 16 33 50 67 84 100 %) are evenly spaced *per stop*, not
linear in temperature. Positioning a marker linearly would drift up to 5.4 %: an
1100 °C marker would land at 78.6 %, sitting over gradient that is still showing
roughly 1030 °C. On an instrument whose entire premise is "a buyer can read the
machine's operating window at a glance", that is a misread.

The gradient is untouched. Every tick and every marker is interpolated through
those same declared stops by `src/lib/scales.ts`, so a tick and a marker at the
same value always land on the same pixel and the colour beneath a marker is
honest to the value it claims. The drift table is rendered on `/design-system/`.

---

## 4. The heat scale cannot show five of the nineteen processes — **needs a decision**

This is the one genuine problem in the specification, and it sits in the
signature element.

§1 defines the scale as 550 °C to 1250 °C, correctly — 550 °C is where steel
begins to glow visibly, so an incandescence scale cannot start lower. But §1
also names **tempering at 200–400 °C** as one of its four example bands, and the
sitemap commits to these sub-incandescent process pages:

| Process | Band | On a 550–1250 °C scale |
|---|---|---|
| `/applications/induction-tempering/` | 200–400 °C | below |
| `/applications/induction-soldering/` | 200–400 °C | below |
| `/applications/induction-bonding/` | 150–250 °C | below |
| `/applications/shrink-fitting/` | 150–350 °C | below |
| `/applications/induction-preheating/` | 150–400 °C | below |
| `/applications/stress-relieving/` | 450–650 °C | straddles the floor |

Right now the instrument refuses to fake a reading: a band entirely below the
floor renders a "Below scale" flag with the real figures, rather than pinning a
marker to the left edge and implying a temperature the scale cannot show. That
is honest but it is not good enough for five production pages.

**Recommended fix — extend the instrument with the tempering-colour series.**
Blacksmiths use two colour charts, not one. Below incandescence, polished steel
shows *oxide tempering colours* — pale straw 200 °C, straw 230, bronze 260,
purple 280, blue 310, light blue 340. It is a real instrument, it is the exact
companion to the incandescence chart, and it is precisely the "actual readable
instrument, not decoration" idea §1 is built on. The scale would run 150–1250 °C
in two clearly-separated registers: oxide colours to 550, incandescence above.

Alternatives: a separate low-temperature instrument for those five pages, or
accept the "Below scale" flag as the permanent treatment.

I have not implemented this — it changes the signature element and is yours to
call. Everything else is built so the change lands in `src/lib/scales.ts` and
one gradient token.

---

## 5. Scale mappings the spec does not define — *decided, flagged*

§1 gives the current and power scales as gradients but does not say how a value
maps to a position.

- **Current (300 A → 10,000 A): logarithmic.** The product ladder is
  300/500/1000/1500/2000/3000/5000/8000/10000 A. Linear would bury the first
  four ratings inside the leftmost 12 % of the bar; log spaces the real ladder
  evenly, which is what makes the instrument readable.
- **Power (1000 W → 3000 W): linear.** A 3× span with products at
  1000/1500/2000/3000 W. Log and linear differ by only a few percent and linear
  reads directly.

---

## 6. Astro's view transitions are client-side, by design — *noted, not a conflict*

The session constraints say "no client-side routing for content"; §5 of the
design system specifies `<ClientRouter />`, a hero-image morph and a copper
progress bar. These are compatible: every page is still pre-rendered static HTML
and works fully with JavaScript disabled. `<ClientRouter />` is a ~9 kB
progressive enhancement over that, not an SPA.

Worth knowing: native cross-document view transitions
(`@view-transition { navigation: auto }`) would give the hero morph at **zero**
JS, but cannot render the copper navigation progress bar and have no Firefox
fallback. The spec names `<ClientRouter />` and asks for the progress bar, so
that is what will be built.

---

## 7. Sub-scope of this session

The session brief lists 11 pages under item 6; the CSV marks **22** rows as
phase 1. The 11 not in item 6 are the six section hubs (`/machines/`,
`/applications/`, `/parts-we-heat/`, `/industries/`, `/resources/`,
`/support/`), plus `/support/installation-and-commissioning/`,
`/company/manufacturing-facility/`, `/company/quality-and-certifications/`,
`/company/export-and-shipping/` and `/sitemap/`. Assumption: all 22 ship in
phase 1, with the 11 named in item 6 getting the fuller treatment. Say if you
would rather hold the other 11.

---

## 8. Smaller things noted, not yet actioned

- **Title tags.** Several rows in the CSV exceed the ≤60-character rule in §7.2,
  and four contain a literal `…` where the value looks truncated in authoring
  (e.g. `Electroplating Power Supply Guide — Process, Parts & Mach…`). All are
  phase 3+. A build-time check is wired into `npm run build` and will report
  them when those pages exist.
- **Meta descriptions.** The CSV supplies none, and §10 requires unique 140–158
  character descriptions per page. Being written per page.
- **The ≥3 inbound internal links build gate** (§6) counts *contextual body*
  links only. Counting header, footer and mega-menu links would make every page
  pass trivially and the gate meaningless.
- **`/privacy/`, `/terms/` and the 404 page** appear in the brief's URL tree but
  have no CSV row. Treated as required, phase 1.
- **The → glyph** used in CTA copy is outside the Latin subset. Arrows are
  rendered as inline SVG rather than text, so no CTA triggers a fallback-font
  swap.
