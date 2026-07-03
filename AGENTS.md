# FJ — Free Joy design system website

Last updated: 2026-07-03 (all 9 phases complete + wide layout pass, all suites green)
Workspace: `/Users/llfzzz/Desktop/FJ`

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

## Component inventory

Synced foundations: `styles.css`, `tokens/{colors,typography,spacing,motion,fonts,base}.css`,
`assets/{logo-mark,logo-wordmark}.svg`, `readme.md`.
Synced components (29):
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

fj-effects (23, LOCAL package `packages/fj-effects/`, consumed via `@fj-effects`):
- effects-text (4): GradientText, RotatingText, AnimatedUnderline, Highlighter
- effects-interaction (4): Magnetic, TiltCard, Tactile, CursorSpotlight
- effects-surfaces (2): Shimmer, Float
- effects-backgrounds (5): Aurora, GridPattern, NoiseOverlay, Sparkles, ConfettiBurst
- effects-status (3): SuccessCheck, ErrorShake, LoaderDots
- effects-motion (5): StaggerList, ScrollProgress, FadeSwitch, Collapse, ThemeTransition (+ runThemeTransition)
Motion primitives: `packages/fj-effects/motion/{useReducedMotion,useInView,useTrigger,keyframes,types}.ts`.

Documented on site (55): all 32 synced interactive components + 23 fj-effects — registry entries with
playground controls, generated/custom snippets, examples, props, a11y notes, and a 4-format
implementation switcher (JS/TS/CSS/Tailwind), grouped in `src/registry/entries/{button,card,badge,
core-more,forms,navigation,feedback,overlay,data,effects,effects-text,effects-interaction,
effects-surfaces,effects-backgrounds,effects-status,effects-motion}`.
Engine: `src/registry/*` (types, snippet serializer, `impl/` 4-format raw-source loader),
`src/docs/*` (Showcase w/ Replay, ImplementationBlock, ControlPanel, CodeBlock via fine-grained lazy
shiki + JS regex engine, PropsTable, DocSection, CopyIconButton). Code-style store: `src/lib/codeStyle.tsx`.

## Local patches

- `packages/fj-ui/tokens/fonts.css` — upstream `@import`s Google Fonts CDN; replaced with a
  comment (fonts self-hosted via `@fontsource-variable/*` in `apps/site/src/main.tsx`, family
  names mapped to `--font-*` tokens in `apps/site/src/styles/site.css`). Same approach the
  upstream consumers use; marked `FJ-LOCAL-PATCH` in the file.

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

## React Bits influence (patterns, never pixels)

React Bits informed the product experience only — nothing was copied:
- Information architecture: category sidebar + per-component pages with prev/next.
- Preview/Code tabs with a live "Customize" control panel whose knobs rewrite the snippet.
- Copy-code actions everywhere; ⌘K palette over the whole catalog.
- A motion-effects family showcased with replayable, knob-driven demos.
- Restrained landing composition: animated hero, principle cards, live component peek, one
  flagship CTA treatment.
All visuals, tokens, voice, and component APIs are Free Joy's own.

## Implementation code (4 formats)

Every documented component exposes its full implementation in four styles via a global
code-style switcher (JavaScript / TypeScript / CSS / Tailwind), in a new "Implementation"
DocSection on each component page. State lives in `src/lib/codeStyle.tsx` (React context +
`localStorage('fj-code-style')`, default `ts`), rendered by `src/docs/ImplementationBlock.tsx`
(FJ `SegmentedControl` + `CodeBlock` + notes + a not-applicable panel).

- **Sources** are raw text, loaded lazily via `import.meta.glob(..., { query: '?raw' })` in
  `src/registry/impl/index.ts`. Each `ComponentDoc.implementation = impl('<id>', opts?)`.
- **JavaScript** = the real source. For `fj-ui` components it's the synced `.jsx` file itself
  (glob over `packages/fj-ui/components/*/*.jsx`) — it can never drift. For `fj-effects`
  components it's a generated type-stripped port under `src/registry/impl/generated/<id>.js.txt`
  (esbuild `jsx:'preserve'`, produced by `scripts/gen-impl-js.mjs` via `pnpm gen:impl`, committed).
- **TypeScript** = for `fj-ui`, a hand-authored port under `src/registry/impl/sources/<id>.ts.txt`
  (the `.jsx` merged with its `.d.ts`); for `fj-effects`, the real `.tsx` source (glob).
- **CSS** = a self-contained HTML+`<style>` reproduction, `sources/<id>.css.txt`, highlighted with
  the Shiki `html` grammar. **Tailwind** = a JSX+utilities reproduction, `sources/<id>.tailwind.txt`,
  referencing FJ token vars (`bg-[var(--accent)]`) so both themes work; an optional shared `@theme`
  mapping (`sources/_tailwind-theme.txt`) is shown on the Installation page.
- Sources are `.txt` so `tsc` doesn't type-check standalone ports (which import modules that don't
  exist as compiled files). `registry.test.ts` + `impl/impl.test.ts` guard content instead.
