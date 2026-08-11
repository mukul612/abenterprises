# AB Induction — Website Build Brief

**Client:** A.B. Enterprises / A.B. Electricals, Faridabad, Haryana, India
**Current site:** abinduction.in (WordPress, Elementor)
**Audience:** Global. Plant engineers, heat-treatment job-shop owners, procurement managers, maintenance heads — India, SE Asia, Middle East, Africa, Europe, Americas.
**Job of the site:** Get a qualified RFQ from an engineer who found us on Google while searching for a *process* or a *part*, not for a brand name.

This document is the complete specification. Read it with `01-DESIGN-SYSTEM.md` (visual language) and `02-SITEMAP-SEO-MAP.csv` (every URL, title, H1, keyword, and link target).

---

## 1. What we sell (three divisions)

| Division | What it covers | Colour code |
|---|---|---|
| **Induction** | Heating, hardening, tempering, annealing, brazing, bonding, shrink fitting, billet/bar-end heating, forging heaters, coils, chillers, PLC/CNC automation | Cherry |
| **Rectifiers** | IGBT air-cooled electroplating rectifiers, 12V 300A–10,000A, plus 18V and 24V ranges; anodizing, electrowinning, pulse plating | Nickel |
| **Laser** *(new line)* | Handheld fibre laser welders, robotic laser welding cells, 3-in-1 weld/clean/cut systems | Beam |

Three divisions is a structural fact, not a footnote. It drives the mega-menu, the URL tree, the colour system, and the way the footer is organised.

---

## 2. What the market leaders actually do (and what beats them)

### Induction

**Ambrell** (ambrell.com) — the strongest site in the category. Its nav is split into **"How it's Used"** (28 process pages) and **"Where it's Used"** (17 industry pages), with Products subordinate to both. Its conversion engine is a **free applications lab**: send us your part, we'll run it and send results. Gated application-note PDFs generate the lead list. PRO Skills webinars and a named in-house expert (Dr. Dahake) carry E-E-A-T. Ambrell ranks because it owns the *process* vocabulary, not the product vocabulary.

**EFD Induction / ENRX** — organised by industry segment with named customer case studies (BMW, Audi, Volvo, ZF, NSK). Proof-led.

**Inductoheat** — has a **"Parts We Harden"** tree: axle shafts, crankshafts, camshafts, gears, ring gears. This is the single highest-intent traffic type in the category and almost nobody in India has claimed it.

**KETCHAN** (inductionheattreatment.com) — the Chinese export playbook: 15 product categories × 11 process pages × 11 video pages, densely cross-linked, FAQ block on the homepage, WhatsApp/Skype/WeChat in the header, country dropdown on every form, product counts displayed on category tiles. It outranks far bigger firms on long-tail terms purely on page count and internal linking.

### Rectifiers

**Liyuan Haina** (ly-rectifier.com, lyhnplating.com) — this is the key insight. They rank on **parametric spec pages**: one URL per voltage/current combination, e.g. *"0~12V 0~2500A Air-cooled Rectifier for Electroplating"*, *"300A 12V IGBT Rectifier for Tin Electroplating"*, *"20A 150V IGBT Nickel Plating Rectifier"*. Dozens of them, each targeting the exact string a buyer types. They also segment by **plated metal** (copper, nickel, zinc, chrome, gold, tin) and by **application** (PCB plating, anodizing, electrowinning, hydrogen electrolysis). **Green Power** (gprectifier.com) does the same and leads with component-level proof — DSP control board, nanocrystalline transformer core, 99.9% copper busbar, 2mm cold-rolled cabinet.

**We already sell 12V 300A to 12V 10,000A plus 18V and 24V ranges. That is roughly 40 parametric pages sitting unused.**

### Laser

**Baison** (baisonlaser.com) — nav is Products → Applications → Industries → Resources → Support → Company. Two persistent header CTAs: *Become a Distributor* and *Get Instant Quote*. Their traffic engine is **comparison and listicle content**: "laser welding vs TIG", "laser welding vs MIG", "how much does a laser welder cost", "top 10 manufacturers". Founder byline on every article. Exit-intent catalogue download.

