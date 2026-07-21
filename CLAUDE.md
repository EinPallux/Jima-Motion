# CLAUDE.md — Jima Motion working agreement

Jima Motion is a **100 % free, no-account, browser-only motion-graphics tool for social media
managers**: pick a template → type your text / drop images → export MP4/WebM/GIF, rendered
entirely client-side. Brand = "Jima Motion"; the editor = "Jima Studio" ("the Studio").
**Current state: docs-only planning is complete; no code exists yet. Start with Phase 0 in
`ROADMAP.md`.**

## Document map (read before building anything)

| Doc | Authority over |
|---|---|
| `PRODUCT_BRIEF.md` | vision, audience, positioning, scope/non-goals, principles |
| `COMPETITOR_RESEARCH.md` | market evidence behind decisions (Jitter, Ccleaf, landscape, SEO) |
| `TECHNICAL_ARCHITECTURE.md` | stack, engine, template SDK, export pipeline, budgets, **ADRs** |
| `DESIGN_ARCHITECTURE.md` | brand tokens, landing spec, Studio UX, a11y, canonical copy |
| `TEMPLATE_LIBRARY.md` | the 12 launch templates, template contract + QA checklist |
| `ROADMAP.md` | phase order, acceptance criteria, risk register, status board |
| `CHANGELOG.md` | Keep-a-Changelog record; updated every phase/release |

Conflicts: the more specific doc wins; ADRs in `TECHNICAL_ARCHITECTURE.md` § 16 win over prose.
If you must deviate, add/amend an ADR in the same PR and note it in `CHANGELOG.md`.

## Hard product rules (never violate; reject work that does)

1. **Free means free:** no accounts, login, payments, plans, quotas, watermarks, or dark patterns
   — anywhere, ever.
2. **Client-side only:** no backend, no uploads, no user-content telemetry. User text/images stay
   in the browser (localStorage/IndexedDB). No analytics at launch (ADR-009).
3. **Light/white-mode only.** No dark theme, no `prefers-color-scheme: dark` styling.
4. **No collaboration features** (Jitter's turf — explicit non-goal), no timelines/keyframes for
   users, no AI, no audio in v1.
5. **v1 ships ≥ 10 templates** (12 spec'd; T11/T12 are the only allowed slips).
6. **Determinism:** engine/templates are pure `f(t, values, aspect, seed)`. `Date.now`,
   `Math.random`, network/DOM reads are banned in `packages/engine` and `packages/templates`
   (seeded RNG from context only). Golden-frame diffs without an intentional change = P1 bug.

## Hard dependency rules

- **GSAP is banned everywhere** (its post-Webflow license prohibits no-code animation tools —
  ADR-001). Also banned: Remotion (license), GPL/AGPL runtime deps (Etro), copying code from
  dual-licensed references (openvideodev/DesignCombo — read, don't paste).
- Allowed licenses: MIT / Apache-2.0 / BSD / ISC / MPL-2.0; fonts OFL-1.1. CI license-checker
  enforces this.
- Core stack (verified 2026-07, re-pin at scaffold): Astro 5 + React 19 island (Studio),
  Tailwind 4, TypeScript strict, Zustand, **PixiJS v8 (WebGL)** + custom `JimaTimeline`,
  **WebCodecs + Mediabunny** (MP4/WebM), **gifenc** worker (GIF), lazy ffmpeg.wasm fallback,
  three + @react-three/fiber 9 + drei 10 (landing hero only), pnpm workspace, Cloudflare Pages.

## Workflow

- Follow `ROADMAP.md` phase order; don't start a phase before the prior one's acceptance criteria
  pass. Definition of done for any phase/PR: acceptance criteria met + tests green + budgets green
  + `CHANGELOG.md` entry + ROADMAP status board updated.
- Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`); branches `claude/<topic>`.
- Copy/strings: use the canonical copy deck (`DESIGN_ARCHITECTURE.md` § 9) verbatim; new
  user-facing strings follow its voice rules (plain, warm, honest — name limitations, give a path).
- Templates: every new/changed template must pass the QA checklist in `TEMPLATE_LIBRARY.md` § 5
  (incl. German max-length strings and 4.5:1 end-frame contrast) and update golden frames
  intentionally.

## Commands

*(To be filled in during Phase 0 — planned: `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm lint`,
`pnpm test:golden`, `pnpm posters`. Until then there is nothing to run.)*

## Known pitfalls (pre-researched — don't rediscover these)

- `document.fonts.ready` does **not** load unused faces → always `document.fonts.load()` per
  family+weight before render/export, then `fonts.check()`; else first export renders fallback fonts.
- Firefox `VideoEncoder.isConfigSupported()` can approve H.264 and then fail on `configure()` →
  capability detection must run a real configure/encode smoke test.
- Never export by reading the DPR-scaled preview canvas — render an offscreen target at exact
  output size; re-rasterize Pixi `Text` at export resolution (else blurry text).
- Never use `canvas.captureStream`/MediaRecorder for real exports (realtime-only, drops frames) —
  it's the labeled tier-C fallback only.
- Canvas `font` cannot express variable-font axes → ship static instances per weight.
- mp4-muxer/webm-muxer are deprecated — Mediabunny replaced them (don't "upgrade" backwards).
- Close every `VideoFrame`; respect `encodeQueueSize` backpressure or long exports OOM on mobile.
- Templates must end on a designed hold/loop frame; poster frames come from `posterTime`, rendered
  by the engine in CI (never hand-made screenshots).
