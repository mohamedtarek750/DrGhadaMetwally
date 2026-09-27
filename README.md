# Dr. Ghada Metwally

Personal site for Dr. Ghada Metwally, medical facials and laser in New Cairo.
One page: hero, approach, treatments, about, Instagram, booking.

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText) · Lenis · WebGL

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run lint
```

Set `NEXT_PUBLIC_SITE_URL` to the live domain (see `.env.example`). It feeds the canonical
URL, sitemap, robots and structured data.

## Editing content

All copy and facts live in `src/content/`. Components only read from there.

| File | What's in it |
| --- | --- |
| `site.ts` | Name, title, location, Instagram and TikTok links |
| `copy.ts` | Every sentence on the page |
| `treatments.ts` | The treatment list, descriptions and images |
| `journal.ts` | Instagram caption cards, each linked to its post |
| `images.ts` | All images, plus the About `portrait` slot |

Content rules and where each fact comes from: [`docs/content-sources.md`](docs/content-sources.md).
Nothing goes on the page that she hasn't published herself or the owner hasn't confirmed.

## Replacing images

- **Portrait:** put the photo in `public/images/`, import it in `src/content/images.ts` and
  set `portrait = { src, alt }`. The About frame switches from the wordmark to the photo.
- **Treatments:** import a photo and set it as `image` on the treatment. The drawn swatches
  are placeholders and never pass for clinical photos.

## Brand assets and scripts

- `assets/source/`: her Instagram banner tiles (Dec 2024), the source for everything below.
- `npm run images` (`scripts/build-images.mjs`): water crops, banner card, treatment swatches, app icons.
- `scripts/trace-wordmark.mjs`: traces her lettering into `public/images/brand/wordmark.svg`
  (already committed; needs `potrace` only if re-run). `scripts/split-wordmark.mjs` splits it
  into the two lines the hero animates.

## Design and motion

- [`docs/brand-guidelines.md`](docs/brand-guidelines.md): positioning, voice, logo use, imagery.
- [`docs/design-system.md`](docs/design-system.md): tokens, type, layout, motion.

Colours are tokens in three layers (`src/app/globals.css`): components use semantic
classes such as `bg-surface`, `text-fg-muted` and `border-hairline`, never palette names
or hex. Values CSS can't reach (share image, shader) come from `src/lib/tokens.ts`.

Accessibility notes: scroll reveals fade opacity only, so everything stays in the tab
order, and a focused element's reveal finishes at once. Small text links use `.tap`
for a 44px touch area.

Performance notes:

- The page intro is CSS, so it doesn't wait for JavaScript.
- GSAP, its plugins and Lenis load in a separate chunk at idle time or on first interaction.
- The water shader compiles at idle over a still photo of the same water.
- With `prefers-reduced-motion` there is no smooth scroll, curtain, pinning or custom cursor,
  the water is a still frame, and all content is simply visible.

**Checking animations on a machine with reduced motion on** (Windows: Settings ›
Accessibility › Visual effects › Animation effects off): in development, run
`localStorage.setItem('gm-force-motion', '1')` in the console and reload. This flag
does nothing in production.