**IPG (LightWELD)**, **Han's**, **Trumpf**, **Senfeng**, **MaxWave**, **DenaliWeld** — the spec that buyers filter on is **wattage** (1000W / 1500W / 2000W / 3000W), cooling type (air vs water), and whether it's 3-in-1. Wattage belongs in URLs.

### The five mechanics that actually drive rankings here

1. **Process and part pages outnumber product pages 3:1.** Buyers search "how do I harden an axle shaft", not "ABE-50AB".
2. **Parametric spec pages at scale.** One URL per meaningful spec combination.
3. **Specs as real HTML tables**, never images. The numbers are the keywords.
4. **Dense reciprocal internal linking** between machine ↔ process ↔ part ↔ industry.
5. **A free evaluation offer** ("send us your part") as the primary conversion mechanic — it converts *and* attracts links.

### What we can own that they don't

- **"Parts We Harden"** — Inductoheat has it, no Indian manufacturer does.
- **A three-line catalogue under one roof.** Induction + rectifiers + laser is a rare combination. Cross-sell pages ("heat treat and plate in one plant") are uncontested.
- **A frequency × power selector tool.** Nobody in this category has an interactive spec finder. Strong link magnet.
- **Comparison content** — induction hardening vs case carburising, IGBT vs SCR rectifier, laser welding vs TIG. Baison proves it works; the induction and rectifier equivalents are wide open.

---

## 3. What's structurally wrong with the current site

- Products are organised by **internal model number** (ABE-25AB, ABE-40AB, ABE-50AB). No buyer searches these. Every nav item is a dead end for acquisition.
- **Zero process pages, zero industry pages, zero part pages.** Hardening, brazing, shrink fitting, JCB parts, tractor parts and hand tools are all mentioned — buried in homepage body copy where nothing can rank.
- **Two conflicting taxonomies.** Header dropdown has 4 categories; footer lists 6 model codes; footer "Information Links" include unlinked plain text (Plating Plant Manufacturer, Handheld Laser Welding Machine, Various Type Of Inductors).
- **No proof layer.** No spec tables, no downloadable PDFs, no case studies, no certifications, no export or commissioning information.
- **The inductor gallery is unlabelled.** A whole product line — coil design, manufacture and repair — is sitting in an anonymous photo grid.
- **Domain authority is split** across abinduction.in, abelectricals.com and inductionheatingmachine.co.in.

---

## 4. Information architecture

### Primary navigation

```
[AB logo]   Machines ▾   Applications ▾   Industries ▾   Resources ▾   Company ▾   │  ☎  Get a Quote
```

**Machines** opens a three-column mega menu, one column per division, each column headed by the division colour rule. **Applications** opens two columns: Processes | Parts We Heat. Utility bar above the header: phone, WhatsApp, email, and a "Send us your part — free evaluation" link.

### URL tree

Rules: lowercase, hyphenated, keyword-first, no dates, no model numbers in slugs (model numbers live in the H2 and spec table), maximum depth 3, trailing slash consistently.

