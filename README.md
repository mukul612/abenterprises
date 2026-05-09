# AB Enterprises — AB Induction website

Manufacturer-cut redesign for **A.B. Enterprises / AB Induction** — a Faridabad-based manufacturer of induction heating, hardening and IGBT rectifiers since 2004.

Implementation follows the v2 "manufacturer cut" handoff design (`AB Induction Redesign v2.html`): dark, dense, utilitarian, contact-first hierarchy, technical typography. Real photography sourced from `abinduction.in`.

## Pages

- `index.html` — single-page main site (hero, products, applications, case study, industries, workshop, process, contact)
- `products.html` — full product catalogue with spec sheet and options matrix
- `about.html` — workshop, capability, after-sales
- `contact.html` — enquiry form, address, directions

Shared:
- `styles.css` — full stylesheet
- `script.js` — nav scroll state, mobile menu, live readout, product table interaction, form handler, scroll reveals

## Preview

Just open `index.html` in a browser, or run a local server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Image sources

All product, workshop and process photography is loaded from `abinduction.in/wp-content/uploads/...` — same images used on the live AB Induction site. Two product shots come from the company's listing on `2.wlimg.com` (TradeIndia).

## Type & accent

- **Type** — Inter Tight (UI) + JetBrains Mono (specs, eyebrow, code)
- **Accent** — amber `#ff8a24` for energy / heat cues; mostly off-state in the dark UI
