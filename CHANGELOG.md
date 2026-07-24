# Changelog

All notable changes to **Jima Motion** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Once code exists the
project uses [Semantic Versioning](https://semver.org/); during the docs-only planning stage,
entries are dated documentation drops. Every phase completion in `ROADMAP.md` must add an entry here
— this file is part of the definition of done (see `CLAUDE.md`).

## [Unreleased]

_Nothing yet._

## [1.12.0] — 2026-07-24 · +25 templates — 5 each for five sections (249 → 274)

Five new templates apiece for **Lower-thirds, Social, Showcase, Explainers & data, and Events &
Travel**, taking the library to **274**. All deterministic, all 4 aspects, ≥3 palettes (mostly 4),
per-element color fields, decorative toggles, ≥4.5:1 end-frame contrast.

### Added — 25 templates

- **Lower-thirds** (`overlay`, transparent-export-friendly): `chapter-marker` (video-chapter kicker
  + title + rule), `metric-bar` (one-KPI pill with count-up + delta chip), `social-bar` ("Follow
  along" handle chips), `qr-callout` (faux-QR scan card), `sponsor-bar` ("Sponsored by" logo lockup).
- **Social**: `save-post` (bookmark save + toast + count), `share-sheet` (native share tray),
  `action-rail` (vertical Reels/TikTok engagement rail), `goal-tracker` (follower-goal progress bar),
  `notif-stack` (cascading notification pills).
- **Showcase**: `phone-scroll` (scrolling phone mockup), `device-family` (laptop + tablet + phone
  responsive set), `coverflow` (perspective coverflow carousel), `detail-zoom` (guided ken-burns
  with callouts), `contact-sheet` (photo contact sheet with a selected frame).
- **Explainers & data**: `checklist` (ticking checkbox cascade), `mind-map` (central node + branch
  spider), `tier-list` (S/A/B/C tier rows), `scatter-plot` (bubble scatter + trend line),
  `stacked-bar` (100% segmented breakdown + legend).
- **Events & Travel**: `webinar-invite` (register card + host avatars), `lanyard-badge` (swinging
  conference badge), `birthday-card` (confetti celebration), `city-guide` (destination highlights),
  `time-zones` ("meanwhile" world clocks).

### Notes
- Engine, export pipeline and the existing 249 templates are unchanged. `pnpm check` (typecheck +
  lint + unit + build) and size-limit are green; the golden suite for the 25 new templates
  (determinism re-seek + posters, all 4 aspects — 125 tests) passes.

## [1.11.0] — 2026-07-24 · v2 UI redesign — true light mode · emerald · Parkinsans

A full ground-up redesign of the entire app UI (landing + Studio) into a modern-SaaS look. The
template library and render engine are unchanged (all 249 templates render identically).

### Changed
- **True light mode.** Retired the tinted `porcelain`/`mist` surfaces and the ember/orange +
  rainbow-gradient palette for a neutral, un-tinted white/grey system with a single **emerald**
  accent (design tokens rebuilt in `apps/web/src/styles/index.css`; accent text uses emerald-700 for
  ≥4.5:1 on white).
- **Parkinsans** is now the UI/layout typeface across landing + Studio (self-hosted variable font,
  `@fontsource-variable/parkinsans`).
- **In-repo component primitives** (`apps/web/src/ui/`) — `Button`, `Card`, `Badge`, `Container`,
  `SectionHeading`, `Wordmark`/`LeafMark` — shadcn-style, built on Tailwind, no new runtime deps.
- **New landing page** on pure white: a hero with a **live template-showcase** (real animations
  playing in a browser frame), a template marquee, a three-step "how it works", a "why it's free"
  comparison table, a feature grid, a 249-template gallery teaser, an FAQ accordion, and a footer.
- **New brand mark** — an emerald leaf/spark `LeafMark` + Parkinsans wordmark, replacing the ember ✦.
- **Redesigned Studio** — gallery, editor shell (topbar / preview stage / playback bar), inspector +
  field controls, and export modal all restyled to the new emerald/light system.

### Removed
- The three.js / `@react-three/fiber` **3D WebGL hero** and those dependencies — replaced by the
  live template-showcase hero (landing initial + hero chunks both well under budget).

### Notes
- All flows/behaviour preserved. axe-core: zero serious/critical on landing, gallery + editor; the
  landing + Studio smoke suites pass; `pnpm check`, size-limit, and the full golden suite are green.

## [1.10.0] — 2026-07-23 · +50 templates — 10 each for five sections (199 → 249)

Ten new templates apiece for **Lower-thirds, Social, Showcase, Explainers & data, and Events &
Travel**, taking the library to **249**. All deterministic, all 4 aspects, ≥3 palettes (mostly 4),
per-element color fields, decorative toggles, ≥4.5:1 end-frame contrast.

### Added — 50 templates

- **Lower-thirds** (`overlay`, transparent-export-friendly): `ticker-bar` (scrolling news ticker),
  `handle-bar` (social @handle pill), `now-playing` (music overlay + progress + EQ), `caption-pop`
  (karaoke word-by-word), `alert-banner` (drop-down alert), `speaker-card` (speaker intro + avatar),
  `score-bug` (sports score), `logo-bug` (corner channel bug), `timer-badge` (count-up/down badge),
  `topic-chips` (hashtag chips).
- **Social**: `live-badge` (going-live + viewers), `stream-chat` (live chat + superchat),
  `swipe-carousel` (IG carousel), `pinned-comment`, `music-sticker` (spinning disc + marquee + EQ),
  `countdown-sticker`, `slider-sticker` (emoji slider), `new-follower` (toast stack), `tip-jar`
  (super-thanks), `add-yours` (story chain).
- **Showcase**: `laptop-mockup` (lid opens), `tablet-showcase`, `photo-stack-swipe` (swipe cards),
  `grid-zoom` (tile → fullscreen), `spec-sheet`, `hotspot-tour` (numbered hotspots), `feature-tabs`
  (tab switcher), `film-strip` (sprocketed strip), `masonry-reveal`, `orbit-showcase` (orbiting
  features).
- **Explainers & data**: `pie-chart`, `area-chart`, `gauge-meter` (needle + count-up),
  `funnel-chart`, `venn-diagram`, `flowchart` (branching decision), `pyramid-levels`, `radial-bars`
  (concentric rings), `comparison-table`, `growth-arrow` (+% count-up). All count-ups pure in `t`.
- **Events & Travel**: `event-countdown`, `itinerary` (day timeline), `flight-board` (split-flap
  departures), `luggage-tag` (pendulum swing), `weather-forecast`, `hotel-card`, `road-trip` (route
  + travelling car), `rsvp-card`, `event-schedule`, `globe-spin` (spinning globe + pin).

### Changed
- Golden suite now covers **249 templates** (249 determinism re-seek tests + 996 poster frames).

## [1.9.0] — 2026-07-23 · Backgrounds category removed · +45 templates (160 → 199)

Retired the seldom-used **Backgrounds** category and grew every other gallery section by five, for a
net **160 → 199** templates.

### Removed
- **Backgrounds (loop) category** and its six templates (`bokeh-drift`, `confetti-loop`,
  `floating-shapes`, `gradient-flow`, `grid-pulse`, `wave-lines`), plus the `loop` `TemplateCategory`,
  their golden baselines, and the gallery's "Openers & backgrounds" section (now just **Openers**).

### Added — 45 templates (5 per gallery section)
All deterministic, all 4 aspects, ≥3 palettes (mostly 4), per-element color fields, and decorative
toggles — verified for ≥4.5:1 end-frame contrast.
- **Text & titles:** `blur-focus` (camera-snap defocus→sharp), `mask-wipe` (light-edge wipe),
  `stretch-in` (springy vertical unfold), `type-cursor` (typing → caret-morph underline),
  `tape-highlight` (highlighter tape behind a key word).
- **Overlays & lower-thirds:** `corner-tag`, `news-lower-third` (broadcast kicker + LIVE flag),
  `progress-overlay` (chapter/step bar), `side-label` (right-edge bookmark tab), `location-tag`
  (pin-drop callout) — transparent-export-friendly by default.
- **Social:** `reaction-bar` (TikTok action rail + count-ups), `story-progress` (IG story frame),
  `duet-split` (reaction split-screen), `reply-sticker` (comment + slapped reply), `poll-results`
  (animated result bars + winner).
- **Product & ads:** `spec-callouts` (radial leader lines), `swatch-switch` (color cycling),
  `add-to-cart` (button press → flying dot → cart badge), `bundle-stack` (fanned bundle + price),
  `deal-countdown` (t-derived digit roll).
- **Showcase:** `app-screens` (tilted phone row), `photo-fan` (card fan-out), `feature-rotator`
  (spotlight dial), `browser-window` (chrome + URL type + scroll), `photo-develop` (Polaroid develop).
- **Explainers & data:** `donut-chart`, `line-graph`, `process-arrows`, `pros-cons`, `kpi-tiles`
  (all count-ups derived purely from `t`).
- **Brand & quotes:** `quote-mark`, `logo-draw` (monogram stroke-on), `rating-reveal`,
  `brand-lockup`, `signature-sign` (handwriting stroke reveal).
- **Openers:** `film-countdown` (rotating sweep + grain), `iris-open`, `glitch-intro` (seeded
  RGB-split), `zoom-punch` (slam + flash), `blinds-open` (venetian slats).
- **Events & travel:** `ticket-stub` (perforated tear), `boarding-pass` (flip + travelling plane),
  `map-route` (drawn route + marker), `calendar-flip` (page flips to date), `passport-stamp`
  (slam + ink-spread).

### Changed
- Golden suite now covers **199 templates** (199 determinism re-seek tests + 796 poster frames).

## [1.8.2] — 2026-07-21 · Template Library (Studio gallery) overhaul

A full rework of the Studio's template picker for browsing 160 templates.

### Changed
- **Uniform 16:9 previews.** Every card now renders its poster at 16:9, so the grid is even instead
  of ragged (previously each card used the template's default aspect — mixed 9:16 / 1:1 / 16:9).
- **Hover to preview.** Hovering (or keyboard-focusing) a card now plays the template's default
  animation live, looping, via a new `LivePreview` (a short-lived on-hover runner, so at most one
  live WebGL context exists at a time). Respects `prefers-reduced-motion` (static poster only), with
  a "▶ Preview" hint and a small hover-intent delay so scanning the grid doesn't spin up a runner
  per card.
- **Cleaner filtering.** Replaced the stacked grouped sections with a **single sticky toolbar** —
  concept/synonym-aware search (Esc to clear), a horizontal row of **use-case chips with live
  counts** (All 160 · Text 33 · Overlays 7 · Social 28 · …), and a result count — over one uniform
  grid. Empty state offers a one-click "Clear filters".

Studio smoke + axe-core a11y (zero serious/critical) and `pnpm check` all green.

## [1.8.1] — 2026-07-21 · +5 reference-style templates (155 → 160)

Five polished, modern templates modelled on high-quality reference animations (all deterministic,
4 aspects, ≥3 palettes, per-element colors, decorative toggles):

- **`comment-thread`** (social) — a TikTok/IG comment section: stacked comment cards (avatar,
  @username · timestamp, text, heart + like-count, Reply) spring in staggered, with a live
  like-count tick and a bouncing green "NEW" badge.
- **`chat-convo`** (social) — a named DM conversation on a dark backdrop: a pink "Sender" bubble and
  a blue "Replier" bubble (with avatars + tails) pop in, and the last message types out with a caret.
- **`search-type`** (social) — a sleek search bar on a dark glow/scanline background: a query types
  in letter-by-letter with a caret and a nudging mouse cursor.
- **`retro-tv`** (social) — a glowing retro-CRT / vlog frame that powers on, with a staggered row of
  colorful app-icon tiles, a stamped caption pill, and a "Day N" counter.
- **`watermark-drop`** (product) — a product floating (with a soft contact shadow) over a tiled,
  diagonal brand-watermark backdrop that adapts its repeat to the watermark length.

### Changed
- Golden suite now covers **160 templates** (160 determinism re-seek tests + 640 poster frames).

## [1.8.0] — 2026-07-21 · Landing page makeover + new 3D hero

A full visual refresh of the marketing landing page, led by a new hero.

### Changed — Hero
- Replaced the old orange "motion tile" WebGL hero with a **bento layout**: a copy column beside a
  grid of rounded cards. The showpiece card holds a **glossy, iridescent liquid-metal 3D blob** — a
  high-detail icosahedron morphed by GPU simplex-noise displacement (`onBeforeCompile`), finished
  with a clearcoat + iridescence physical material and lit by a **gradient reflection map** in the
  brand anchors. Pure three.js, **no drei, no external HDR/assets** (client-side + CSP + size-budget
  safe; the lazy hero chunk is 192 kB brotli, under its 250 kB limit). Reduced-motion / no-WebGL
  falls back to a soft CSS gradient orb.
- Two supporting bento cards: a "155 templates" stat (lime→sky) and an "every size & format" card
  (MP4/WebM/GIF + aspect chips).

### Changed — rest of the page
- **Navbar** is now a floating rounded-pill bar (frosted on scroll) with a dark primary CTA.
- **How it works** and **Features** cards get gradient number/icon chips, larger radii and a hover
  lift; section headings gain a brand gradient accent — tying the whole page to the hero's gradient
  language.

Landing smoke + axe-core a11y (zero serious/critical), `pnpm check` and both size budgets all green.

## [1.7.2] — 2026-07-21 · +10 social templates (145 → 155)

Ten more **Social** templates (the category grows 14 → 24), all 9:16-first, deterministic, across
all 4 aspects with ≥3 palettes, per-element colors and decorative on/off toggles:

- **`profile-card`** — profile header: avatar (image or placeholder) + name/handle + Follow button +
  a Posts/Followers/Following stat row that counts up.
- **`share-repost`** — a post card + a share icon arcing into a "Reposted" check pill.
- **`story-quiz`** — Instagram story quiz sticker; the correct option highlights with a check.
- **`qa-box`** — "Ask me anything" sticker with a typewriter question + blinking caret.
- **`emoji-float`** — a live-style rising stream of heart/star reactions over a label.
- **`dm-chat`** — a DM conversation: alternating incoming/outgoing bubbles + a typing indicator.
- **`link-in-bio`** — a "Link in bio" pill with a nudging pointer.
- **`verified-pop`** — an account name + a verified checkmark badge that pops in with a ring flash.
- **`giveaway`** — a gift badge + prize line + "how to enter" steps (per-aspect vertical scaling so
  the gift stays in the safe area).
- **`trending-now`** — a "Trending" header + a ranked #1/#2/#3 list, top row emphasized.

### Changed
- Golden suite now covers **155 templates** (155 determinism re-seek tests + 620 poster frames).

## [1.7.1] — 2026-07-21 · Gallery search upgrade + full bug sweep

A smarter gallery search for the 145-template library, and a codebase-wide bug hunt (engine, Studio,
landing, and all templates) with every confirmed defect fixed.

### Changed — Gallery search
- Concept/synonym-aware matching: each template's search haystack now includes its group label and a
  per-category keyword set, so natural queries land ("lower third", "caption", "background",
  "transparent", "intro", "opener" all resolve). Multi-word queries match on every term (AND). Added
  a live result count and Esc-to-clear.

### Fixed — Studio / landing (5)
- **Speed slider ate undo history:** dragging the Motion-tab speed slider fired ~40–55 change events,
  each pushing an undo snapshot and evicting the 50-entry history — real edits became un-undoable.
  Now coalesced into one undo entry per drag (like text edits).
- **Reset blanked the color pickers:** "Reset template" now overlays the palette's colors (like
  opening a template) instead of showing empty/black swatches.
- **Repeated-export blob leak:** each "Export another" now revokes the previous result's object URL
  instead of leaking multi-MB blobs until the modal closed.
- **Stuck transparent toggle:** the error screen's "Try GIF instead" now clears the transparent
  (WebM-only) toggle instead of leaving it on with a non-alpha format.
- **Landing hero WebGL churn:** the hero probed WebGL2 in its render body, minting a throwaway
  context every render; now probed once.

### Fixed — Engine (2)
- **Corrupt GIF on worker failure:** the GIF worker path transfers (detaches) frame buffers; if the
  worker failed *after* the transfer, the inline fallback read empty buffers and emitted a blank GIF.
  It now only falls back when the buffers are intact, else surfaces the real error.
- **Silent opening SFX in preview:** a sound cue at exactly t=0 was skipped on the first play
  (half-open interval) but present in the export; the first pass now fires it, matching the export.

### Fixed — Templates (4)
- **`intro-bars`** revealed its title for ~0.2s *before* the bars covered the frame (title stayed at
  full opacity, hidden only by z-order); it's now hidden until the stack fully covers, so it pops out
  as the bars clear — as intended.
- **Contrast:** white text on the brand orange/pink/blue accent fell below the 4.5:1 QA floor on
  `price-slash`, `discount-burst`, `milestone-counter`, `new-drop` and `unbox-reveal` (incl. their
  default palettes). Darkened those accent shades to clear 5.4–6.0:1 (matching `shipping-badge`).
- **`swipe-up`** poster moved off a mid-nudge frame to the settled resting stack.
- **`feature-tags`** required ≥2 tags before overriding the default, so a single tag can't leave a
  lopsided 2-slot layout.

_No crashes, determinism violations, or toggle-off failures were found — the toggle guarding added in
1.7.0 verified correct across all 145 templates._

## [1.7.0] — 2026-07-21 · +50 templates (95 → 145), new categories & editable decorations

The biggest content drop yet: **50 new templates** across the whole library plus **three new
categories**, and every existing template's decorative accents (the little orange bar, dots, badges…)
are now **switchable on/off**.

### Added — 50 new templates (library 95 → 145)
- **Overlays & lower-thirds (new category `overlay`, 7):** `lower-third`, `name-tag`, `subtitle-bar`,
  `cta-bar`, `topic-bug`, `stat-callout`, `speech-pop` — built for the fresh transparent-WebM export
  (v1.6): drop them straight onto footage. Their plates use palette-only colors so they survive the
  alpha bake even as the background blanks.
- **Openers (new category `intro`, 6):** `channel-intro`, `countdown-intro`, `logo-lines`,
  `neon-sign`, `clap-intro`, `intro-bars`.
- **Background loops (new category `loop`, 6):** `gradient-flow`, `floating-shapes`, `bokeh-drift`,
  `wave-lines`, `grid-pulse`, `confetti-loop` — seamless (frame at t=duration == t=0), driven by
  periodic `update(t)` math seeded once so they stay deterministic.
- **Text & titles (7):** `highlight-sweep`, `outline-fill`, `stamp-text`, `rotating-headline`,
  `gradient-text`, `split-flap`, `underline-grow`.
- **Social (6):** `story-poll`, `hashtag-pop`, `followers-count`, `swipe-up`, `mention-tag`,
  `sticker-pop`.
- **Product & promo (6):** `new-drop`, `feature-tags`, `discount-burst`, `price-slash`,
  `limited-stock`, `shipping-badge`.
- **Data & stats (5):** `progress-ring`, `bar-race`, `percent-fill`, `rating-bars`,
  `milestone-counter`.
- **Testimonial / brand / event (7):** `quote-cards`, `testimonial-slide`, `logo-grid-reveal`,
  `thank-you`, `logo-reveal-mask`, `end-screen`, `event-lineup`.
- Every new template: deterministic, all 4 aspects, ≥3 palettes, per-element color pickers, image→
  placeholder degradation where relevant, German-length-safe, and decorative accents already
  toggleable.

### Added — editable decorations on existing templates
- Purely decorative elements can now be **switched off** per template — the requested "deactivate the
  small orange bar below the text," plus accent dots, badges/stamps, frames, glows, sparkles,
  dividers and connector lines. ~57 of the 95 existing templates gained one or more `toggle` fields
  (e.g. `kinetic-headline` → **Accent bar** + **Accent dot**). All default **on**, so existing looks
  and golden frames are unchanged; flip one off for a cleaner cut.

### Changed
- Gallery gains two sections — **Overlays & lower-thirds** and **Openers & backgrounds** — mapping
  the new `overlay` / `intro` / `loop` categories.
- Golden suite now covers **145 templates** (145 determinism re-seek tests + 580 poster frames).

## [1.6.0] — 2026-07-21 · Transparent (alpha) WebM export

Export any animation with a **transparent background** so it can be dropped straight onto footage in
a video editor — no green-screen keying.

### Added — Transparent background (ADR-013)
- **"Transparent background" toggle** in the Export dialog. When on, the export is a **WebM with a
  real alpha channel** (VP9, alpha kept as packet side data); the Studio blanks the template's
  full-frame background so only the animation's foreground carries through. The result preview sits
  on a checkerboard so the transparency is visible.
- **Fully client-side**, no new deps: the export runner clears the canvas with alpha 0
  (`RunnerConfig.transparent`), a shared `TRANSPARENT_BG` sentinel blanks the background rect across
  the library (91/95 templates have a solid background that goes fully transparent; the other 4 are
  full-bleed photo/panel designs with nothing to knock out), and Mediabunny marks the WebM track
  transparent from the first alpha packet.
- **Honest format guidance in the UI:** transparency needs an alpha-capable codec, so the toggle
  snaps the format to WebM (MP4/H.264 and GIF can't carry smooth alpha). The note also flags that
  **Premiere Pro may import WebM alpha as opaque** — it works in After Effects, DaVinci Resolve,
  CapCut, OBS and the web.

### Changed
- `Capabilities` and the export/harness paths thread a `transparent` flag; export-smoke now asserts
  a transparent WebM is a real alpha track (`canBeTransparent()`), an opaque one is not, and a
  transparent render blanks the background (corner alpha 0). Golden frames unaffected (transparency
  is export-only).

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
