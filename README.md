# Bloom MMA & Fitness — bloommma313.com redesign

A complete fight-night redesign for **Bloom MMA & Fitness** (Allen Park, MI),
inspired by UFC.com and the best fight-gym sites: dark cage aesthetic, blood-red
and championship-gold palette, knockout typography, and MMA references in every
detail.

## MMA details baked in

- **Round-card page intros** — every page opens like a round ("ROUND 1… FIGHT!")
- **Strike-wipe transitions** — internal navigation hits like a cross
- **Round clock** — scroll progress shown as a 5:00 round counting down, with a
  10-second clapper warning at the bottom of the page
- **Fight-card schedule** — classes listed as prelims and main card bouts
- **Tale of the tape** — red corner vs blue corner comparison sections
- **Judges' scorecards** — animated stat counters
- **Octagon everything** — octagon-clipped badges, frames, and a rotating cage
  wireframe in the hero
- **The bell** — CTAs ring a synthesized fight bell (user-click only)
- Event-style ticker tape, cage-mesh textures, corner-color accents throughout

## Pages

| Page | Round | Contents |
| --- | --- | --- |
| `index.html` | R1 — Main Event | Hero, divisions, tale of the tape, coach, scorecards, fight-card preview |
| `classes.html` | R2 — Fight Card | All 8 programs + full weekly schedule |
| `coach.html` | R3 — The Coach | Jesse Bazzi bio, career told round-by-round |
| `contact.html` | R4 — Step In | Free-trial "bout agreement" form, corner info, map |

## Preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080 — or just double-click `index.html`.

## Editing the facts

Real-world details (address, schedule times, socials) live as plain text in the
HTML. The weekly schedule is a **sample card** — update times in
`classes.html` / `index.html` to match the gym's current schedule. Contact
points used throughout: (313) 989-9222 · bloommma313@gmail.com ·
5903 Allen Rd, Allen Park, MI 48101.

No build step, no frameworks, no external images — pure HTML/CSS/JS that works
offline. Fonts load from Google Fonts with system fallbacks.