```
/
├── /machines/
│   ├── /induction-hardening-machines/
│   │   ├── /vertical-induction-hardening-machine/
│   │   ├── /horizontal-induction-hardening-machine/
│   │   ├── /cnc-induction-hardening-machine/
│   │   ├── /induction-scanner-hardening-machine/
│   │   ├── /axle-shaft-hardening-machine/
│   │   ├── /flywheel-ring-gear-hardening-machine/
│   │   ├── /gear-hardening-machine/
│   │   └── /hand-tool-hardening-machine/
│   ├── /induction-heating-machines/
│   │   ├── /billet-heating-machine/
│   │   ├── /bar-end-heating-machine/
│   │   ├── /ci-ring-and-bush-heating-machine/
│   │   ├── /shrink-fitting-machine/
│   │   └── /forging-induction-heater/
│   ├── /induction-brazing-machines/
│   │   ├── /single-station-induction-brazing-machine/
│   │   ├── /double-station-induction-brazing-machine/
│   │   └── /rotary-index-brazing-machine/
│   ├── /induction-bonding-machine/
│   ├── /induction-power-supplies/
│   │   ├── /high-frequency-induction-heater/
│   │   ├── /medium-frequency-induction-heater/
│   │   ├── /ultra-high-frequency-induction-heater/
│   │   └── /{15|25|40|50|60|120}-kw-induction-heating-machine/   ← parametric
│   ├── /induction-coils/
│   ├── /water-chillers/
│   ├── /automation-and-turnkey-systems/
│   ├── /electroplating-rectifiers/
│   │   ├── /igbt-electroplating-rectifier/
│   │   ├── /anodizing-rectifier/
│   │   ├── /electrowinning-rectifier/
│   │   ├── /pulse-plating-rectifier/
│   │   ├── /{copper|nickel|zinc|chrome|gold|tin|silver}-plating-rectifier/
│   │   └── /electroplating-rectifier-{12v|18v|24v}-{300a…10000a}/  ← parametric
│   └── /laser-welding-machines/
│       ├── /handheld-laser-welding-machine/
│       ├── /robotic-laser-welding-machine/
│       ├── /3-in-1-laser-welding-cleaning-cutting-machine/
│       └── /{1000w|1500w|2000w|3000w}-handheld-laser-welder/      ← parametric
│
├── /applications/                       ← process hub
│   ├── /induction-hardening/  /induction-tempering/  /induction-annealing/
│   ├── /induction-brazing/  /induction-soldering/  /induction-bonding/
│   ├── /shrink-fitting/  /induction-preheating/  /post-weld-heat-treatment/
│   ├── /billet-heating/  /bar-end-heating/  /induction-forging/
│   ├── /stress-relieving/  /induction-straightening/
│   ├── /electroplating/  /anodizing/  /electrowinning/
│   └── /laser-welding/  /laser-cleaning/
│
├── /parts-we-heat/                      ← highest-intent layer
│   ├── /axle-shafts/  /crankshafts/  /camshafts/  /gears/  /ring-gears/
│   ├── /ci-rings-and-bushes/  /sprockets/  /chain-links/  /springs/
│   ├── /fasteners/  /bearings/  /machine-guideways/
│   └── /hand-tools/  (hammers, chisels, hoes, spades)
│
├── /industries/
│   ├── /automotive-components/  /tractor-and-agricultural-equipment/
│   ├── /earthmoving-and-construction-equipment/  /hand-tools-and-hardware/
│   ├── /fasteners/  /bearings/  /motors-and-electricals/
│   ├── /plating-and-surface-finishing/  /railways/
│   ├── /sheet-metal-fabrication/  /general-engineering-job-shops/
│
├── /resources/
│   ├── /case-studies/{slug}/            ← one per real installation
│   ├── /application-notes/{slug}/       ← gated PDF, email capture
│   ├── /videos/
│   ├── /guides/induction-coil-design/
│   ├── /guides/choosing-frequency-and-power/
│   ├── /guides/igbt-vs-scr-rectifier/
│   ├── /guides/induction-hardening-vs-case-carburising/
│   ├── /guides/laser-welding-vs-tig-welding/
│   ├── /tools/frequency-power-selector/ ← interactive, link magnet
│   ├── /glossary/
│   ├── /faq/
│   └── /blog/{slug}/
│
├── /support/
│   ├── /send-us-your-part/              ← PRIMARY conversion offer
│   ├── /installation-and-commissioning/
│   ├── /service-and-spares/
│   ├── /operator-training/
│   ├── /warranty/
│   └── /remote-support/
│
├── /company/
│   ├── /about/  /manufacturing-facility/  /quality-and-certifications/
│   ├── /export-and-shipping/  /countries-we-serve/
│   ├── /become-a-distributor/  /news/  /careers/
│
├── /contact/
├── /request-a-quote/
├── /downloads/                          ← catalogues, brochures
└── /privacy/  /terms/  /sitemap/
```

