# FJ — Free Joy design system website

Last updated: 2026-07-02
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

## Commands

- `pnpm dev` — run the site (from repo root)
- `pnpm build` — typecheck + production build
- `pnpm typecheck` — TS project references build check
- `pnpm test` — Vitest (from Phase 7)
- `pnpm e2e` — Playwright (from Phase 7)

## Implementation phases / status

- [x] Phase 0 — scaffold: git, pnpm workspace, Vite React-TS strict app, this file
- [ ] Phase 1 — FJ foundations sync (tokens/styles/assets) + theme store + app shell
- [ ] Phase 2 — core/layout/effects sync + landing page
- [ ] Phase 3 — docs engine (registry, Showcase, CodeBlock, PropsTable, ControlPanel)
- [ ] Phase 4 — core ~18 components documented + effects showcase
- [ ] Phase 5 — ⌘K search, token docs pages, theme playground
- [ ] Phase 6 — a11y + responsive + states polish
- [ ] Phase 7 — Vitest + Playwright + full verification
- [ ] Phase 8 — docs finalization

## Component inventory

Synced: (none yet — Phase 1 pulls foundations, Phase 2+ pulls component families)
Documented on site: (none yet)

## Local patches

(none)

## Verification results

(pending — recorded per phase)

## Known limitations / intentional debt

- FJ `Icon` component renders Lucide from CDN (upstream decision); site chrome avoids it via
  `lucide-react`. Self-hosting the FJ Icon glyphs is a future upstream change.
- Long-tail components (pickers, DataGrid family, RichTextEditor…) are pulled but not deeply
  documented until post-core phases.
