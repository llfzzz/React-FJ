# FJ — Free Joy design system website

Last updated: 2026-07-19 (Animation index: gallery + guide pages replaced by a newest-first
stacked Index at /animation; animations re-split into 6 broad categories with explicit addedAt
metadata; Index entry added under Get started)
Repo: `github.com/llfzzz/React-FJ` · Live: `https://reactfreejoy.top` (served from the
`/var/www/React-FJ` deploy clone — see "Deployment" below)

This repository is the **official private website, documentation site, playground, and showcase**
for the **Free Joy (FJ)** component library. This file is the living record of architecture
decisions, implementation progress, component inventory, commands, and verification results.
Update it at every commit-sized step.

## What this project is

A standalone React + TypeScript site — React Bits–level browsing/preview/playground experience,
built entirely in FJ's own visual language. It is NOT a copy of React Bits (no branding, code,
assets, or component names from it) and it does not touch any other local project.

## FJ source of truth

FJ's canonical source is the Claude Design project **"Free Joy Design System"**
(`a42e56e8-d278-47e6-9679-38bc1fc507bb`, owned by the user). It contains 89 components
(`components/{core,layout,forms,feedback,overlay,navigation,data,effects}` as `.jsx` + `.d.ts`),
tokens (`tokens/{colors,typography,spacing,motion,fonts,base}.css` + `styles.css`), brand assets
(`assets/logo-mark.svg`, `logo-wordmark.svg`), guideline cards, and UI kits (marketing / app /
docs). Local mirror lives in `packages/fj-ui/`.

### Sync rules (non-negotiable)

- `packages/fj-ui/` mirrors upstream via the `DesignSync` tool (`get_file` pulls). **Never edit
  synced files locally.** Site-specific adjustments live in `apps/site` (including CSS overrides
  loaded after `@fj/styles.css`).
- The barrel `packages/fj-ui/index.ts` is a **local addition** (upstream has no barrel); it only
  re-exports synced modules.
- If a synced component has a blocking bug, patch it locally, mark the patch with a
  `/* FJ-LOCAL-PATCH */` comment, and record it in the "Local patches" section below.

## FJ design rules (documented from upstream readme; non-negotiable)

- **Palette:** iOS-18-light warm neutrals — paper `#F6F6F4`, ink `#1C1C1A`; ONE accent
  **Joy Coral `#F2603C`** reserved for interactive affordances; Sun (soft yellow) / Bloom (lilac)
  only as small punctuation; low-sat semantics; frosted glass (`.fj-glass`); dark theme via
  `[data-theme="dark"]`.
- **Type:** Bricolage Grotesque (display), Hanken Grotesk (text), JetBrains Mono (code/eyebrows).
  Editorial scale; sentence case everywhere; no emoji; mono uppercase eyebrows are the only caps.
- **Space/shape:** 4px scale, generous vertical air (48–128px sections); radius 12–18px cards,
  pill interactive; hairline 1px borders preferred over shadows; soft warm shadows.
- **Motion:** 80–640ms, gentle (`--ease-out/emphasized/spring`, `--stagger`); fades + ≤2px lifts;
  press scale(0.97); decorative loops only in `effects/`; `prefers-reduced-motion` kill switch.
- **Icons:** Lucide only. **Focus:** 3px coral ring. **Voice:** warm, plainspoken, quietly
  confident; short declaratives.

## Architecture

```
pnpm workspace
├── packages/fj-ui/        synced FJ mirror (jsx + d.ts, tokens, assets) + local barrel index.ts
├── packages/fj-effects/   LOCAL effects package (tsx): motion primitives + effect components
├── deploy/                nginx vhost + update.sh for the reactfreejoy.top deployment
└── apps/site/             Vite + React + TS strict website
    ├── src/app/           router, providers (theme + code-style), error boundary, 404
    ├── src/chrome/        top bar, sidebar, footer, ⌘K
    ├── src/pages/         landing, get-started, tokens, components, effects, playground
    ├── src/docs/          Showcase, CodeBlock (shiki), ImplementationBlock, PropsTable, ControlPanel
    ├── src/registry/      component docs registry + impl/ (4-format raw sources via ?raw)
    └── src/lib/           theme store, code-style store, search index, hooks
```

- `@fj` alias → `packages/fj-ui`; `@fj-effects` alias → `packages/fj-effects` (vite alias +
  tsconfig paths, react deduped). `@fj-effects` prefixes are matched before `@fj` in the alias list.
- Fonts self-hosted via @fontsource (variable); family names mapped to FJ tokens in site CSS.
- Site chrome icons: `lucide-react` (bundled). Synced FJ `Icon` uses lucide-static CDN (upstream
  convention, documented as-is).
- Layout scale is a site-level `:root` override in `apps/site/src/styles/site.css` (loads after
  `@fj/styles.css`, same pattern as the font-token mapping): `--container` 1180px→1600px,
  `--container-sm` 720px→880px, plus a new shared `--rail-width` (264px) token driving the
  `.docs`/`.playground` sidebar column and the `.showcase` side panel from one place. `.container`
  and `.docs` are `width: 100%` with that as a `max-width`, so the wider cap is fluid below it and
  only caps stretch on very wide displays — no page-by-page overrides needed.
