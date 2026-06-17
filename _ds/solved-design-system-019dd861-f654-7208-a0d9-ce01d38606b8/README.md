# Solved Design System

> Software transversal que **alinea las operaciones de la capa humana de la fábrica**. trysolved.com

## What is Solved?

Solved is a B2B software product for manufacturing plants. Its job is to **align the people who run the factory** — producción, mantenimiento, logística, calidad y dirección — around one shared, real-time view of operations, so problems get seen, assigned and closed without manual back-and-forth.

The live website (trysolved.com) presents the product through three concrete capabilities:

1. **Auditorías** — proactive, personalised checklists; rondas, evidencias, no conformidades.
2. **Gestión de incidencias y acciones correctivas** — centralise incidents, assign owners, prioritise tasks; every issue visible to all areas involved.
3. **Datos avanzados / Informes (Dashboard)** — real-time data and a strategic view of the plant.

Served to two industry tracks: **Industria general** and **Industria alimentaria** (a large share of clients are food producers — Fritoper, Lácteos Romar, Wetaca, Dogfy, True Gum…). The company is **Volstone Technology Services S.L.**, based in **Valencia**. Everything is **Spanish-first (España)**.

### A note on positioning
The public site leads with "software de gestión de **calidad** y mejora continua". Internally the positioning is broader and is the one this system uses: **a transversal layer that aligns the human operations of the factory** — quality is one of the things it improves, not the whole story. Copy should favour *operaciones, equipos, áreas, visibilidad* over a pure "quality tool" framing.

> ### ⚠️ This system was corrected on 2026-06-10
> An earlier draft of this design system was built from a speculative **"Brandbook 2026" proposal** that introduced a purple **"Plasma"** AI accent, a "Solved Copilot" product, DM-Sans-on-dark covers and an "operations OS" repositioning. **None of that is the real brand.** Per the founder's direction, the purple/AI layer has been **removed**, the previous **type system is kept**, and the system now anchors to the real, live brand on trysolved.com. The "Copilot" kit was deleted.

## Sources