- Where CSS/Tailwind genuinely can't reproduce JS-driven behavior, `impl('<id>', { notApplicable })`
  supplies a reason panel instead of code (e.g. CountUp — counting needs JS on scroll).

**DesignSync drift rule**: the JS variant of an fj-ui component is the synced file, so it never
drifts; the TS/CSS/Tailwind ports are hand-authored and *can*. After any DesignSync pull that
touches `packages/fj-ui/components/`, run `pnpm test` (the registry drift canary asserts every
documented prop name appears in the TS port) and re-verify the affected `sources/<id>.*.txt`.

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

Additions (23, in six IA sub-categories — see `EFFECT_CATEGORIES` in `registry/types.ts`):
- **effects-text**: GradientText, RotatingText, AnimatedUnderline, Highlighter
- **effects-interaction**: Magnetic, TiltCard, Tactile, CursorSpotlight
- **effects-surfaces**: Shimmer, Float
- **effects-backgrounds**: Aurora, GridPattern, NoiseOverlay, Sparkles, ConfettiBurst
- **effects-status**: SuccessCheck, ErrorShake, LoaderDots
- **effects-motion**: StaggerList, ScrollProgress, FadeSwitch, Collapse, ThemeTransition

**Performance rules**: animate `transform`/`opacity` only (no layout-shifting properties); no
parallax, no flashing; blur radii and particle counts are hard-capped; `performance="lite"` has a
documented per-effect meaning (Sparkles: half the particles; Aurora: lower blur; TiltCard: no glare
layer; ConfettiBurst: cap 20). Decorative loops stay in effects only — never dense product UI.
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

Landing `/` · Get started `/docs/{introduction,installation,usage}` · Tokens
`/docs/tokens/{colors,typography,spacing,motion}` · Effects gallery `/effects` · Motion & effects
guide `/docs/effects-guide` · Catalog `/components` (+ 55 component pages) · `/playground` · styled
404 · app-level ErrorBoundary · skip link · light/dark/system theme with no-flash boot script
(the toggle crossfades via `runThemeTransition` / View Transitions).

## Test topology

- Vitest (jsdom): `src/registry/snippet.test.ts` (serializer), `src/registry/registry.test.ts`
  (catalog integrity + 4-format completeness), `src/registry/impl/impl.test.ts` (Button source
  markers + drift canary; fj-effects generated-JS staleness canary + TS source names), `src/lib/
  theme.test.tsx`, `src/lib/codeStyle.test.tsx` (default/persist/restore), `src/docs/Showcase.test.tsx`,
  `src/test/effects/primitives.test.tsx` (useReducedMotion / useTrigger / ensureKeyframes / easeVar),
  `src/test/effects/behaviors.test.tsx` (Collapse open/close, FadeSwitch swap, SuccessCheck +
  Sparkles reduced-motion fallbacks, particle cap). Setup installs in-memory localStorage and mocks
  matchMedia (per-test override for reduced motion) + IntersectionObserver. **42 tests.**
- Playwright (chromium, against `vite preview` of the production build): `site.spec.ts` (landing nav,
  playground → code tab, clipboard copy, catalog filter by "Text effects", theme persistence, ⌘K,
  404, 375px drawer), `implementation.spec.ts` (default TS, format switch, copy + cross-page
  persistence, n/a panel), `effects.spec.ts` (gallery render/filter/link, Replay remount),
  `reduced-motion.spec.ts` (`page.emulateMedia({ reducedMotion: 'reduce' })` — TextReveal plain text,
  Sparkles zero particles, gallery still renders). **16 tests.**
  Note: `page.emulateMedia({ reducedMotion })` (in a beforeEach) drives the JS `matchMedia` hook;
  the context-level `test.use({ reducedMotion })` did NOT reach `matchMedia` in this setup.

## Known limitations / intentional debt

- FJ `Icon`, `CommandMenu`, `Toast`, `EmptyState`, `SegmentedControl` render Lucide glyphs from
  the unpkg CDN (upstream convention) — offline dev shows missing glyphs there; site chrome uses
  bundled `lucide-react`. Self-hosting the FJ glyph pipeline is a future upstream change.
- 44 of 89 upstream components are synced; the long tail (pickers, DataGrid family,
  RichTextEditor, Tree/Transfer, Lightbox/Tour…) syncs on demand via the same DesignSync flow.
- The playground has no density knob on purpose: FJ component paddings are design decisions,
  not tokens.
- Upstream `Button accent="sun"` uses `var(--ink)` for text-on-accent, which flips near-white in
  dark mode (contrast fail on yellow); the playground pins literal ink. Worth an upstream fix.
- No deployment target configured (private site); `pnpm build` emits a static `dist/`.

## Next steps

1. Sync + document the remaining navigation family (Accordion, Breadcrumb, Pagination, Stepper).
2. Pull `Result`/`LoadingOverlay` to complete feedback; add them to the catalog.
3. Consider pushing local findings upstream via /design-sync (sun-accent contrast, alias
   re-declaration note for nested theme scopes).
4. Data family expansion (List/Stat/KeyValue/Timeline are small; DataGrid is the big one).
5. Optional: per-page code splitting if the main bundle (≈370 kB) starts to matter.