**Total at launch: ~95 pages.** Phase 2 parametric expansion takes it to ~180.

---

## 5. Page templates

Build these as reusable layouts. Content lives in MDX frontmatter so pages are generated, not hand-coded.

### 5.1 Homepage

```
┌──────────────────────────────────────────────────────────┐
│ Utility bar: phone · WhatsApp · email · Send us your part │
│ Header: logo · nav · [Get a Quote]                        │
├──────────────────────────────────────────────────────────┤
│ HERO                                                      │
│   Full-bleed still or 6s silent loop: a shaft glowing     │
│   cherry-red inside a copper coil, dark workshop.         │
│   H1: Induction heating, plating rectifiers and laser     │
│       welding systems — engineered in Faridabad,          │
│       installed in {N} countries.                         │
│   Sub: one line on custom PLC/CNC engineering.            │
│   [Get a Quote]  [Send us your part →]                    │
│   HEAT SCALE strip runs edge-to-edge beneath the hero     │
├──────────────────────────────────────────────────────────┤
│ THREE DIVISIONS — 3 large tiles, each in its line colour  │
│   Induction · Rectifiers · Laser · with machine counts    │
├──────────────────────────────────────────────────────────┤
│ WHAT CAN WE HEAT FOR YOU? — process strip, 12 chips       │
│   linking to /applications/*                              │
├──────────────────────────────────────────────────────────┤
│ PARTS WE HEAT — 8 part tiles with real part photos        │
├──────────────────────────────────────────────────────────┤
│ PROOF BAND — years · machines installed · countries ·     │
│   ISO/CE · in mono type on dark ground                    │
├──────────────────────────────────────────────────────────┤
│ FEATURED CASE STUDY — one part, one problem, one result   │
│   with a real measured number (cycle time, case depth)    │
├──────────────────────────────────────────────────────────┤
│ COILS & INDUCTORS — the gallery, finally given a name,    │
│   with design / manufacture / repair CTA                  │
├──────────────────────────────────────────────────────────┤
│ SERVICE & EXPORT — commissioning, spares, training,       │
│   shipping, voltage/frequency options, remote support     │
├──────────────────────────────────────────────────────────┤
│ VIDEO STRIP — 4 machines running (facade-loaded)          │
├──────────────────────────────────────────────────────────┤
│ QUOTE FORM — name, email, company, country, application,  │
│   part drawing upload                                     │
├──────────────────────────────────────────────────────────┤
│ Footer: 4 columns + division switcher + address + socials │
└──────────────────────────────────────────────────────────┘
```

Kill the current three-banner rotating hero. One thesis, one image.

### 5.2 Machine detail page (the workhorse — ~45 instances)

Fixed section order. Every machine page must have all of these:

1. Breadcrumb
2. H1 = target keyword. Model code (e.g. ABE-50AB) as an eyebrow label above it, in mono.
3. Gallery — 4–6 real photographs, first one is LCP, `fetchpriority="high"`
4. One-paragraph plain-language summary: what it does, what it's for
5. **Spec table** (HTML `<table>`, mono figures): output power kW · frequency range kHz · input supply V/phase/Hz · duty cycle % · cooling method · footprint mm · control type · quench system · protection class
6. **Heat scale marker** — where this machine's process sits on the temperature strip
7. Typical parts handled → links to `/parts-we-heat/*`
8. Related processes → links to `/applications/*`
9. Video (facade-loaded)
10. Options and configurations
11. Download datasheet (PDF, email-gated)
12. FAQ — 4 to 6 questions, `FAQPage` schema
13. Related machines (3, from the same category)
14. Quote CTA band

### 5.3 Process page (`/applications/*`)