- Widening the container exposed a second problem on plain prose pages (Introduction, token
  pages): `.doc-prose`'s 68ch cap is correct for readability, but left a large dead zone to the
  right of it once the content column got wider. Fixed with `src/docs/OnThisPage.tsx`, a shared
  "on this page" rail wired once into `DocsLayout` (not per-page): it reads the current route's
  own `.doc-h2` headings from a ref after render, so any page gets a scroll-spied anchor nav for
  free. Renders `null` below 2 headings, so the catalog (no `DocSection`s) stays single-column;
  `.docs-content:has(.on-this-page)` only reserves the 220px track when the rail actually renders,
  and it's hidden below 1300px viewport width to avoid crowding the sidebar + content column.

## Commands

- `pnpm dev` — run the site (from repo root)
- `pnpm build` — typecheck + production build
- `pnpm typecheck` — TS project references build check
- `pnpm test` — Vitest (from Phase 7)
- `pnpm e2e` — Playwright (from Phase 7)
- `pnpm gen:impl` — regenerate the JavaScript implementation ports (ts-blank-space; committed)
- `pnpm check:impl` — strict-typecheck every authored TSX implementation port

## Implementation phases / status

- [x] Phase 0 — scaffold: git, pnpm workspace, Vite React-TS strict app, this file
- [x] Phase 1 — FJ foundations sync (tokens/styles/assets) + theme store + app shell
- [x] Phase 2 — core/layout/effects sync + landing page
- [x] Phase 3 — docs engine (registry, Showcase, CodeBlock, PropsTable, ControlPanel)
- [x] Phase 4 — core set + effects documented (32 registry entries)
- [x] Phase 5 — ⌘K search (FJ CommandMenu), token docs pages, theme playground
- [x] Phase 6 — a11y + responsive + states polish (skip link, ErrorBoundary, FJ Drawer for
  mobile nav, 375px overflow audit)
- [x] Phase 7 — Vitest (17 tests) + Playwright (8 e2e) + full verification
- [x] Phase 8 — docs finalization (this file)
- [x] Phase 9 — wide layout pass: `--container`/`--container-sm`/`--rail-width` site tokens
  widened; sidebar/showcase/playground rails consolidated onto `--rail-width`; added the
  `OnThisPage` scroll-spied rail so widened prose pages don't leave a dead zone next to the text
- [x] Phase A (A0–A1) — 4-format implementation switcher (JS/TS/CSS/Tailwind) on all 32 synced
  components: raw-source engine (`registry/impl/`), `ImplementationBlock`, global code-style store,
  Showcase Replay button, authored TS/CSS/Tailwind ports, shared FJ Tailwind `@theme` on Installation
- [x] Phase B (B1–B4) — fj-effects package + motion primitives; effects IA split into six families;
  23 new effects with playground + 4-format code; JS-variant generator (`pnpm gen:impl`, esbuild);
  `/effects` gallery + `/docs/effects-guide`; restrained landing motion; theme-toggle crossfade;
  expanded unit + e2e suites; this file
- [x] Phase B5 (B5a–B5c) — 10 more effects (fj-effects 23 → 33): Typewriter, ScrambleText,
  BlurReveal (text); Ripple (interaction); Marquee, ImageZoom (surfaces); Orbs, Waves
  (backgrounds); ProgressRing, PingDot (status) — with registry docs, css/tailwind ports or
  notApplicable reasons, behavior tests, and reduced-motion e2e for Typewriter/Marquee
