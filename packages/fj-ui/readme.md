# Free Joy — Design System

> **FJ — Free Joy** is a minimalist component library inspired by youth, individuality, and quiet confidence. It balances expressive energy with refined simplicity: clean layouts, generous spacing, modular components, and subtle details that feel free rather than flashy.

This design system lets agents and designers build well-branded Free Joy interfaces — production code or throwaway mocks.

## Sources
No external codebase, Figma, or brand kit was provided. This system was **originated from the written brand brief** (the FJ / Free Joy description). All visual decisions — palette, type pairing, logo, product concept — are first-drafts open to direction from the brand owner. **If brand assets exist (real logo, licensed fonts, color specs), share them and this system will be re-grounded against them.**

The product concept used to demonstrate the system ("a calm home for your creative practice" — publish work-in-progress, keep sketchbooks, share in quiet circles) is an illustrative invention for the UI kits, not a confirmed product spec.

---

## Content fundamentals
How Free Joy writes.

- **Voice:** warm, plainspoken, quietly confident. Never hypey, never corporate. Short declarative sentences.
- **Person:** second person ("your creative practice", "share with people who care"). Brand speaks as a calm peer, not an authority.
- **Tone:** encouraging and unhurried. Celebrates the *making*, not the *metrics*. Anti-virality is a value: "No metrics theatre", "made quietly", "for the joy of it, not the numbers".
- **Casing:** sentence case everywhere — headlines, buttons, nav. The only uppercase is the mono **eyebrow/kicker** label (e.g. `WHY FREE JOY`) with wide tracking.
- **Length:** headlines are short and human ("A calm home for your creative practice."). Body stays under ~2 lines per idea.
- **Emoji:** none. Expression comes from type, color, and space — not emoji.
- **Examples:** "Start your studio", "Start free", "Sketchbooks are here", "Built for the making, not the metrics.", "© 2026 Free Joy — made quietly."

---

## Visual foundations

**Palette.** Low-saturation, iOS-18-light neutrals — a soft near-white **paper** (`#F6F6F4`) ground and a soft near-black **ink** (`#1C1C1A`) for text. One warm primary, **Joy Coral** (`#F2603C`), is reserved for interactive affordances — it lives *inside* buttons, links, and selection so a tap target is always obvious. Blue is **not** used as a primary. Two soft support tints — **Sun** (low-sat yellow) and **Bloom** (lilac) — appear only as small punctuation (badges, icon tints), never as large fills. Imagery, when present, should feel warm and natural, never cold or heavily filtered.

**Type.** Display = **Bricolage Grotesque** (characterful, youthful) with tight tracking (`-0.02em`) and tight leading (1.05) for large editorial headlines. Text/UI = **Hanken Grotesk** (clean, friendly) with generous leading (1.5–1.65) for calm reading. Mono = **JetBrains Mono** for code, metadata, and uppercase eyebrows. Scale is editorial and jumps confidently (88 / 64 / 48 / 36 / 28 …).

**Spacing.** 4px base scale; the system leans on the *upper* end — sections breathe with 48–128px of vertical air. Open and editorial, never dense.

**Radius.** Restrained. Cards/inputs use `12–18px`; interactive pills (buttons, tabs, badges, avatars) are fully rounded (`999px`). No sharp corners, no heavy rounding on rectangles.

**Borders.** Hairline `1px` in warm `--line` (`#DED9CC`) is the primary separator — the system prefers borders over shadows for definition.

**Shadows.** Soft, warm-tinted, minimal. Resting surfaces use `--shadow-xs`; interactive cards lift to `--shadow-md` on hover. Never harsh or dark.

**Backgrounds.** Flat warm paper. Sunken zones (footer, sidebar) step down to `--paper-2`. No textures, no patterns, no full-bleed photographic washes by default.

**Motion.** Quick and gentle. Tokens in `tokens/motion.css`: durations `--dur-instant/fast/base/slow/slower` (80–640ms), easings `--ease-out/in/in-out/emphasized/spring` plus semantic `--ease-enter/exit`, and a `--stagger` unit. Fades and small translates (≤2px lift on cards). No bounce, no parallax; decorative loops live ONLY in the `effects/` family. A global `prefers-reduced-motion` kill switch in `tokens/base.css` collapses every animation/transition; JS-driven effects also check `matchMedia`.

**Hover states.** Buttons darken one step (`--accent-hover`); secondary/ghost fill to `--surface-hover`; cards lift 2px + gain shadow. Links underline.

**Press states.** Buttons shrink to `scale(0.97)`. Quiet, tactile.

**Focus.** A 3px soft Joy-Coral ring (`--ring`) — visible but calm. Overlays trap focus (Modal, Drawer) and restore it on close. Z-order is tokenized (`--z-sticky` … `--z-lightbox` in `tokens/spacing.css`); backdrops use `--overlay` / `--overlay-heavy`; charts use `--chart-1–6`.

