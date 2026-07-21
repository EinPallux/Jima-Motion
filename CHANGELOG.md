# Changelog

All notable changes to **Jima Motion** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Once code exists the
project uses [Semantic Versioning](https://semver.org/); during the docs-only planning stage,
entries are dated documentation drops. Every phase completion in `ROADMAP.md` must add an entry here
— this file is part of the definition of done (see `CLAUDE.md`).

## [Unreleased]

### Planned
- Phase 0 — Foundation: repository scaffold, CI, deploy pipeline, design tokens (see `ROADMAP.md`)
- Phase 1 — Motion engine core: deterministic runtime, timeline, preview player
- Phase 2 — Export pipeline: MP4 / WebM / GIF, fully client-side
- Phase 3 — Studio UI: template gallery, editor form, playback, autosave
- Phase 4 — Template library: 12 launch templates (`TEMPLATE_LIBRARY.md`)
- Phase 5 — Landing page: Three.js/WebGL hero, light-mode brand site
- Phase 6 — Hardening & launch: QA matrix, performance budgets, SEO, release

## [0.1.1] — 2026-07-21 · Owner decisions folded in

### Changed
- Re-scoped as a **personal project** (owner + friends/family) — SEO, marketing, launch assets
  and trademark checks removed from all docs; new **ADR-011** records the decision
- Stack: Astro + React island → **Vite 7 + React 19 SPA** (ADR-003 amended — SEO descoped)
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
