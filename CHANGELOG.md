# Changelog

All notable changes to **Jima Motion** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Once code exists the
project uses [Semantic Versioning](https://semver.org/); during the docs-only planning stage,
entries are dated documentation drops. Every phase completion in `ROADMAP.md` must add an entry here
— this file is part of the definition of done (see `CLAUDE.md`).

## [Unreleased]

_Nothing yet._

## [1.5.0] — 2026-07-21 · Motion-matched sound + editable speed/length

Two owner-requested capabilities across all 95 templates: **fitting sound effects you can toggle**,
and **editable animation speed/length that the export honours**.

### Added — Sound (ADR-012, supersedes ADR-006 "no audio in v1")
- **Procedural, motion-matched SFX for every template.** Sound is **synthesized with the Web Audio
  API** — no sample files are bundled, licensed or fetched (CSP-safe; the client-side + free rules
  hold). Cues are **auto-derived from each template's timeline beats** (`JimaTimeline.beats()` →
  `cuesFromBeats`), so the audio fits the motion — a springy scale-in → a pop, a slide → a swoosh,
  the settle → a ding — with zero per-template authoring.
- **On/off toggle + three sound packs** (Pop, Soft, Retro) in the Motion tab; a persisted global
  preference (defaults on), not a per-template/undoable value.
- **Preview** plays cues live via an `AudioContext` unlocked on the first play/toggle gesture.
- **Export** bakes the same cues offline (`OfflineAudioContext` → `AudioBuffer`) and muxes them with
  Mediabunny — **AAC** for MP4, **Opus** for WebM. GIF stays silent; a browser without an
  AudioEncoder exports silent video (capability probed, never assumed).

### Added — Editable speed / length
- The **Speed & length** slider (0.25×–3×) now shows the resulting clip length and, crucially,
  **changes the exported video** — export remaps frame times by speed (fewer/longer or more/shorter
  frames), so a 2× clip really is half the length. Previously speed only affected the live preview.

### Changed
- `Capabilities` gains `mp4AudioCodec` / `webmAudioCodec` (probed AAC/Opus support).
- Export-smoke suite now asserts a real audio track is muxed when Sound is on (and none when off);
  determinism unaffected — sound is never part of the visual render, so golden frames are identical.

## [1.4.0] — 2026-07-21 · Showcase & product-presentation pack (75 → 95)

Added **20 more templates** — 10 in **Showcase**, 10 for **Product presentation** — all
deterministic (pixel-exact re-seek), all 4 aspects, 4 palettes, image→placeholder degradation,
per-element color fields.

### Added — Showcase
- **Photo Grid** (image mosaic), **Polaroid Stack**, **Before/After Slider** (divider reveal),
  **Carousel Cover** (IG carousel), **Team Grid**, **Testimonial Wall** (star reviews),
  **Feature Spotlight**, **Image Reveal** (scrim + title), **Split Showcase**, **Mockup Tilt**
  (perspective device float)

### Added — Product presentation
- **Product Carousel**, **Product 360** (turntable), **Color Variants** (swatch switch),
  **Product Lineup** (family shot), **Bundle Offer** (computed savings), **Product Detail**
  (magnifier callout), **Unbox Reveal** (box opens), **Size Compare** (dimension guides),
  **Product Review** (stars + quote), **Shop Grid** (collection)

### Changed
- Golden suite now covers **95 templates** (95 determinism re-seek tests + 380 poster frames)

## [1.3.0] — 2026-07-21 · Explainer/showcase/ad pack + editor upgrades (55 → 75)

Added **20 templates for real use-cases beyond text** — explainers, showcases, product
presentations and ads — plus three editor upgrades: editable fonts, a regrouped gallery, and
clearer per-element colors.

### Added — templates (all deterministic, 4 aspects, 4 palettes, images degrade to placeholders)
- **Explainers:** Step Flow, Timeline, Before / After, Comparison (vs table), Feature Callouts
- **Showcases:** Product Showcase, Gallery Strip, Feature Grid, Device Mockup, Review Stars
- **Product & ads:** Product Hero, Pricing Card, New Arrival, Spec Sheet, Spotlight Reveal
- **Data / brand / ads:** Stat Trio, Logo Wall, Countdown (pure-`f(t)` digits), End Card, Sale Banner
- New `showcase` category; the golden suite now covers **75 templates** (75 determinism + 300 posters)