- **Live site**: [trysolved.com](https://trysolved.com) — source of truth for real positioning, products, industries, clients, tone and structure. The web landing kit here is a faithful recreation of it.
- **Mounted folder**: `Solved · Brandbook 2026/` — the speculative proposal. Useful only for the **logo** and the **type tokens** (which we keep). Its Plasma/AI/Copilot content is **not** part of the brand.
  - `assets/logotipo-solved.png` — official wordmark (transparent PNG).
  - `fonts/` — DM Sans + Inter variable TTFs.

---

## Index

- `colors_and_type.css` — design tokens (CSS vars) + semantic type classes. Blue + ink + signals + **module accents** (Incidencias blue / Acciones orange / Registros violet). Import this first in any Solved artifact.
- `assets/` — logo wordmark.
- `fonts/` — DM Sans variable TTFs (roman + italic). Inter bundled but unused.
- `preview/` — specimen cards rendered on the Design System tab.
- `ui_kits/`
  - `web/` — **landing faithful to trysolved.com**. `WebNav` · `WebHero` / `WebStats` · `WebLogos` / `WebVideo` / `WebProducts` · `WebBenefits` / `WebValues` / `WebTestimonials` · `WebCTA` / `WebFooter` · `Img`.
  - `app/` — **faithful recreation of the live Solved app**, built from real product screenshots (Inicio · Incidencias · Acciones · Registros · Documentos · OpenSearch, with Tabla/Calendario/Kanban views). Three viewports: **desktop** (`index.html`), **tablet** (same file, responsive icon-rail + FAB ≤1024px), and **mobile** (`mobile.html` — bottom tab bar + FAB + nav drawer + card lists). Interactive — click the sidebar / tabs to navigate.
- `SKILL.md` — agent skill descriptor.

---

## CONTENT FUNDAMENTALS

### Language
**Spanish (España).** Brand name used without article (`Solved centraliza…`, never `el Solved`). Tuteo ("tu fábrica", "tu equipo"). Reader is a manufacturing professional — operario, responsable de calidad, jefe de planta, dirección.

### Voice — three attributes
- **Directo** — verb up front, one idea per sentence (`Reporta tus incidencias`, not "Permite reportar incidencias").
- **Concreto** — datos, áreas, tiempos. Real numbers (90% ahorro, 18% productividad, +2.000 horas, 100% visibilidad). Zero hollow adjectives.
- **Respetuoso** — las personas de la planta son expertas; el software les facilita el trabajo, no las sustituye.

### Tone moves
- Operations-and-teams framing first; "calidad" is a benefit, not the headline identity.
- Real, claimable metrics over hype. The site quantifies everything.
- Editorial italic (`<em>` → Instrument Serif) for a single word of emphasis in big headings (e.g. *fábrica* in the hero). Never bold-shout, never ALL CAPS sentences.
- ❌ Avoid: "¡Optimiza tus operaciones con nuestra increíble plataforma de última generación!" — feria/hype.
- ✅ Prefer: "Producción, mantenimiento y calidad viendo lo mismo, a la vez. Sin pedir el dato dos veces."

### Casing
- Sentence case in headings and buttons (`Solicita una demo`, `Reporta tus incidencias`).
- UPPERCASE only in `.kicker` eyebrows, tracking `0.08em`+.
- Mono (DM Mono) for IDs, data columns, code tokens.

### Léxico Solved
| Palabra | Uso |
|---|---|
| **Incidencia** | el problema que se reporta. Mejor que "ticket". |
| **Acción correctiva** | lo que se hace para resolver una incidencia. |
| **Auditoría** | checklist / ronda de control proactiva. |
| **Área** | producción, mantenimiento, logística, calidad, dirección. |
| **Visibilidad** | lo que el equipo ve sin pedirlo. La palabra que más usamos. |
| **Operaciones** | el marco general; preferido sobre "calidad" como identidad. |
| **Solved** | sin artículo. "Solved centraliza…". |

### Emoji & special characters
- **No emoji.** No decorative glyphs.
- Status uses `●` (U+25CF): `● OK`, `● Crítico`.
- Arrows: `→` after CTAs ("Reporta tus incidencias →"); `↑`/`▶` for UI affordances.
- Em-dash `—` for asides.
- *(The old `✦` "AI sigil" is retired along with the Plasma layer.)*

---

## VISUAL FOUNDATIONS

### Color
- **Marketing (web):** blue + ink only. The brand is calm, light and blue.
- **Product (app) is multi-accent by module** — each module has its own identity colour (sampled from the live app):
  - **Incidencias → blue** `--incidencia #1E6BFF`
  - **Acciones → orange** `--accion #F2700F`
  - **Registros → violet** `--registro #8B4FE0`
  - Workflow status: Abierto blue / En Revisión amber `--st-review` / Cerrado green `--st-closed`. Roles: Responsable blue / Ejecutor orange / Verificador green.
  > The Registros **violet is the real, live module colour** — distinct from the retired speculative "Plasma AI" purple. Scope it to module identity, not as a brand-wide accent.
- **`--blue-600` `#1E6BFF`** is canonical brand: primary CTAs, links, logo, active states. `--blue-700` for hover.
- Canvas is light (`--ink-50 #F4F6FB`). Cards are white with hairline `--ink-100` borders and soft shadows.
- **Status colours are for status only** — never decorative. `--ok #0E9F6E`, `--warn #F59F00`, `--crit #E03131`, `--paused #4A5468`.

### Type — kept from before
- **DM Sans** (variable) — UI, headings, body.
- **DM Mono** — data, IDs, code, mono eyebrows (Google Fonts).
- **Instrument Serif italic** — one-word editorial emphasis only. Never DM Sans italic.
- Scale lives in `colors_and_type.css`. Landing hero runs ~64px; section headings 36–40px; body 16–20px.

### Spacing & layout
- 8px base (`--s-1 … --s-12`). Content max-width ~1180px, centered.
- Generous vertical rhythm between sections (`--s-8`/`--s-12`).
- Marketing cards: white, `--r-3` (16px) corners, `--shadow-1` resting → `--shadow-3` on hover, lift `translateY(-3px)`.

### Shadows & radii
- `--shadow-1` resting cards · `--shadow-2` elevated · `--shadow-3` hero/hover/modals (no coloured glows anymore).
- `--r-1 6px` inputs · `--r-2 10px` small cards · `--r-3 16px` cards & heroes · `--r-pill` buttons/badges/pills.
- **Buttons are pill-shaped** on the marketing site (`--r-pill`), blue primary with a soft blue drop-shadow; hover darkens + lifts 1px.

### Imagery
- Real product screenshots / 3D-ish renders on a `--blue-50` pad (as on the live site).
- Cool, light, clean. No stock people, no grain, no duotone.
- The web kit uses an `Img` component that shows a **branded placeholder** until/unless the real image loads — drop real assets in `assets/` for production.

### Motion
- Quiet. `--ease-standard` 200ms for hovers; `--ease-soft` 320ms for cards. No infinite decorative loops, no bounce. (The old "Plasma motion lexicon" is gone.)

### Iconography
- Icon-light. Outline / ~1.8px stroke, geometric (Lucide-adjacent). `--ink-600` resting, `--blue` active.
- No official icon set is declared by the brand — Lucide-style inline SVGs are a **substitution**. Status still uses the `●` dot.

---

## ⚠️ Caveats / substitutions

1. **Exact web hex/font not pixel-verified.** Per direction we kept the previous type system (DM Sans) and blue `#1E6BFF`; the live site's precise blue/font weren't sampled. If the real site differs, send the values (or a screenshot) and I'll align.
2. **DM Mono + Instrument Serif** load from Google Fonts (not bundled as TTFs). Request official files for offline use.
3. **Landing images are hotlinked** from trysolved.com with a branded placeholder fallback; localise them into `assets/` for production/offline.
4. **App kit** is now a faithful recreation of the live product (from your screenshots), incl. the real per-module colour system. Mock data approximates the "Ultimate Demo 6" account; swap in real data as needed. The OpenSearch charts use that tool's native teal/magenta palette by design (embedded third-party dashboard).
5. **Reverse (white) logo** not bundled — dark surfaces invert the PNG via CSS. Replace with the official reverse asset.
6. The speculative **Solved AI / Copilot** product was removed. The live app *does* have an "AI" nav item, but its UI wasn't provided — it's a placeholder in the kit. Define its treatment from real screens before building it out (and don't resurrect the old "Plasma" purple — the violet now belongs to Registros).