- [x] Phase C (2026-07-11) — language × styling implementation switcher: 2D variant model
  (`ImplLanguage` × `ImplStyling`), two-picker `ImplementationBlock` with per-file code blocks,
  two-key persisted store with legacy migration, all documented components re-authored as
  synchronized `tsx-css` / `css` / `tsx-tailwind` triples (10 JS-drawn effects marked
  styling-neutral, incl. Phase B5's Ripple / ScrambleText / Typewriter), ts-blank-space generator
  + `pnpm check:impl` strict harness, tests + e2e rewritten for the combo model
- [x] Phase D (2026-07-16) — 7 more effects (fj-effects 33 → 40): WaveText (text); FlipCard,
  CardStack (surfaces); ClickSpark, Dock (interaction); NumberTicker (status); ReorderList
  (motion) — with registry docs, css/tailwind ports (FlipCard, WaveText, NumberTicker) or
  styling-neutral reasons (CardStack, ClickSpark, Dock, ReorderList), and behavior tests.
  Parallax was considered and rejected: the published motion policy bans it (ReorderList took
  the motion slot instead)
- [x] 2026-07-18 — implementation picker redesign: the two `SegmentedControl`s (which rendered as
  four flat buttons) replaced by two `ImplSelect` dropdowns (Language / Style) with format badges
  and a selected dot; `implementation.spec.ts` reworked for the dropdown interaction
- [x] 2026-07-19 — IA restructure (owner request): (1) Design-tokens doc pages removed
  (`pages/tokens/`, `/docs/tokens/*` routes, sidebar group, ⌘K entries — token CSS files untouched);
  (2) Components and Animation are separate top-level modules — sidebar sections with headers,
  topbar/footer links, animation detail pages moved `/components/:id` → `/animation/:id` and the
  gallery `/effects` → `/animation` (old URLs redirect via `docPath()` canonicalization in
  ComponentPage + an `/effects` route redirect); (3) all 47 animations live in ONE category
  `animation` ("Animation types") — the six effects-* categories are gone (entry FILES keep their
  names); (4) component categories collapsed 7 → 4 broad groups: `inputs` (Inputs & actions, 9),
  `navigation` (Navigation, 2), `content` (Content & data, 5), `feedback` (Feedback & overlays, 9).
  New registry API: `componentDocs()` / `effectDocs()` / `docPath()` / module-scoped
  `adjacentDocs()`; `presentCategories()` now returns component categories only. Gallery lost its
  family filter (single category); catalog lists components only. Tests updated (74 unit / 18 e2e,
  incl. new module-split invariants and old-URL redirect coverage).
- [x] 2026-07-19 (later) — Animation index (owner request): the Gallery page and the Animation
  guide page are GONE (`EffectsGalleryPage`, `EffectsGuidePage`; `/docs/effects-guide` and the
  pre-split `/effects` both redirect to `/animation`). `/animation` now serves
  `pages/animation/AnimationIndexPage.tsx` — every animation stacked vertically, newest first,
  each entry with live lazy preview / blurb / category / added date / status badge / copyable
  import line / link to its `/animation/:id` page. Sidebar "Get started" gained an **Index** item
  (→ /animation); the Animation section lists items directly under 6 broad categories (the
  single 'animation' category from the morning's IA pass was re-split same-day):
  `anim-entrance` (Entrance & scroll, 3) / `anim-text` (Text, 9) / `anim-interaction`
  (Interaction, 11) / `anim-ambient` (Ambient & loop, 12) / `anim-transition` (Transition, 4) /
  `anim-status` (Status & feedback, 8). ComponentDoc gained canonical metadata: `addedAt`
  (explicit ISO date, from git authoring history: 20× 2026-07-03, 10× 07-04, 10× 07-10,
  7× 07-17), `updatedAt?`, `status?` ('new' on the 07-17 batch). `animationIndexDocs()` sorts
  addedAt desc + name asc, invalid dates last with a DEV warning — never file mtimes or runtime
  git. Index previews lazy-mount via IntersectionObserver (±300px, unmount when far → rAF/timer
  loops pause; fixed-height slots prevent CLS; ~5 of 47 mounted at any time, verified). No
  package/alias/import-path changes (FJ ships as source; no npm publish or CLI exists).

## Component inventory

Synced foundations: `styles.css`, `tokens/{colors,typography,spacing,motion,fonts,base}.css`,
`assets/{logo-mark,logo-wordmark}.svg`, `readme.md`.
Synced components (49 .jsx files):
- core (14): Button, IconButton, Card, Icon, Badge, Tag, Avatar, Divider, Kbd, StatusDot,
  CopyButton, SplitButton, Fab, BackToTop
- layout (7): Stack, Container, Grid, Text, AppShell, PageHeader, Toolbar
- forms (7 of 21): Input, Textarea, Select, Checkbox, Radio(+Group), Switch, Slider
- navigation (2 of 6): Tabs, SegmentedControl
- feedback (8 of 9): Spinner, Alert, Tooltip, Progress, Skeleton, Toast(+Provider/useToast),
  EmptyState (missing: Result, LoadingOverlay)
- overlay (4 of 10): Modal, ConfirmDialog, Drawer, CommandMenu
- data (1 of 13): Table
- effects (7, synced fj-ui): TextReveal, Reveal, CountUp, SpotlightCard, AnimatedBorder, Glow, AmbientBackground
Local barrel: `packages/fj-ui/index.ts` (local addition — upstream has no barrel).

fj-effects (40, LOCAL package `packages/fj-effects/`, consumed via `@fj-effects`):
- effects-text (8): GradientText, RotatingText, AnimatedUnderline, Highlighter, Typewriter,
  ScrambleText, BlurReveal, WaveText
- effects-interaction (7): Magnetic, TiltCard, Tactile, CursorSpotlight, Ripple, ClickSpark, Dock
- effects-surfaces (6): Shimmer, Float, Marquee, ImageZoom, FlipCard, CardStack
- effects-backgrounds (7): Aurora, GridPattern, NoiseOverlay, Sparkles, ConfettiBurst, Orbs, Waves
- effects-status (6): SuccessCheck, ErrorShake, LoaderDots, ProgressRing, PingDot, NumberTicker
- effects-motion (6): StaggerList, ScrollProgress, FadeSwitch, Collapse, ThemeTransition (+ runThemeTransition), ReorderList
Motion primitives: `packages/fj-effects/motion/{useReducedMotion,useInView,useTrigger,keyframes,types}.ts`.

Documented on site (72): 25 UI components + 47 animations (7 synced fj-ui effects + 40 fj-effects)
— registry entries with playground controls, generated/custom snippets, examples, props, a11y
notes, and a language × styling implementation switcher (JS/TS × CSS/Tailwind). Categories
(2026-07-19 IA): components use `inputs` / `navigation` / `content` / `feedback`; animations use
the six `anim-*` categories (Entrance & scroll / Text / Interaction / Ambient & loop /
Transition / Status & feedback). Entry files keep their historical names
(`src/registry/entries/{button,card,badge,core-more,forms,navigation,feedback,overlay,data,
effects,effects-text,effects-interaction,effects-surfaces,effects-backgrounds,effects-status,
effects-motion}`) — file layout ≠ category.
Engine: `src/registry/*` (types, snippet serializer, `impl/` variant raw-source loader),
`src/docs/*` (Showcase w/ Replay, ImplementationBlock, ControlPanel, CodeBlock via fine-grained lazy
shiki + JS regex engine, PropsTable, DocSection, CopyIconButton). Code-style store: `src/lib/codeStyle.tsx`.

## Local patches

- `packages/fj-ui/tokens/fonts.css` — upstream `@import`s Google Fonts CDN; replaced with a
  comment (fonts self-hosted via `@fontsource-variable/*` in `apps/site/src/main.tsx`, family
  names mapped to `--font-*` tokens in `apps/site/src/styles/site.css`). Same approach the
  upstream consumers use; marked `FJ-LOCAL-PATCH` in the file.
- `packages/fj-ui/tokens/colors.css` — upstream `[data-theme="dark"]` token block removed. Dark
  mode was ripped out of the site entirely at the owner's request (2026-07-04): the topbar theme
  toggle, `src/lib/theme.tsx` (+ its test), the pre-paint theme script in `index.html`, the
  playground light/dark knob, the Installation "Dark mode" section, and the theme e2e test are all
  gone; the landing "2 themes" stat became "motion effects". Site is light-only (no `data-theme`
  attribute; `:root` is light). The `@fj-effects` `ThemeTransition` effect is kept as a library
  primitive but its on-site demo no longer changes color (nothing dark to cross-fade to). Marked
  `FJ-LOCAL-PATCH` in the file; do NOT re-add the dark block on a DesignSync pull.

## Verification results

- Phase 1 (2026-07-02): `pnpm typecheck` + `pnpm build` green. Manual preview: shell renders in
  light + dark (`fj-theme` persisted; system fallback via inline script), glass top bar, mobile
  docs bar + drawer at <900px, 404 route.
- Phase 2 (2026-07-02): typecheck + build green. Landing verified in light + dark at ~610px:
  hero (TextReveal + AmbientBackground), SpotlightCard principles, live component peek grid,
  AnimatedBorder CTA, footer. Gotchas recorded: fj-ui needs `include` + react-type `paths` in
  tsconfig.app.json (files live outside the app); stale `tsc -b` tsbuildinfo can report ghost
  errors — clear `node_modules/.tmp` when in doubt; FJ `Text` uses fixed token sizes, so
  responsive display headings on the site use site CSS clamps (`.section-title`, `.hero-title`).
- Phase 3 (2026-07-02): typecheck + build green. /components/button verified in preview: live
  playground (chips/segmented/switch/input controls), Code tab with shiki snippet that mirrors
  non-default control values, copy button, reset, sidebar auto-built from the registry, catalog
  page with category filter, Introduction/Installation/Usage written. Notes: SegmentedControl
  needs ≤3 options in the 240px panel (4+ render as chips); use fine-grained shiki
  (`shiki/core` + `@shikijs/langs`/`themes` + JS regex engine) — `shiki/bundle/web` ships a
  600K wasm chunk and ~40 language chunks.
- Phase 4 (2026-07-03): typecheck + build green. Catalog lists 32 components across 7 families;
  Modal verified in preview (opens from playground, focus lands inside, aria-label set, Escape
  closes). Landing stats now derive from the registry. Stateful demos (Checkbox/Radio/Switch/
  Slider/Modal/Drawer/Toast) use local demo components with custom `code()` templates; effects
  demos remount on knob change (key=JSON.stringify(values)) so entrances replay.
- Phase 5 (2026-07-03): typecheck + build green. ⌘K verified end-to-end (open → filter "slider"
  → Enter navigates and closes); token pages render live computed values; playground retheme
  verified (sun accent + dark stage). Two design bugs found and fixed: (1) FJ semantic aliases
  (--bg/--text/--border…) compute at :root, so a NESTED data-theme="dark" scope must re-declare
  the aliases locally to re-resolve them (done on .playground-stage); (2) sun accent must pin
  --text-on-accent to literal ink #1C1C1A — var(--ink) flips near-white in dark mode and fails
  contrast on the yellow fill. Upstream FJ Button accent="sun" has the same dark-mode issue —
  worth an upstream fix.
- Phase 6 (2026-07-03): typecheck + build green. Skip-to-content link (visible on focus);
  app-level ErrorBoundary in FJ voice; mobile docs nav swapped to the synced FJ Drawer (focus
  trap + Escape + focus restore for free); 375px audit — no page-level horizontal overflow
  (code blocks and props tables scroll inside their own wrappers); drawer verified full-height
  with focus inside and 39 nav links.
- Phase 7 (2026-07-03): `pnpm typecheck` green · `pnpm build` green · `pnpm test` 17/17
  (4× stable after fixing a shiki-tokenization race in one assertion) · `pnpm e2e` 8/8
  against the production build.
- Phase 9 (2026-07-03): `pnpm typecheck` + `pnpm build` + `pnpm test` (17/17) green. Manually
  verified at 375/768/1920px: landing, catalog, a component detail page, and the playground all
  fill the wider 1600px container with no horizontal overflow; docs sidebar collapses to the
  mobile drawer below 899px as before; prose columns keep their `ch`-based caps so paragraph text
  doesn't stretch on ultra-wide viewports. Follow-up in the same phase: added the `OnThisPage`
  rail (see Architecture) and re-verified at 1100/1920px — catalog stays single-column with no
  reserved TOC space, a component page's Showcase keeps a healthy 668px stage next to the 264px
  customize panel and the 220px TOC, and the rail hides below 1300px with no leftover empty
  column. `pnpm e2e` 8/8 — caught and fixed a pre-existing regression from the earlier
  three-state→two-state theme toggle change: the "toggle persists across reloads" test still
  clicked twice expecting a system→light→dark cycle; updated to one click (light→dark) matching
  the new toggle.
- Phase A/B (2026-07-04): `pnpm typecheck` green · `pnpm build` green · `pnpm test` 42/42 ·
  `pnpm e2e` 16/16 against the production build. Verified in preview: the 4-format switcher on
  Button (JS = the actual synced .jsx, TS/CSS/Tailwind ports), CountUp's CSS/Tailwind n/a panel,
  the six effect categories in the sidebar + catalog chips, the `/effects` gallery (live previews,
  family filter, links), Collapse expand/collapse, the ErrorShake trigger demo, and the landing
  hero (GradientText word + GridPattern texture + Magnetic CTA). Findings: the `esbuild` JS-variant
  generator is committed output — `pnpm gen:impl` must be re-run (and the staleness canary passes)
  after adding an effect; Playwright reduced-motion must use `page.emulateMedia` (context `test.use`
  didn't reach `matchMedia`); the Collapse unit test caught a real bug (content unmounted when
  closed with unmountOnExit off) which was fixed. Nothing under `packages/fj-ui/` was edited.

- Phase C (2026-07-11): `pnpm typecheck` green · `pnpm check:impl` 96/96 ports strict-clean ·
  `pnpm test` 42/42 · `pnpm build` green · `pnpm e2e` 15/15 against the production build.
  Verified in preview: Button's four combos (TS+CSS shows Button.tsx + Button.css with the typed
  class-based port; JS+CSS keeps the stylesheet and drops types; Tailwind collapses to one file
  per language), CountUp's inert Style picker + reason note, both persisted axes surviving
  navigation. Gotchas recorded: (1) a grid `.impl-block` needs `grid-template-columns:
  minmax(0, 1fr)` or the wrap-flex picker bar computes its intrinsic width single-line and
  overflows narrow viewports; (2) ts-blank-space leaves whitespace where types were — the gen
  script tightens runs of 2+ spaces before closers only after a non-space char so indentation
  survives; (3) `size`/`title` props on interfaces extending HTML attributes need `Omit<...>`
  (caught by `pnpm check:impl`, which found real conflicts in Input/Select/EmptyState);
  (4) Tailwind can't see runtime-composed class strings — tone/accent styling rides static
  classes reading `--fj-*` custom properties set inline (fixed a latent `bg-[${t.bg}]` bug in
  the old Alert tailwind port). Nothing under `packages/fj-ui/` was edited.
- Audit pass (2026-07-08): full end-to-end review of every source file. Fixed: (1) Showcase knob
  state leaked between component pages (`/components/:id` keeps the page mounted — Showcase is now
  keyed by doc id); (2) RotatingText defined a shared `@keyframes` name per instance with
  prop-dependent body — instances fought; now two static keyframes via `ensureKeyframes`;
  (3) Sparkles re-randomized on every parent re-render (default array props in useMemo deps —
  hoisted to module constants); (4) the e2e suite was red: three assertions still used pre-rename
  copy ("Motion gallery" ×2, "Text effects"); (5) the ThemeTransition demo visibly did nothing
  since the dark tokens were removed — the demo box now carries a scoped ink/paper "dark" alias
  block in site.css (site stays light-only); (6) ErrorShake ended on bubbled child `animationend`;
  (7) Collapse kept collapsed content keyboard-reachable (now `inert`); (8) ThemeTransition Space
  key scrolled the page; (9) ConfettiBurst with `count={0}` never fired `onDone`; (10) CountUp's
  default snippet omitted its required `value`; missing knob→snippet mappings added (RotatingText
  duration, Aurora performance, Sparkles speed); (11) leftover "both themes"/dark-mode copy swept
  from pages, registry notes, and the 30+ Tailwind impl headers. `pnpm gen:impl` re-run (6 generated
  variants updated). Verified: typecheck ✓ · 38/38 unit ✓ · build ✓ · 15/15 e2e ✓ (results below).

## React Bits influence (patterns, never pixels)

React Bits informed the product experience only — nothing was copied:
- Information architecture: category sidebar + per-component pages with prev/next.
- Preview/Code tabs with a live "Customize" control panel whose knobs rewrite the snippet.
- Copy-code actions everywhere; ⌘K palette over the whole catalog.
- A motion-effects family showcased with replayable, knob-driven demos.
- Restrained landing composition: animated hero, principle cards, live component peek, one
  flagship CTA treatment.
All visuals, tokens, voice, and component APIs are Free Joy's own.

## Implementation code (language × styling)

Every documented component exposes its full implementation through two independent pickers —
**Language** (JavaScript / TypeScript) and **Style** (CSS / Tailwind CSS) — that combine into one
complete, copy-ready variant per combination (React Bits' switcher model, 2026-07-11 redesign).
State lives in `src/lib/codeStyle.tsx` (React context + `localStorage('fj-code-lang')` +
`localStorage('fj-code-styling')`, defaults `ts` + `css`, with a one-way migration from the old
`fj-code-style` key), rendered by `src/docs/ImplementationBlock.tsx` (two dropdown selects +
file-named `CodeBlock`s + styling notes). Each axis is a `src/docs/ImplSelect.tsx` — a site-local
button-plus-listbox dropdown (pill trigger with a mono format badge + chevron; menu options carry
the badge and a coral selected dot; arrows/Enter/Escape/outside-click all handled; the Tailwind
badge is an inline logomark SVG). Redesigned 2026-07-18 from two `SegmentedControl`s — four flat
buttons in a row read as four independent formats instead of two × two axes.

- **Sources** are raw text, loaded lazily via `import.meta.glob(..., { query: '?raw' })` in
  `src/registry/impl/index.ts`. Each `ComponentDoc.implementation = impl('<id>', opts?)` resolves
  a `variants` record keyed `js-css | ts-css | js-tailwind | ts-tailwind`, each a list of files
  (`{ name, lang, load }`).
- **Authored, canonical (committed under `src/registry/impl/sources/`)**:
  - `<id>.tsx-css.txt` — the TypeScript component styled by classes; it `import "./<Name>.css"`.
  - `<id>.css.txt` — the stylesheet those classes live in (pure CSS, `fj-*` class convention,
    custom-property hooks like `--fj-btn-accent` for prop-driven values, reduced-motion rules).
    Shared **verbatim** by both languages, so component and stylesheet can never diverge.
  - `<id>.tsx-tailwind.txt` — the TypeScript component styled by utilities referencing FJ token
    vars (`bg-[var(--accent)]`). Keyframes that utilities can't express are documented in a
    trailing "Add once to your global CSS" comment block.
- **Generated (committed under `src/registry/impl/generated/`)**: `pnpm gen:impl`
  (`scripts/gen-impl-js.mjs`) type-strips each TSX port with **ts-blank-space** (comments and
  formatting survive, unlike esbuild) into `<id>.jsx-css.txt` / `<id>.jsx-tailwind.txt`, rewrites
  the header's "TypeScript" to "JavaScript", drops a react import kept only for types, and deletes
  stale outputs. The JS ports therefore can never drift from the TS ports.
- **Styling-neutral components** (visuals computed in JS: CountUp, RotatingText, Magnetic,
  TiltCard, Sparkles, ConfettiBurst, FadeSwitch, Ripple, ScrambleText, Typewriter, CardStack,
  ClickSpark, Dock, ReorderList) pass `impl('<id>', { stylingNeutral: reason })`:
  the Style picker renders inert with the reason shown, and both styling choices serve the real
  per-language source (synced `.jsx` / authored `ts.txt` for fj-ui; generated `.js.txt` port /
  real `.tsx` for fj-effects). The gen script's `STYLING_NEUTRAL_EFFECTS` list must match.
- `"use client"` appears only in ports that use state, effects, refs, or attach event handlers —
  so they drop into Next.js App Router untouched; Vite ignores the directive.
- Sources are `.txt` so `tsc -b` doesn't type-check standalone ports, but `pnpm check:impl`
  (`scripts/check-impl-ports.mjs`) stages every authored `.tsx-*.txt` as a real `.tsx` (with a
  `.d.css.ts` shim for the stylesheet import) and runs one strict `tsc --noEmit` over all of them.
  Run it after touching any port. `registry.test.ts` + `impl/impl.test.ts` guard content shape.

**DesignSync drift rule**: all four variants are now ports (the synced fj-ui source is no longer
displayed verbatim except for styling-neutral fj-ui components), so after any DesignSync pull that
touches `packages/fj-ui/components/`, run `pnpm test` (drift canary: every documented prop appears
in both TS ports) and re-verify the affected `sources/<id>.*` triple. After editing any
fj-effects `.tsx` that is styling-neutral, re-run `pnpm gen:impl` (staleness canary fails
otherwise).

## Effects audit & motion policy

**fj-effects** (`packages/fj-effects/`, local — NOT synced) adds reusable, configurable motion and
visual-effect components on top of the 7 synced fj-ui effects. Consumed via `@fj-effects`.

Shared motion primitives (`packages/fj-effects/motion/`): `useReducedMotion` (live, single shared
hook — the synced fj-ui effects each ship a private copy; new code uses this one), `useInView`
(IntersectionObserver scroll trigger), `useTrigger` (unifies mount/inview/hover/click/manual +
`replay()`), `ensureKeyframes` (idempotent single `<style data-fj-effects>` injection — dedupes the
per-instance `<style>` tags fj-ui uses), `easeVar` + shared prop types
(`BaseEffectProps`/`TriggeredEffectProps`/`LoopEffectProps`, `TriggerMode`, `PerformanceMode`).

Existing motion (audited, pre-existing): fj-ui effects TextReveal, Reveal, CountUp, SpotlightCard,
AnimatedBorder, Glow, AmbientBackground; plus built-in micro-motion in Spinner, Progress
(indeterminate sweep), Skeleton (shimmer), Toast/Modal/CommandMenu (entrances), StatusDot (pulse),
Drawer (slide), card lifts, button/press scales, the site's CopyIconButton copy-feedback, and the
theme toggle.

Additions (40, in six IA sub-categories — see `EFFECT_CATEGORIES` in `registry/types.ts`):
- **effects-text**: GradientText, RotatingText, AnimatedUnderline, Highlighter, Typewriter,
  ScrambleText, BlurReveal, WaveText
- **effects-interaction**: Magnetic, TiltCard, Tactile, CursorSpotlight, Ripple, ClickSpark, Dock
- **effects-surfaces**: Shimmer, Float, Marquee, ImageZoom, FlipCard, CardStack
- **effects-backgrounds**: Aurora, GridPattern, NoiseOverlay, Sparkles, ConfettiBurst, Orbs, Waves
- **effects-status**: SuccessCheck, ErrorShake, LoaderDots, ProgressRing, PingDot, NumberTicker
- **effects-motion**: StaggerList, ScrollProgress, FadeSwitch, Collapse, ThemeTransition, ReorderList

**Performance rules**: animate `transform`/`opacity` only (no layout-shifting properties); no
parallax, no flashing; blur radii and particle counts are hard-capped; `performance="lite"` has a
documented per-effect meaning (Sparkles: half the particles; Aurora: lower blur; TiltCard: no glare
layer; ConfettiBurst: cap 20; Orbs: ≤3 orbs + blur ≤24; Waves: 2 layers). Decorative loops stay in
effects only — never dense product UI.
Richer motion is reserved for the landing page, hero sections, the effects gallery, empty states,
and selected featured cards; docs prose, props tables, search, and dense content stay restrained.

**Accessibility rules**: decorative layers are `aria-hidden`; text effects keep the full readable
string as the accessible name (`aria-label`); focus is never animated away; nothing relies on color
alone.

**Reduced-motion behavior**: the global CSS kill switch (`tokens/base.css`) collapses CSS
animations/transitions, but it can't stop rAF/timer/pointer JS — so every effect that runs such
logic reads `useReducedMotion()` and returns an explicit static fallback (final value, plain text,
no drift). Reduced-motion fallbacks are covered by a dedicated Playwright spec.

## Attributions

- **React Bits** (MIT) — inspiration for the effects catalog/IA and individual effect *ideas* only.
  No source, assets, branding, or pages were copied; all implementations are original FJ code over
  FJ tokens.
- **Lucide** (ISC) — icons (`lucide-react` bundled in site chrome; `lucide-static` CDN glyphs in
  some synced fj-ui components, upstream convention).
- **Shiki** (MIT) — code highlighting. **Fontsource** variable fonts (OFL) — self-hosted typefaces.
- The repo intentionally ships no root LICENSE file (private product site); this section records
  third-party license status for the reused/inspired work.

## Site pages

Landing `/` · Get started `/docs/{introduction,installation,usage}` + the animation **Index**
nav item · Animation index `/animation` (stacked, newest-first; + 47 animation pages
`/animation/:id`) · Catalog `/components` (+ 25 component pages `/components/:id`) ·
`/playground` · styled 404 · app-level ErrorBoundary · skip link. Old URLs redirect:
`/effects` → `/animation`, `/docs/effects-guide` → `/animation` (both pages retired
2026-07-19), and a doc opened under the wrong module prefix (e.g. pre-split
`/components/aurora`) canonicalizes via `docPath()`. The Design-tokens doc pages were removed
2026-07-19 (`/docs/tokens/*` now 404s; the token CSS itself is untouched). The site is
**light-only** (dark mode removed 2026-07-04);
the topbar has a GitHub button with a live star count (localStorage-cached, refetched daily).
User-facing naming is "Animation" (renamed from "Effects"/"Motion" 2026-07-08); package names
and file names intentionally keep the effects-* convention.

## Test topology

- Vitest (jsdom): `src/registry/snippet.test.ts` (serializer), `src/registry/registry.test.ts`
  (catalog integrity + four-combo completeness: every doc ships js/ts × css/tailwind variants or a
  styling-neutral reason; CSS combos carry the stylesheet as file[1]),
  `src/registry/impl/impl.test.ts` (Button four-variant markers + shared-stylesheet identity +
  drift canary across both TS ports; registry-wide generated-JS staleness canary, no-TS-syntax
  check, and stylesheet-import check), `src/lib/codeStyle.test.tsx` (two-axis default / persist /
  restore / legacy-key migration), `src/docs/Showcase.test.tsx`,
  `src/test/effects/primitives.test.tsx` (useReducedMotion / useTrigger / ensureKeyframes / easeVar),
  `src/test/effects/behaviors.test.tsx` (Collapse open/close, FadeSwitch swap, SuccessCheck +
  Sparkles reduced-motion fallbacks, particle cap; Phase D: FlipCard face swap, WaveText label,
  ClickSpark/Dock caps, NumberTicker columns, CardStack advance, ReorderList order — all with
  reduced-motion fallbacks; IA: module-split invariants — componentDocs/effectDocs partition,
  docPath routing, module-scoped pager, addedAt presence/format, newest-first index order).
  Setup installs in-memory localStorage and mocks matchMedia (per-test override for reduced
  motion) + IntersectionObserver. **76 tests**.
- Playwright (chromium, against `vite preview` of the production build): `site.spec.ts` (landing nav,
  playground → code tab, clipboard copy, catalog filter by "Content & data", ⌘K,
  404, 375px drawer), `implementation.spec.ts` (default TS+CSS with Button.tsx + Button.css,
  combo switching via the two dropdowns, copy + cross-page persistence, styling-neutral inert
  panel at /animation/count-up), `effects.spec.ts` (index stack newest-first with New badge +
  date + import line, chip filter preserving order, gallery/guide redirects, Replay remount),
  `reduced-motion.spec.ts` (`page.emulateMedia({ reducedMotion: 'reduce' })` — TextReveal plain
  text, Sparkles zero particles, index still renders). **19 tests**.
  Note: `page.emulateMedia({ reducedMotion })` (in a beforeEach) drives the JS `matchMedia` hook;
  the context-level `test.use({ reducedMotion })` did NOT reach `matchMedia` in this setup.

## Known limitations / intentional debt

- FJ `Icon`, `CommandMenu`, `Toast`, `EmptyState`, `SegmentedControl` render Lucide glyphs from
  the unpkg CDN (upstream convention) — offline dev shows missing glyphs there; site chrome uses
  bundled `lucide-react`. Self-hosting the FJ glyph pipeline is a future upstream change.
- 49 of 89 upstream components are synced; the long tail (pickers, DataGrid family,
  RichTextEditor, Tree/Transfer, Lightbox/Tour…) syncs on demand via the same DesignSync flow.
- The playground has no density knob on purpose: FJ component paddings are design decisions,
  not tokens.
- Upstream `Button accent="sun"` uses `var(--ink)` for text-on-accent, which flips near-white in
  dark mode (contrast fail on yellow); the playground pins literal ink. Worth an upstream fix.
- FJ `Icon` and friends still CDN-load lucide-static glyphs (see first bullet) — the only runtime
  third-party request besides the GitHub star-count API (which fails soft).

## Deployment

- Live at `https://reactfreejoy.top`, served by nginx straight from
  `/var/www/React-FJ/apps/site/dist` (static SPA; `try_files … /index.html` fallback;
  `/assets/` immutable-cached, `index.html` no-store). Vhost: `deploy/nginx/reactfreejoy.top.conf`
  (TLS via Certbot; the live copy lives in `/etc/nginx/`, the repo copy is the record).
- To ship: merge to `main` on GitHub, then run `deploy/update.sh` in the deploy clone — it
  `git reset --hard origin/main`, `pnpm install --frozen-lockfile`, `pnpm build`. **The deploy clone
  is reset to origin/main, so never leave unpushed commits or uncommitted work there.**
- No server-side services, env vars, or secrets; the repo contains none.

## Next steps

1. Sync + document the remaining navigation family (Accordion, Breadcrumb, Pagination, Stepper).
2. Pull `Result`/`LoadingOverlay` to complete feedback; add them to the catalog.
3. Consider pushing local findings upstream via /design-sync (sun-accent contrast, alias
   re-declaration note for nested theme scopes).
4. Data family expansion (List/Stat/KeyValue/Timeline are small; DataGrid is the big one).
5. Optional: per-page code splitting if the main bundle (≈370 kB) starts to matter.
