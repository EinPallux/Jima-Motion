# Jima Motion — Roadmap

**Status:** planning complete (2026-07-21), implementation not started.
Phases are strictly ordered by dependency; estimates are indicative engineering effort for one
focused developer with AI assistance, not calendar promises. Every phase ends with: acceptance
criteria met → `CHANGELOG.md` entry → phase marked ✅ here. That bookkeeping is part of the
definition of done (`CLAUDE.md`).

**v1 definition (recap from `PRODUCT_BRIEF.md`):** light-mode marketing site with WebGL hero +
free no-account Studio at `/studio` with ≥ 10 templates (12 spec'd), form-based editing, client-side
MP4/WebM/GIF export up to 1080p. No accounts, no watermark, no collaboration, no audio, no AI.

---

## Phase 0 — Foundation ⏳ *(~2–3 days)*

**Goal:** a deployed, empty-but-real skeleton with all guardrails wired.

Deliverables:
- pnpm workspace per `TECHNICAL_ARCHITECTURE.md` § 5 (`apps/web`, `packages/engine`,
  `packages/templates`, `tests`); Vite 7 + React 19 + React Router + Tailwind 4 + TS strict.
- Design tokens from `DESIGN_ARCHITECTURE.md` § 2–4 as the Tailwind theme; fonts self-hosted with
  license files; `color-scheme: light`.
- CI (`typecheck · lint · unit · build · size-limit`) on GitHub Actions + Vercel Git-integration
  deploy (prod + PR previews — owner connects the repo in the Vercel dashboard once);
  license-checker gate (policy § 3.1); ESLint rule banning `Date.now`/`Math.random`/
  GSAP imports in `engine`/`templates`.
- Placeholder landing ("coming soon" with wordmark) + empty Studio route shell.

Acceptance: `pnpm dev/build/test/lint` all green in CI; production URL serves the skeleton;
budgets wired (failing sizes fail CI); `CHANGELOG.md` updated. Update `CLAUDE.md` § Commands with
the real commands.

## Phase 1 — Motion engine core ⏳ *(~1.5–2 weeks)*

**Goal:** deterministic runtime that can play and seek a real template.

Deliverables:
- `@jima/engine`: Pixi v8 stage management (WebGL forced, context-loss recovery), `JimaTimeline`
  (tweens, staggers, easing set incl. closed-form springs, `steps`), seeded RNG, aspect layout
  helpers + text fit (shrink/wrap), font registry with `document.fonts.load` gating, preview
  player (play/pause/seek/loop/speed).
- Template SDK surface (`TemplateDefinition`, `TemplateContext`) per § 7 + registry.
- **Reference template T01 Kinetic Headline** fully implemented against the SDK (all 4 aspects).
- Golden-frame test harness (Playwright): T01 × 4 aspects × 5 time points, run twice to prove
  determinism; unit tests for timeline/easings/layout.

Acceptance: T01 plays at 60 fps at preview res on reference hardware; identical golden frames
across two runs and across Chromium+WebKit render paths (per-browser goldens); seeking to
arbitrary `t` is exact; no banned APIs (lint green).

## Phase 2 — Export pipeline ⏳ *(~1–1.5 weeks)*

**Goal:** T01 leaves the browser as MP4, WebM and GIF — client-side only.

Deliverables:
- Capability detection module (probe + **real configure smoke test**, Firefox-lie handling, tier
  result per `TECHNICAL_ARCHITECTURE.md` § 4/8.4).
- Deterministic frame-loop exporter: WebCodecs → Mediabunny MP4 (H.264) + WebM (VP9); gifenc
  worker GIF (global palette); progress/cancel; memory backpressure; filename convention.
- Fallback ladder scaffolding: lazy ffmpeg.wasm path (behind explicit user consent), MediaRecorder
  "preview quality" tier; honest capability messaging strings from `DESIGN_ARCHITECTURE.md` § 9.4.
- Export smoke tests in CI (demux + assert frames/duration; fuzzy frame compare).

Acceptance: on Tier A hardware a 4 s 1080p30 T01 MP4 exports ≥ realtime with zero
dropped/duplicated frames (frame count exact); GIF ≤ 8 MB at default profile; cancel is instant
and leaks nothing (VideoFrames closed); Firefox exports WebM without ever being offered a broken
MP4 card.

## Phase 3 — Studio UI ⏳ *(~1.5–2 weeks)*

**Goal:** the full no-account editing loop around the engine.

Deliverables:
- Gallery view (cards, search, category/aspect filters, shared hover-preview renderer, resume
  banner) and editor view (three-zone layout, Content/Style/Motion tabs, aspect switcher, playback
  bar, template rail, undo/redo, reset) per `DESIGN_ARCHITECTURE.md` § 7.
- Export modal (configure → rendering → done/error) wired to Phase 2, per § 7.3.
- Autosave (localStorage + IndexedDB blobs, schema-versioned), restore prompt, clear-all.
- Keyboard map, focus management, aria-live progress, mobile stacked layout + capability floor
  page.

Acceptance: with T01 only — a first-time user goes gallery → edit → export MP4 in < 60 s (scripted
usability run); full flow completable keyboard-only; axe checks pass; state survives reload;
Studio route chunk ≤ 250 kB gz (engine chunk lazy).

## Phase 4 — Template library ⏳ *(~2 weeks)*

**Goal:** ship the 12 launch templates. **This phase is the product.**

Deliverables:
- T02–T12 per `TEMPLATE_LIBRARY.md` (T01 exists), each passing the § 5 QA checklist (all aspects,
  max-length DE/EN strings, palettes ≥ 4.5:1 end-frame contrast, speed extremes sane, empty
  optional fields graceful).
- Golden frames extended to all templates × aspects; poster + OG generation script (engine renders
  them in CI).
- Gallery metadata polish: taglines, category chips, duration badges, poster times.

Acceptance: 12/12 shipped (≥ 10 gate if P1 slips — T11/T12 are the designated slip candidates);
golden suite green twice consecutively; GIF budget met per template; a non-designer produces a
shippable-looking post from each P0 template with only text edits (panel review).

## Phase 5 — Landing page ⏳ *(~1–1.5 weeks)*

**Goal:** the bold, animated, light-mode front door that demos the engine.

Deliverables:
- All sections per `DESIGN_ARCHITECTURE.md` § 6: Three.js/R3F hero (shader gradient + floating
  shapes, pointer parallax, reduced-motion/no-WebGL static fallback), live template rail (shared
  renderer + CI posters), how-it-works vignettes, why-free comparison, feature grid, gallery
  teaser, FAQ, footer.
- Meta polish (title, engine-rendered OG image so shared links look good in chats), privacy
  page, 404. No SEO work (ADR-011).

Acceptance: budgets green (landing route ≤ 220 kB gz initial JS, hero chunk ≤ 180 kB gz lazy,
LCP ≤ 2.5 s mid-tier mobile); Lighthouse perf ≥ 90 and a11y/best-practices ≥ 95 (SEO score
untracked — ADR-011); hero holds 60 fps desktop / ≥ 30 fps mid-tier mobile
and idles when off-screen; reduced-motion audit passes; every animation on the page is
engine-rendered or CSS (no video files, no Lottie).

## Phase 6 — Hardening & release ⏳ *(~0.5–1 week)*

**Goal:** ship v1.0 rock-solid to its real audience — the owner, friends and family (ADR-011).

Deliverables:
- Full manual QA matrix (Tier A/B/C browsers × the flows in `TECHNICAL_ARCHITECTURE.md` § 15),
  fix pass; error-state copy review; final a11y sweep.
- Release polish: README final pass, a short "how to use" note to send along with the link,
  production URL confirmed on Vercel (custom domain optional later — none for now, ADR-011).
- Tag `v1.0.0`, `CHANGELOG.md` release entry.

Acceptance: zero P0/P1 open; QA matrix signed off; `v1.0.0` tagged with CHANGELOG entry; the
production link works logged-out on a friend's device (the "real test" from
`PRODUCT_BRIEF.md` § 8).

