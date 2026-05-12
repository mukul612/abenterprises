# AB Induction — Cinematic Factory Journey

A single-page experience for AB Induction (Faridabad, India) that recasts the
website as a continuous walk through a futuristic industrial factory plant.
Each section is a "room" connected by camera-style transitions, layered
parallax, particles, smoke, and induction glow.

The factual content, product lineup and company information are unchanged from
the previous build — only the UI/UX, animations and storytelling are upgraded.

## Preview locally

```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080`.

Static files only — no build step. Animation libraries load from CDN.

## Files

```
├── index.html        — 7-scene experience markup
├── styles.css        — cinematic theme, scene environments, transitions
├── script.js         — GSAP/ScrollTrigger/Lenis + particles + interactions
├── assets/           — reserved for additional local imagery (placeholder)
└── README.md
```

## Journey (sections preserved end-to-end)

| Scene | ID            | Role in story          | Real section           |
|-------|---------------|------------------------|------------------------|
| 01    | `#hero`       | Ignition Chamber       | Hero                   |
| 02    | `#industries` | Production Corridor    | Industries marquee + grid |
| 03    | `#products`   | Machine Assembly Floor | Products (12 cards)    |
| 04    | `#capabilities` | R&D Lab              | Capabilities & pillars |
| 05    | `#simulation` | Engineering Control Room | Live console        |
| 06    | `#presence`   | Operations Network     | India map / HQ         |
| 07    | `#contact`    | Industrial Command Center | Contact form + map  |

Between each scene there is a cinematic transition — doorway, gantry, iris,
tunnel, server rack, and final approach — that the user appears to walk
through as they scroll.

## Tech

Pure HTML/CSS/JS with three CDN libraries:

- **GSAP 3.12** — timeline animations
- **ScrollTrigger** — scroll-linked camera moves & parallax
- **Lenis** — ultra-smooth inertial scroll

A small `<canvas>` particle system renders ambient embers in the background.
No frameworks, no bundler, no Three.js (kept lightweight intentionally).

## Visual system

- Matte black + gunmetal + steel base, induction orange / amber accents
- Glassmorphism panels (`.glass`)
- Layered parallax: background image → silhouette → foreground content
- Volumetric fog, sweeping light beams, scan lines, film grain
- Industrial floor rail + ceiling beams overlay (CSS perspective)
- Particle embers via `<canvas>`
- Procedural CSS environments per scene (so the site looks complete even
  before any external imagery loads)

## Imagery

Background plates are hot-linked from **Unsplash** (royalty-free hot-linking
with attribution). The page is designed to look intentional even if any of
these fail to load — every `.env-*` class layers a rich CSS-only gradient
underneath the photograph.

Photographers (Unsplash):

- Jonathan Borba — forge / molten metal glow (Ignition)
- ThisisEngineering — robotic arm with sparks (Corridor)
- Ant Rozetsky — glowing molten metal pour (Assembly)
- Crystal Kwok — industrial pipes / steam (R&D Lab)
- Markus Spiske — control monitors (Control Room)
- Patrick Hendry — aerial industrial plant (Network)
- Rob Lambert — dark moody workshop (Command Center)

Per Unsplash terms, attribution is recommended in production; consider
self-hosting the images or upgrading to a licensed gallery for a fully
controlled experience.

## Accessibility

- Reduced-motion users get a static reveal (preloader skipped, parallax
  disabled, particle canvas hidden, transitions collapsed)
- Touch / coarse-pointer devices skip the custom cursor and magnetic hover
- All controls remain keyboard-operable; `:focus-visible` outline is themed
- Color contrast meets AA on body copy

## MISSING ASSETS / INFORMATION REQUIRED

The site renders end-to-end with placeholder Unsplash photographs and
procedural CSS environments. To take it to fully owned production:

1. **Brand photography** — actual photographs of the Faridabad facility,
   induction coils, hardening machines, and the assembly floor. Recommended:
   one wide hero shot per scene (1920×1080+), and 12 isometric product photos
   (square, 1200×1200).
2. **Brand logo (vector)** — a high-resolution SVG of the AB Induction
   wordmark/mark. The current inline SVG mark is generated from initials.
3. **Verified company copy** — a longer "About AB Induction" paragraph,
   year-founded, headcount, exact facility area — would let us populate
   richer copy and stronger SEO meta tags.
4. **Real customer logos / industries served** — anonymised or named OEM
   logos would replace the icon-only industry cards with social proof.
5. **Real telemetry ranges** — the live console uses representative ranges.
   If you can share actual product spec sheets we can mirror real frequency,
   power and temperature envelopes per platform.
6. **Form backend endpoint** — the contact form currently shows a graceful
   client-side acknowledgement only. Provide a webhook / Formspree URL /
   SMTP relay and we will wire real submission.
7. **Analytics + chat tag IDs** — GA4, GTM, Meta Pixel, intercom, etc.