### Added — editor
- **Editable headline fonts** — a "Font" picker in the Style tab swaps the display font across the
  whole template, from 7 curated OFL families (Space Grotesk, Archivo, Sora, Poppins, Outfit,
  Fraunces, JetBrains Mono). New engine `createFontRegistry({headline})` + `FONT_CHOICES`; app and
  render harness load all faces (weights 400–700) so a swap never falls back. Threaded through
  preview, export, persistence, and undo/redo.
- **Gallery regrouped** into browsable use-case sections (Text & titles · Social · Product & ads ·
  Showcase · Explainers & data · Brand & quotes · Events & travel) with a group filter + search;
  the landing teaser uses the same groups.
- **Colors** — a clearer Style-tab "Colors" section for picking background/text/object colors
  individually (palettes are presets); dropped the misleading "(optional)" tag on color fields.

### Fixed
- Three Stats: shrink big numbers to fit their column (the count-up's final value could overflow).
- Logo Wall: use a loaded display weight so chip wordmarks measure correctly and don't clip.

## [1.2.0] — 2026-07-21 · Smooth-text pack (35 → 55)

Added **20 clean, motion-animated text templates** — a focused set of smooth kinetic typography.
Every one is deterministic (pixel-exact re-seek proven in the golden suite), handles all four
aspects, ships 4 palettes, and settles on a clean end-hold.

### Added — engine-side building block
- `layoutChars()` in `shared/words.ts` — kerning-accurate per-glyph layout (word-wrapped), so
  letters can animate individually (used by the per-letter reveals, drops, wave, and decode)

### Added — text templates
- **Word/line reveals:** Fade Cascade, Line Rise (mask reveal), Side Slide, Stacked Build, Focus In,
  Spacing Expand, Push In (dolly)
- **Per-letter:** Letter Reveal, Drop In, Wave (seamless loop), Text Scramble (decode)
- **Word motion:** Flip In, Scale In, Bounce In, Message Rotator (looping crossfade), Emphasis Line
- **Sweeps/reveals (masking):** Shine Sweep, Split Reveal, Curtain Wipe, Box Wipe

### Changed
- Gallery reordered to interleave the text templates with the rest (no single-category block)
- Golden suite now covers **55 templates** (55 determinism re-seek tests + 220 poster frames)
- README / CLAUDE template counts refreshed

## [1.1.0] — 2026-07-21 · Template expansion (12 → 35)

Added **23 new templates**, nearly tripling the library, plus the shared building blocks behind
them. Every new template is deterministic (pixel-exact re-seek proven in the golden suite), handles
all four aspects, ships 4 palettes, and passes the German max-length bar.

### Added — shared engine-side building blocks
- `shared/icons.ts` — a 16-glyph vector icon library drawn from Pixi primitives (play, heart, thumb,
  bell, star, bolt, check, plus, cart, comment, share, bookmark, pin, plane, folder, user);
  deterministic and resolution-independent
- `shared/ui.ts` — `dashedPath`/`arcPoints` (coupon perforations, dashed flight routes), `makePill`,
  `avatar`, `pointerCursor`
- New template categories: **social** and **travel** (with gallery labels)

### Added — templates
- **Social engagement:** Subscribe Bell (YouTube subscribe → bell ring → count-up), Like Spark,
  Follow Pop (TikTok), Double-Tap Heart, Comment Drop
- **Social UI wireframes:** YouTube Frame, Reel Frame (IG/TikTok), Notification Pop
- **Kinetic text:** Kinetic Type, Keynote Reveal (Apple-keynote style), Word Swap (looping),
  Marker Highlight
- **Promo:** Special Offer (starburst seal + price slash), Flash Sale, Coupon Reveal
- **Brand & icon:** Icon Pop, Icon Grid, Badge Stamp
- **Tech:** Folder Open, Card Cascade
- **Travel:** Travel Postcard (dashed flight arc + moving plane), Location Pin
- **Stat:** Stat Bars (animated bar chart with count-ups)

### Changed
- Gallery reordered to lead with a diverse, high-impact mix across categories
- Golden suite now covers **35 templates** (35 determinism re-seek tests + 140 poster frames);
  landing/README/CLAUDE template counts refreshed

## [1.0.0] — 2026-07-21 · v1.0 — private release

First complete release: the full Jima Studio, all 12 templates, client-side MP4/WebM/GIF export,
and the animated WebGL landing page — free, no account, rendered entirely in the browser. Phases
0–6 below are the road to this tag.

### Added — Phase 0 · Foundation (2026-07-21)
- pnpm workspace: `apps/web` (Vite 8 + React 19 + React Router 7 + Tailwind 4, TS strict),
  `packages/engine`, `packages/templates`, `tests`
- Light-mode design tokens (DESIGN_ARCHITECTURE.md §2–4) wired as the Tailwind 4 theme;
  `color-scheme: light`, reduced-motion global handling
- Determinism ESLint guard (bans `Date.now`/`Math.random`/`performance.now`/argless `new Date()`
  in engine + templates) and the GSAP import ban (ADR-001) — both verified firing
- GitHub Actions CI (typecheck · lint · unit · build · size-limit · license policy · golden-frame job)
- `vercel.json` (SPA rewrites, immutable asset caching); size-limit budget (app shell ≤ 220 kB)
- Playwright harness pipeline verified in this environment: **headless WebGL works** (SwiftShader),
  using the pre-installed Chromium — de-risks Phase 1 golden frames
- Placeholder landing + Studio route shells (lazy-split), headless render-harness entry

### Added — Phase 1 · Motion engine core + T01 (2026-07-21)
- `@jima/engine` timeline: exact-endpoint easing families, `spring`/`steps`, mulberry32 seeded
  RNG, and the stateless `JimaTimeline` evaluator (per-property grouped resolution, sequenced
  tweens, discrete sets, stagger) — `evaluate(t)` is a pure function of t
- Layout: aspect sizes, platform safe zones, shrink-to-fit + word-wrap text helpers
- Text: `FontRegistry` with `document.fonts.load` gating (self-hosted OFL Space Grotesk + Inter
  via Fontsource); crisp role-based `makeText`
- Runtime: `SceneRenderer` (Pixi v8, WebGL forced, context-loss recovery), `TemplateRunner`
  (build → seekable `renderAt(t)`), `PreviewPlayer` (rAF-timestamp clock, play/pause/seek/loop/speed)
- Template SDK types + registry; **T01 Kinetic Headline** (pop/rise/slam entrances, 4 aspects,
  4 palettes)
- Render harness (`/harness.html`) driven by URL params, for golden + export tests
- Tests: 36 Vitest unit + 11 Playwright — determinism proven by pixel-exact re-seek and
  fresh-instance equality; golden posters stable across two runs

### Added — Phase 2 · Client-side export pipeline (2026-07-21)
- Capability detection using Mediabunny's real encodability probe (a genuine
  `VideoEncoder.configure` under the hood — the Firefox "claims H.264 then fails" case is
  reported honestly as `mp4:"none"`)