---

## Milestone summary

| Milestone | Definition | Cumulative estimate |
|---|---|---|
| **M0** Skeleton deployed | Phase 0 done | ~3 days |
| **M1** Engine plays T01 | Phase 1 done | ~2.5 weeks |
| **M2** First client-side export | Phase 2 done | ~4 weeks |
| **M3** Full editing loop | Phase 3 done | ~5.5 weeks |
| **M4** 12 templates | Phase 4 done | ~7.5 weeks |
| **M5** Landing live | Phase 5 done | ~9 weeks |
| **M6 = v1.0 private release** | Phase 6 done | ~9.5 weeks |

## Post-v1 backlog (ordered; each item must re-pass the free/no-account principles)

1. **More templates, whenever the mood strikes:** themed drops (seasonal/holiday, meme/trend
   formats, poll/engagement frames, lower thirds, hiring posts, audiogram-look) — category gaps
   listed in `COMPETITOR_RESEARCH.md` § 4.3.
2. ~~Programmatic SEO pages~~ — **descoped by ADR-011** (personal deployment); revisit only if
   the project ever goes public.
3. **Share links:** project state URL-encoded (lz-string) — share/remix with zero backend.
4. **Brand kit presets:** saved colors/fonts/logo in localStorage + shareable preset codes
   (Ccleaf-validated), still no accounts.
