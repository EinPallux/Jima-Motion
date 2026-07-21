# Changelog

All notable changes to **Jima Motion** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Once code exists the
project uses [Semantic Versioning](https://semver.org/); during the docs-only planning stage,
entries are dated documentation drops. Every phase completion in `ROADMAP.md` must add an entry here
— this file is part of the definition of done (see `CLAUDE.md`).

## [Unreleased]

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

### Planned
- Phase 6 — Hardening & release: cross-browser QA, DE/contrast template audit, a11y sweep, v1.0.0
- Phase 6 — Hardening & release: QA matrix, performance budgets, private release

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