H1 = "Induction Hardening" etc. Structure: what the process is → why induction → the temperature band shown on the heat scale → parts commonly processed → machines we build for it → a case study → FAQ → quote CTA. Target 900–1,400 words. This is the page type that earns the traffic; write it properly.

### 5.4 Part page (`/parts-we-heat/*`)

H1 = "Induction Hardening of Axle Shafts". Structure: the part and its duty → the metallurgical requirement (case depth, hardness, core toughness) → why induction beats the alternative → the machine we'd propose → process parameters table → a photo of a real sectioned part → FAQ → "Send us your part" CTA. These are short (600–900 words) but extremely high intent.

### 5.5 Industry page

H1 = "Induction Heating for the Tractor and Agricultural Equipment Industry". Parts in that industry → processes → machines → case study → CTA.

### 5.6 Parametric spec page (rectifiers, laser, kW ratings)

Generated from a data file. `/electroplating-rectifier-12v-2000a/` with H1 "12V 2000A IGBT Electroplating Rectifier". Same template, values injected. Each links up to its category page and sideways to the two adjacent ratings. **Do not publish these until each has at least 250 words of genuinely differentiated content** — application notes for that current range, typical tank size, typical plated metals. Thin duplicated pages will get the whole cluster demoted.

### 5.7 Case study

Part → problem → what was tried before → the system supplied → measured result → customer quote if permitted. One real number in the H1 where possible.

---

## 6. Internal linking — the nervous system

The site is a **matrix**, not a tree. Every page carries the same reciprocal link modules, populated automatically from MDX frontmatter tags.

```
                    ┌─────────────────┐
                    │    MACHINE      │
                    │  (what to buy)  │
                    └────┬───────┬────┘
                         │       │
        ┌────────────────┘       └────────────────┐
        ▼                                          ▼
┌───────────────┐                         ┌────────────────┐
│   PROCESS     │◄───────────────────────►│  PART WE HEAT  │
│ (what it does)│                         │ (what you make)│
└───────┬───────┘                         └────────┬───────┘
        │                                          │
        └──────────────►┌──────────────┐◄──────────┘
                        │   INDUSTRY   │
                        │  (who you are)│
                        └───────┬──────┘
                                ▼
                        ┌──────────────┐
                        │  CASE STUDY  │──► links to all four
                        └──────────────┘
```

Rules Claude Code must enforce at build time:

- **Every machine page** links to ≥3 processes, ≥3 parts, ≥1 industry, ≥2 sibling machines.
- **Every process page** links to ≥3 machines, ≥4 parts, ≥2 industries.
- **Every part page** links to 1 primary machine, ≥2 processes, ≥1 industry.
- **Every industry page** links to ≥4 parts, ≥3 processes, ≥3 machines.
- **Every case study** links to the machine, the process, the part and the industry it belongs to.
- Links are **reciprocal**: if A declares B in frontmatter, B renders a link back to A. Build the reverse index at compile time — don't maintain it by hand.
- **Breadcrumbs on every page**, with `BreadcrumbList` schema.
- **Blog posts link up** into at least two hub pages. Hubs never link down to blog posts except through a curated "Related reading" block of three.
- Fail the build if any page has fewer than 3 inbound internal links. Orphan pages are the most common cause of a cluster underperforming.

Frontmatter contract:

```yaml
---
title: "Vertical Induction Hardening Machine"
h1: "Vertical Induction Hardening Machine"
slug: vertical-induction-hardening-machine
type: machine
division: induction        # induction | rectifier | laser
category: induction-hardening-machines
model: ABE-50AB
targetKeyword: "vertical induction hardening machine"
processes: [induction-hardening, induction-tempering]
parts: [axle-shafts, gears, machine-guideways]
industries: [automotive-components, tractor-and-agricultural-equipment]
specs:
  outputPower: "50 kW"
  frequency: "10–30 kHz"
  inputSupply: "415 V / 3-phase / 50 Hz (380–440 V, 50/60 Hz available)"
  dutyCycle: "100%"
  cooling: "Water-cooled, DM water chiller"
  control: "PLC + HMI, optional CNC"
heatBand: [850, 950]       # °C — drives the heat-scale marker
faq: [...]
---
```