5. **Transparent WebM (alpha) exports + sticker/overlay template pack** — attacks Ccleaf's premium
   moat with a free answer.
6. **Worker + OffscreenCanvas export migration** (ADR-005 revisit); WebGPU preview evaluation.
7. **Optional sound:** per-template SFX/music toggle (users cite SFX as magic at Ccleaf) — needs
   AudioEncoder/mux support reassessment.
8. **Custom font upload** (FontFace from file, stays local).
9. **i18n** (DE first — templates already QA'd with German string lengths).
10. **PWA/offline** (static app is 90 % there), custom aspect sizes, more export profiles.
Explicitly still out (standing non-goals): accounts, collaboration, keyframe editing, server
rendering, AI credits, dark mode.

## Risk register

| Risk | L×I | Mitigation |
|---|---|---|
| Browser codec variance breaks exports (esp. Firefox H.264 probe lying) | H×H | Tier system + real configure smoke test (Phase 2 acceptance); GIF as universal floor; honest messaging |
| Preview/export perf misses 60 fps / realtime on low-end | M×H | Object-count budgets per template (QA gate), DPR clamp, perf checks in Phase 1/4 acceptance |
| GIF photo banding (T06) | M×M | gifenc→modern-gif swap path pre-designed behind one interface |
| GSAP (or other banned dep) sneaks in via copy-paste | M×H | ESLint import ban + license-checker CI gate (Phase 0) |
| Golden-frame flake across GPUs/browsers | M×M | per-browser goldens, tolerance windows, fixed seeds, CI-pinned browser versions |
| Scope creep toward accounts/collab/AI | M×H | Principles in `PRODUCT_BRIEF.md` § 6 + non-goals list; PRs violating them are rejected by policy (`CLAUDE.md`) |
| Template quality below "looks expensive" bar | M×H | Panel review acceptance in Phase 4; defaults-only test; better 10 great than 12 mediocre (P1 slip valve) |
| Single-maintainer bus factor | M×M | This doc set + CLAUDE.md keep the project resumable by anyone (including future AI sessions) |

## Status board

| Phase | Status |
|---|---|
| Planning & research | ✅ 2026-07-21 |
| Phase 0 Foundation | ⏳ not started |
| Phase 1 Engine core | ⏳ not started |
| Phase 2 Export | ⏳ not started |
| Phase 3 Studio UI | ⏳ not started |
| Phase 4 Templates | ⏳ not started |
| Phase 5 Landing | ⏳ not started |
| Phase 6 Launch | ⏳ not started |

*(Update this table + CHANGELOG.md at every phase transition.)*