- Deterministic frame-loop exporter: WebCodecs → Mediabunny for **MP4 (H.264)** and **WebM (VP9)**,
  awaiting `source.add` so encoder/writer backpressure is respected (no OOM on long exports)
- **GIF** via gifenc with one global palette sampled across the clip, encoded in a Web Worker
  (main-thread fallback); pure and deterministic
- Orchestrator builds a dedicated runner at the exact output resolution (never reads the
  DPR-scaled preview canvas), reports per-frame progress, cancels via `AbortSignal`, forces even
  dimensions, and names files `jima-<id>-<w>x<h>.<ext>`
- Tier B/C fallback scaffolding (ffmpeg.wasm / MediaRecorder contracts) with honest messaging hooks
- Tests: GIF-encoder unit test (Node) + export-smoke suite that decodes outputs back with
  Mediabunny — WebM verified at exactly 48/48 packets, GIF valid GIF89a under the 8 MB budget,
  cancellation throws `ExportCancelledError`, MP4 auto-skips where no H.264 encoder exists
- Build: the test-only render harness is excluded from the production bundle (app shell 78.6 kB brotli)

### Added — Phase 3 · Studio UI (2026-07-21)
- Gallery: engine-rendered poster cards, search, category filters, resume banner
- Editor: three-zone layout (template rail · live-preview stage with playback scrubber ·
  Content/Style/Motion inspector), aspect switcher, undo/redo with coalesced edits