---

## 7. SEO specification

### 7.1 Domain

**Move to a `.com` and 301 everything into it.** A `.in` domain quietly signals "India-only supplier" to a procurement manager in Ohio, and authority is currently split three ways. Recommended: acquire `abinduction.com` if available; otherwise consolidate onto `abelectricals.com` — but only if it can be rebranded, since the brand name people will search is "AB Induction".

Migration: map every existing URL to its new equivalent, 301 (never 302), keep the old domains alive and redirecting indefinitely, resubmit sitemaps, update Google Business Profile and every directory listing (IndiaMART, TradeIndia, Justdial).

### 7.2 Titles and metas

Title formula: `{Primary Keyword} — {Qualifier} | AB Induction`
- ≤60 characters. Keyword first. Brand last.
- Example: `Vertical Induction Hardening Machine — 50 kW | AB Induction`

Meta description: 140–158 characters, contains the primary keyword and one concrete differentiator (a spec number, the free part evaluation, or the countries-served figure). Never auto-generate from body text.

One `<h1>` per page, matching the target keyword. H2/H3 hierarchy is strict — never skip a level.

### 7.3 Schema (JSON-LD, in `<head>`)

| Page type | Schema |
|---|---|
| All | `Organization`, `WebSite` with `SearchAction`, `BreadcrumbList` |
| Homepage | `Organization` + `LocalBusiness` (Faridabad address, `+91-9891964848`) |
| Machine / parametric | `Product` with `additionalProperty` for every spec row, `Offer` with `priceCurrency` and "contact for price", `Manufacturer` |
| Process / part / industry | `Article` + `HowTo` where a genuine sequence exists |
| Case study | `Article` with `about` pointing to the Product |
| FAQ blocks | `FAQPage` |
| Videos | `VideoObject` with `thumbnailUrl`, `uploadDate`, `duration` |
| Guides | `Article` with `author` (name a real engineer — E-E-A-T) |

### 7.4 Technical

- **Static site generation.** Every page pre-rendered HTML. No client-side routing for content.
- **Core Web Vitals targets:** LCP < 2.0 s on 4G, INP < 200 ms, CLS < 0.05. These are non-negotiable acceptance criteria — measure with Lighthouse CI in the build.
- **Images:** AVIF with WebP fallback, explicit `width`/`height` on every `<img>`, `loading="lazy"` except the LCP image, descriptive filenames (`vertical-induction-hardening-machine-abe-50ab-quench-tank.avif`), alt text describing the machine and its function.
- **Fonts:** self-hosted, WOFF2, Latin subset, `font-display: swap`, preload the display face only.
- **Video:** never embed YouTube iframes directly. Use a facade (click-to-load) — a raw iframe destroys LCP.
- **Sitemaps:** auto-generated `sitemap-index.xml` split by type (machines, applications, parts, industries, resources). Plus a human `/sitemap/` page.
- **`robots.txt`** with sitemap reference. Nothing blocked except `/thank-you/` and form endpoints.
- **Canonicals** self-referencing on every page. Parametric pages canonical to themselves, never to the category.
- **hreflang:** `en` and `x-default` at launch. Structure the routing so `/de/`, `/es/`, `/pt/` can be added later without a URL change.
- **404** page that lists the three divisions and a search box.

### 7.5 Content requirements that are actually SEO requirements

- **Specs in dual units and dual supply.** 380/415/440 V, 50/60 Hz, mm and inches, kg and lb. Export buyers filter on this before they contact anyone.
- **Say the export part out loud.** Countries shipped to, lead time, packing method, commissioning process, spares availability, warranty terms, remote support. This is the largest trust gap between us and Ambrell and it costs nothing but copy.
- **Name a real engineer** as author on guides and application notes. Ambrell's Dr. Dahake and Baison's founder byline are both E-E-A-T plays and both work.
- **Every product page gets an FAQ block.** It wins featured snippets and it's the cheapest schema on the site.