**Transparency / blur (glass).** Subtle frosted glass in the iOS-18 spirit: translucent white surfaces (`--glass-bg` ~62%, `--glass-bg-strong` ~78%) with `backdrop-filter: blur(18–30px) saturate(160–180%)` and a hairline highlight border. Use it on bars, nav, sticky chrome, and floating panels — via the `.fj-glass` / `.fj-glass-strong` utilities or `<Card glass>`. Restrained, never heavy or smeared; flat surfaces remain the default.

**Cards.** White surface (or frosted via `glass`), `1px` hairline border, `18px` radius, generous padding (24–32px), `--shadow-xs` at rest. This is the system's signature container.

---

## Iconography
- **Set:** [Lucide](https://lucide.dev) — clean 2px-stroke line icons, matching the system's light, youthful, editorial feel.
- **Substitution flag:** no brand icon set was provided, so Lucide is the chosen standard. If Free Joy has its own icon library, swap it in.
- **Delivery:** the `Icon` component renders Lucide SVGs from CDN (`lucide-static`) via a CSS `mask`, so every icon inherits `currentColor` and can be tinted with any token. Always use `<Icon name="…" />` — never hand-draw SVGs or use emoji. (The lone inline SVG in `Checkbox` is a control affordance, not iconography.)
- **Emoji / unicode:** never used as icons.
- **Logo:** `assets/logo-mark.svg` (rounded-square monogram "FJ" with a Joy-Coral dot) and `assets/logo-wordmark.svg` ("Free Joy" + dot). The dot is the brand's one expressive flourish.

---

## Index / manifest

**Foundations**
- `styles.css` — global entry (links everything below).
- `tokens/colors.css` · `typography.css` · `spacing.css` · `fonts.css` · `base.css`
- Specimen cards: `guidelines/*.card.html` (Colors, Type, Spacing, Brand).

**Components** (`window.FreeJoyDesignSystem_a42e56.<Name>`) — 89 total, each with `.jsx` + `.d.ts`.
- **core:** `Button`, `Icon`, `Badge`, `Card`, `Avatar`, `Divider`, `Tag`, `IconButton`, `CopyButton`, `SplitButton`, `Fab`, `BackToTop`, `Kbd`, `StatusDot`
- **layout:** `Stack`, `Container`, `Grid`, `Text` (typography), `AppShell`, `PageHeader`, `Toolbar`
- **forms:** `Input`, `Textarea`, `Select`, `Combobox`, `FormField`, `Switch`, `Checkbox`, `Radio`, `Slider`, `NumberInput`, `PasswordInput`, `SearchInput`, `Rating`, `FileUpload`, `ImageUpload`, `ColorPicker`, `Calendar`, `DatePicker`, `DateRangePicker`, `TimePicker`, `RichTextEditor`
- **feedback:** `Alert`, `Spinner`, `Tooltip`, `Progress`, `Skeleton`, `Toast` (+ `ToastProvider`, `useToast`), `EmptyState`, `Result`, `LoadingOverlay`
- **overlay:** `Modal`, `ConfirmDialog`, `Drawer`, `Popover`, `Menu`, `ContextMenu`, `CommandMenu`, `Lightbox`, `FullScreenDialog`, `Tour`
- **navigation:** `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`, `Stepper`, `SegmentedControl`
- **data:** `Table`, `DataGrid`, `List`, `Stat`, `KeyValue`, `Timeline`, `Carousel`, `Tree`, `Transfer`, `Cascader`, `InfiniteScroll`, `VirtualList`, `Chart`
- **effects** (showcase-only motion — heroes, onboarding, empty/success states, ONE flagship card per view; every one respects `prefers-reduced-motion`, dark mode, and causes no layout shift): `TextReveal`, `Reveal`, `SpotlightCard`, `AnimatedBorder`, `Glow`, `AmbientBackground`, `CountUp`. These are the only components allowed to loop decoratively — slow and hairline-subtle. Never use them in dense data views, forms, or admin tables.

**Per-component theming.** Beyond the global theme tokens (and `data-theme="dark"`), interactive components accept an `accent` prop — `"coral"` (default), `"sun"`, `"bloom"`, or any CSS color — to recolor a single instance. Components: `Button`/`IconButton`/`SplitButton`/`Fab` (fills), `Tag` (tint), `Slider`/`Progress`/`Rating`/`Stepper`/`SegmentedControl`/`Timeline` (accents), `Chart` (`color`). Each directory has a `*.card.html` demo.

**UI kits**
- `ui_kits/marketing/` — landing page (header, hero, features, footer).
- `ui_kits/app/` — product app (sidebar, feed, right rail).
- `ui_kits/docs/` — React Bits–style component docs site (glass nav, ⌘K search, light/dark, live demos + code + props).

**Assets** — `assets/logo-mark.svg`, `assets/logo-wordmark.svg`.

**Skill** — `SKILL.md` (Agent-Skills compatible).
