# Design system

The site is built from what Dr. Ghada already uses on Instagram: her pink
water banner, her white display wordmark, and the line "A Blissful Facial
Journey". The job was to take that and make it feel editorial and calm, not to
invent a new brand.

## Sources

| Asset | Where it came from |
| --- | --- |
| Wordmark (`public/images/brand/wordmark.svg`) | Traced from her 3-tile Instagram banner (Dec 2024). Flowers and the "Medical Esthetician" line were left out. `scripts/trace-wordmark.mjs` |
| Pink water textures | Crops of the same banner. `scripts/build-images.mjs` |
| Treatment swatches | Drawn in SVG by `scripts/build-images.mjs`. Abstract on purpose: they must never read as patient or clinic photos. |
| Brand pink `#FCA6D6` | Sampled from the banner. |

## Colour tokens

Three layers, all in `src/app/globals.css` (`@theme`):

1. **Primitives**: the palette. Only the semantic layer refers to them.
2. **Semantic**: what a colour is for. Components use only these.
3. **Component**: per-component variables, like `--btn-bg`, `--btn-fg` and
   `--btn-fill-hover` on buttons, set from the semantic layer.

| Primitive | Hex | Notes |
| --- | --- | --- |
| `ink` | `#2A1420` | 9.7:1 on petal |
| `plum` | `#5B4452` | 8.2:1 on porcelain, 4.8:1 on petal |
| `porcelain` | `#FBF6F3` | |
| `blush` | `#F9E4ED` | |
| `petal` | `#FCA6D6` | Her pink, sampled from the banner |
| `berry` | `#9C2A62` | 6.7:1 on porcelain |
| `line`, `line-light` | ink at 14%, porcelain at 18% | |

| Semantic | Maps to | Use |
| --- | --- | --- |
| `surface` | porcelain | Page background |
| `surface-muted` | blush | Quiet alternate sections |
| `surface-brand` | petal | Hero, About frame, follow card, 404 |
| `surface-inverse` | ink | Dark sections, primary buttons, mobile menu |
| `fg` | ink | Text, and small ink marks (cursor, progress bar) |
| `fg-muted` | plum | Secondary text |
| `fg-inverse` | porcelain | Text on ink or on the pink water |
| `accent` | petal | Accents on dark backgrounds |
| `accent-strong` | berry | Accents, links and hover on light backgrounds |
| `hairline`, `hairline-inverse` | line, line-light | Rules and borders |
| `focus` | berry, remapped to petal inside `[data-theme='dark']` | Focus rings |

Pink is a surface, not a text colour on light backgrounds. Values that CSS can't
reach (the share image, the browser theme colour, the WebGL water) come from
`src/lib/tokens.ts`, which mirrors the primitives; change both together.
Breakpoints used in scripts live in `media` in `src/lib/motion.ts`.

## Type

- **Wordmark**: her own lettering (SVG). Used in the hero, header and footer only.
- **Fraunces** (variable weight + `opsz`): all headings. Light (300) at display
  sizes. The italic is a separate, non-preloaded file, kept for her own phrases and single accent words.
- **Instrument Sans**: body, UI, labels. Labels are 12px caps at 0.2em tracking.

Scale (fluid): hero wordmark ~62vw; `t-h1` 2.9→7.5rem; `t-h2` 2.25→4.75rem;
`t-statement` 1.75→3.6rem; `t-lead` 17→20px; body 16px/1.65.

## Layout

12-column grid, `container-site` max 1600px, gutters `clamp(1.25rem, 4vw, 3.5rem)`.
Sections breathe: `clamp(6rem, 12vw, 12rem)` vertical padding. Hairlines
(`ink/14%`) instead of cards. Corners stay square except pill buttons.

## Motion

| Moment | Treatment | Timing |
| --- | --- | --- |
| First load | Porcelain curtain lifts off pink water, wordmark lines wipe in | ~1.4s total, once per session |
| Headings | Lines rise from masks (SplitText) | 1.1s `expo.out`, 0.08s stagger |
| Statement | Words brighten as you scroll | scrubbed |
| Images | Clip-path reveal + slow settle from 1.15 scale | 1.4s |
| Treatment list | Floating preview follows the cursor, rows shift | quickTo 0.5s |
| Instagram | Horizontal track pinned to vertical scroll (desktop only) | scrubbed |
| Hover | Underlines draw left to right, buttons roll their label and pull toward the cursor | 0.5s |

Everything checks `prefers-reduced-motion`. With reduced motion: no smooth
scroll, no curtain, no custom cursor, no pinning, water renders one still frame,
and content is simply there.

## Voice and logo use

See [`brand-guidelines.md`](brand-guidelines.md).
