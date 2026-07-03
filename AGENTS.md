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
└── apps/site/             Vite + React + TS strict website
    ├── src/app/           router, providers, error boundary, 404
    ├── src/chrome/        top bar, sidebar, footer, ⌘K
    ├── src/pages/         landing, get-started, tokens, components, playground
    ├── src/docs/          Showcase, CodeBlock (shiki), PropsTable, ControlPanel
    ├── src/registry/      component docs registry (demos as real code via ?raw)
    └── src/lib/           theme store, search index, hooks
```

- `@fj` alias → `packages/fj-ui` (vite alias + tsconfig paths, react deduped).
- Fonts self-hosted via @fontsource (variable); family names mapped to FJ tokens in site CSS.
- Site chrome icons: `lucide-react` (bundled). Synced FJ `Icon` uses lucide-static CDN (upstream
  convention, documented as-is).
- Layout scale is a site-level `:root` override in `apps/site/src/styles/site.css` (loads after
  `@fj/styles.css`, same pattern as the font-token mapping): `--container` 1180px→1600px,
  `--container-sm` 720px→880px, plus a new shared `--rail-width` (264px) token driving the
  `.docs`/`.playground` sidebar column and the `.showcase` side panel from one place. `.container`
  and `.docs` are `width: 100%` with that as a `max-width`, so the wider cap is fluid below it and
  only caps stretch on very wide displays — no page-by-page overrides needed.

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
  widened; sidebar/showcase/playground rails consolidated onto `--rail-width`

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
- effects (7): TextReveal, Reveal, CountUp, SpotlightCard, AnimatedBorder, Glow, AmbientBackground
Local barrel: `packages/fj-ui/index.ts` (local addition — upstream has no barrel).
Documented on site (32): all synced interactive components — registry entries with playground
controls, generated or custom snippets, examples, props, a11y notes, grouped in
`src/registry/entries/{button,card,badge,core-more,forms,navigation,feedback,overlay,data,effects}`.
Engine: `src/registry/*` (types, snippet serializer), `src/docs/*` (Showcase, ControlPanel,
CodeBlock via fine-grained lazy shiki + JS regex engine, PropsTable, DocSection, CopyIconButton).

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
  doesn't stretch on ultra-wide viewports.

## React Bits influence (patterns, never pixels)

React Bits informed the product experience only — nothing was copied:
- Information architecture: category sidebar + per-component pages with prev/next.
- Preview/Code tabs with a live "Customize" control panel whose knobs rewrite the snippet.
- Copy-code actions everywhere; ⌘K palette over the whole catalog.
- A motion-effects family showcased with replayable, knob-driven demos.
- Restrained landing composition: animated hero, principle cards, live component peek, one
  flagship CTA treatment.
All visuals, tokens, voice, and component APIs are Free Joy's own.

## Site pages

Landing `/` · Get started `/docs/{introduction,installation,usage}` · Tokens
`/docs/tokens/{colors,typography,spacing,motion}` · Catalog `/components` (+ 32 component
pages) · `/playground` · styled 404 · app-level ErrorBoundary · skip link · light/dark/system
theme with no-flash boot script.

## Test topology

- Vitest (jsdom): `src/registry/snippet.test.ts` (serializer), `src/registry/registry.test.ts`
  (catalog integrity), `src/lib/theme.test.tsx` (persistence + root attribute),
  `src/docs/Showcase.test.tsx` (knobs → preview/code, reset). Setup installs an in-memory
  localStorage (Node ≥22 stub shadows jsdom's) and mocks matchMedia/IntersectionObserver.
- Playwright (chromium, against `vite preview` of the production build): landing → docs nav,
  playground → code tab, clipboard copy, catalog filter, theme persistence across reload,
  ⌘K search → navigate, 404, 375px drawer navigation.

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
