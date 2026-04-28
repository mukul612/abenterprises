# abinduction.in — modern rebuild

A single-page, dark-themed marketing site for **AB Induction** —
manufacturer of industrial induction heating, hardening, electroplating
rectifiers, and laser systems.

## What's here

- **`index.html`** — semantic, accessible markup. Hero, products,
  capabilities, industries, process, testimonial, contact form, footer.
- **`styles.css`** — design system in CSS custom properties.
  Dark surface + ember/amber gradient accents.
- **`script.js`** — sticky nav, mobile menu, scroll reveals, animated
  counters, cursor-tracking glow on product cards, live coil readout,
  form-submit feedback.
- **`favicon.svg`** — induction-coil mark.

No build step. No framework. Open `index.html` in a browser, or serve
the directory with any static host (Netlify, Vercel, GitHub Pages,
Cloudflare Pages, plain Nginx).

```sh
# preview locally
python3 -m http.server 8000
# → http://localhost:8000
```

## Design notes

- **Palette:** deep navy/black surface with an ember gradient
  (`#ffce4b → #ff7a18 → #af002d`) that nods to glowing-hot metal under
  an induction coil.
- **Type:** Space Grotesk (headings) + Inter (body) + JetBrains Mono
  (technical labels & readouts).
- **Motion:** scroll reveals, count-up stats, animated coil rings,
  pulsing heat glow, scrolling industry marquee, cursor-glow on
  product cards. All gated by `prefers-reduced-motion`.
- **Accessibility:** skip link, semantic landmarks, focus styles,
  reduced-motion support, WCAG-AA contrast.
- **Responsive:** layout collapses cleanly to a single column at
  ≤ 920 px, with a hamburger nav.

## Hooking up the contact form

The form currently no-ops on submit (gives a "thanks" toast).
Wire it to your handler of choice — e.g. Formspree, Netlify Forms,
or a `POST` endpoint:

```html
<form class="form" action="https://formspree.io/f/XXXX" method="POST">
```

…and remove the `e.preventDefault()` block in `script.js`.

## Customizing

- **Phone / email:** search `+91 99999 99999` and `sales@abinduction.in`
  in `index.html` and replace.
- **Brand colors:** edit the `--ember-*` custom properties at the top
  of `styles.css`.
- **Sections:** every section is independently structured — add,
  remove or reorder freely.
