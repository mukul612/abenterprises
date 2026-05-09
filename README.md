# AB Induction — Premium Website Redesign

A modern, single-page redesign of `abinduction.in` inspired by Apple/Tesla design philosophy applied to industrial induction-heating engineering.

## Preview locally

Open `index.html` directly in a browser, or for full feature parity (iframe map, fonts):

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Files

- `index.html` — single-page experience
- `styles.css` — dark premium theme, animations, responsive
- `script.js` — cursor glow, tilt, reveal, simulation console, modal, form

## Sections

1. Hero (animated SVG induction coil + workpiece, dual CTAs)
2. Industries marquee + grid
3. Products (interactive cards opening detail modals)
4. Capabilities (animated counters + pillars)
5. Live Console — real-time visualization of frequency / power / temperature
6. Global Presence (map of India with HQ pin)
7. Contact (form + clickable phone + embedded Google Map)
8. Footer with brand watermark

## Tech

Plain HTML, CSS, and JS — no build step, no frameworks.