- All eight field controls (text, textarea, textlist, image dropzone, color, select, slider, toggle)
- Palette-as-preset colour model — selecting a palette fills the color fields (single source of truth)
- Export modal (configure → rendering → done/error) on the Phase 2 pipeline, with capability-aware
  format cards and honest disabled-MP4 messaging; progress + cancel; auto-download
- Autosave to localStorage (+ IndexedDB blob plumbing for images), reload-restore, `?t=` deep-link
- Keyboard map (space/←→/Home/⌘Z/⌘E), reduced-motion handling, mobile stacked layout,
  WebGL2 capability floor
- Live editing rebuilds the scene in place (no WebGL context churn per keystroke)
- `eslint-plugin-react-hooks` added; 4 Playwright studio-integration specs (gallery→edit→export→reload)

### Added — Phase 4 · Template library, batch 1 (2026-07-21)
- **T03 Glow Promo** — living gradient-blob background (resolution-independent radial-glow
  sprites), letter-spacing kicker, slam headline, spring CTA pill; loopable (seamless tail fade)
- **T07 Big Number** — count-up (`update(t)`) with deterministic thousands grouping, landing beat,
  and seeded confetti-burst physics computed as a pure function of t
- **T08 Quote Spotlight** — multi-line word-by-word reveal in Fraunces serif, quote-mark watermark,
  optional circle-cropped avatar from a user image
- Engine: `BuiltTemplate.update(t)` per-frame hook (count-ups/particles as pure f(t)); image-texture
  loading into `TemplateContext.images`; `serif` font role (self-hosted Fraunces); shared glow-texture
  + number-format helpers; poster rendering serialized (one WebGL context at a time)
- Data-driven golden suite over the whole registry (determinism re-seek + poster frames), stable
  across two runs; 4 of 12 templates now shipped (T01, T03, T07, T08)

### Added — Phase 4 · Template library, batch 2 (2026-07-21) → library complete (12/12)
- **T02 Slide & Reveal** (clip-mask line reveals, accent bar), **T04 Product Pop** (card + spring
  product drop + price chip; drifting pattern; image or placeholder), **T05 Typewriter** (mono
  type-on with blinking caret + terminal chrome; prompt lines in accent), **T06 Ken Burns Story**
  (cover-fit photo with a slow zoom/pan, gradient scrim, safe-zone caption; gradient placeholder),
  **T09 Logo Sting** (spring logo pop + shape/ring burst), **T10 Save the Date** (clockwise border
  draw, masked event name, rolling date groups), **T11 Tips Stack** (built-in checklist with
  check/number/arrow markers; duration scales with items), **T12 Split Duo** (vertical/diagonal
  panels wipe to the seam, punch/spin VS badge; images or color)
- Engine: `mono` font role (self-hosted JetBrains Mono); shared vertical-scrim texture helper
- Golden suite now covers all 12 templates × 4 aspects (48 poster frames) + 12 determinism
  re-seek tests, stable across two runs

### Added — Phase 5 · Landing page (2026-07-21)
- Sticky navbar; **Three.js/R3F WebGL hero** — custom fbm-noise pastel gradient shader + floating
  glossy pebbles + pointer parallax (native fullscreen quad + float, drei dropped); inline **live
  T01 rendered by the engine**; reduced-motion / no-WebGL static-gradient fallback
- Marquee template rail, how-it-works, why-it's-free comparison table, feature grid, filterable
  gallery teaser (deep-links into the Studio), FAQ accordion, footer with clear-data
- Engine (Pixi) and Three.js are both lazy-loaded after first paint — landing initial 80 kB brotli;
  hero chunk 192 kB brotli (lazy). Every page animation is engine-rendered or CSS (no video/Lottie)
- 3 landing smoke tests (CTA → Studio, gallery deep-link, FAQ accordion)

