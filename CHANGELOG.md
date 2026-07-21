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

### Planned
- Phase 3 — Studio UI: template gallery, editor form, playback, autosave
- Phase 4 — Template library: 12 launch templates (`TEMPLATE_LIBRARY.md`)
- Phase 5 — Landing page: Three.js/WebGL hero, light-mode brand site
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