### 7.6 Conversion

Primary offer: **"Send us your part."** Free evaluation — we run the part, send back the hardness profile / case depth / cycle time and a proposal. This is Ambrell's highest-converting mechanic and nobody in India offers it. It should appear in the utility bar, the hero, every part page, and the footer.

Secondary: gated datasheet and application-note PDFs (email + company + country).
Tertiary: WhatsApp float (already on the current site — keep it, it converts well in export markets), and a **country selector on every form** (KETCHAN and Liyuan both do this; it lets sales route and qualify instantly).

Forms: name, email, company, country, phone, application/process, part material, part dimensions, monthly volume, file upload for drawings. Multi-step — three short screens beat one long form.

---

## 8. Technical stack

**Recommended: Astro 5 + Tailwind CSS 4 + MDX content collections, deployed on Cloudflare Pages or Netlify.**

Why: ~180 spec-heavy pages that must be fast and statically rendered; MDX collections make parametric generation trivial; Astro's View Transitions give real page transitions with no SPA overhead; zero JS shipped by default, which is how we hit the CWV targets. WordPress cannot hit these numbers without heavy caching work, and Elementor is why the current site is slow.

- Content in `src/content/{machines,applications,parts,industries,resources,cases}/` as MDX with typed Zod schemas.
- Parametric pages generated from `src/data/rectifiers.json` and `src/data/lasers.json` via `getStaticPaths`.
- Non-technical editing: **Sveltia CMS** or **Decap CMS** on top of the Git repo, or Sanity if the team wants a proper editor. Do not put this back on WordPress.
- Forms: Netlify Forms or Formspree → email + a Google Sheet. Add reCAPTCHA v3.
- Analytics: GA4 + Google Search Console + Microsoft Clarity for heatmaps.
- Lighthouse CI in the pipeline; build fails below 95 performance / 100 SEO.

---

## 9. Build phases

**Phase 1 — Foundation (weeks 1–3)**
Design system, layouts, header/footer/mega menu, homepage, 3 division hubs, contact, quote, about. 12 pages. Ship it.

**Phase 2 — Machines (weeks 3–6)**
All ~45 machine pages with real photos and real spec tables. Coils page. Chillers. Automation.

**Phase 3 — Demand layer (weeks 6–10)**
19 process pages, 14 part pages, 11 industry pages. This is where the traffic comes from — do not compress this phase.

**Phase 4 — Proof and tools (weeks 10–14)**
Case studies, application notes, guides, the frequency×power selector, video library, FAQ.

**Phase 5 — Parametric expansion (ongoing)**
~40 rectifier spec pages, ~8 laser wattage pages, ~6 kW-rating pages. Only publish with genuine differentiated copy.

---

## 10. Acceptance criteria

- [ ] Every page has a unique title ≤60 chars and a unique meta description 140–158 chars
- [ ] Every page has exactly one H1 and an unbroken heading hierarchy
- [ ] Every page has ≥3 inbound internal links (build fails otherwise)
- [ ] All frontmatter relationships are reciprocal
- [ ] Every machine page has a complete spec table as real HTML
- [ ] Every spec is given in dual units and dual supply
- [ ] Every image has explicit dimensions, AVIF/WebP, and descriptive alt text
- [ ] JSON-LD validates in Google's Rich Results Test on every template
- [ ] Lighthouse ≥95 performance, 100 SEO, ≥95 accessibility on mobile
- [ ] Keyboard navigable end to end, visible focus rings, `prefers-reduced-motion` respected
- [ ] Works down to 360 px
- [ ] `sitemap-index.xml`, `robots.txt`, self-referencing canonicals present
- [ ] 301 map from every old URL, tested