### Changed — Hero rework (2026-07-21)
- Rebuilt the landing hero into a **3D "motion tile"** scene (Three.js/R3F): an ember rounded-rect
  card with a play glyph swaying gently above an isometric grid platform, a soft contact shadow, and
  a frosted-glass pill nav + FORMATS strip — replacing the earlier gradient-shader-and-pebbles hero,
  in the Jima ember palette. Static-image fallback for reduced-motion / no-WebGL is unchanged in spirit
- `HeroBackground` is still fully lazy (Three.js never blocks first paint); the old `LiveTemplate`
  inline render was removed with the shader hero

### Added — Phase 6 · Hardening & v1.0 release (2026-07-21)
- **Accessibility sweep:** automated axe-core (WCAG 2.0/2.1 A + AA) pass over landing, gallery, and
  editor — zero serious/critical violations. Fixes: the live-preview `<canvas>` now carries a
  descriptive `aria-label`; muted body copy moved off low-opacity ink onto the `slate` token so every
  text/background pair clears 4.5:1
- **Engine-rendered OG image** (`apps/web/public/og.png`, 1200×675) so shared links preview well —
  a real T01 render, regenerable via `pnpm exec playwright test og-image`; `og:image` + Twitter
  summary-card meta wired into `index.html`
- **German max-length + end-frame contrast audit** across the templates — long DE strings
  (`Benachrichtigungen`, `Veröffentlichungen`, `SOMMERSCHLUSSVERKAUF`, `Motion-Design-Studio`) shrink
  and wrap inside the safe zone without overflow on T01/T03/T08 spot-checks
- README rewritten for the shipped product with a short "how to use / how to share" note

### Fixed — Phase 6
- The preview canvas's accessible name is now a generic "Live animation preview" — embedding the
  template name (e.g. "Kinetic Headline") collided with form-field labels like "Headline" under
  accessible-name lookups (tripped Studio integration tests)
- Playwright test timeout raised to 60s + one CI retry: Studio end-to-end flows are CPU-bound under
  headless SwiftShader WebGL and can overrun a 30s budget when workers overlap

### Known limitations at v1.0
- Automated cross-browser QA in this environment is Chromium-only (headless SwiftShader); Safari,
  Firefox and real mobile devices are for the owner to spot-check. MP4/H.264 export depends on a
  platform encoder — where none exists the Studio honestly offers WebM + GIF instead

## [0.1.1] — 2026-07-21 · Owner decisions folded in

### Changed
- Re-scoped as a **personal project** (owner + friends/family) — SEO, marketing, launch assets
  and trademark checks removed from all docs; new **ADR-011** records the decision
- Stack: Astro + React island → **Vite 8 + React 19 SPA** (ADR-003 amended — SEO descoped)
- Hosting: Cloudflare Pages → **Vercel** via Git integration (ADR-008 amended)
- Confirmed by owner: Ember brand palette, English-only UI, no custom domain for now; work mode =
  Phases 0–2 autonomous (on explicit go-ahead), then pause for visual review

## [0.1.0] — 2026-07-21 · Planning drop

### Added
- `README.md` — project overview and doc map
- `CLAUDE.md` — working agreement, guardrails, and conventions for AI-assisted development
- `PRODUCT_BRIEF.md` — vision, audience, positioning, scope and non-goals for v1
- `COMPETITOR_RESEARCH.md` — deep research: Jitter, Ccleaf, and the wider template-motion market
- `TECHNICAL_ARCHITECTURE.md` — stack decisions, motion engine, template SDK, client-side export pipeline
- `DESIGN_ARCHITECTURE.md` — brand system, light-mode design tokens, landing page and Studio UX specs
- `TEMPLATE_LIBRARY.md` — specification of the 12 launch templates (10 × P0, 2 × P1)
- `ROADMAP.md` — phased build plan with milestones, acceptance criteria, and risk register
- `CHANGELOG.md` — this file

### Decided
- Product is 100 % free: no account, no login, no payment, no watermark
- All rendering and export happens client-side in the browser; user content never leaves the device
- Website is light/white-mode only
- v1 explicitly excludes collaboration, accounts, timelines/keyframe editing, and server rendering
