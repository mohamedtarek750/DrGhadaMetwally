/**
 * Motion vocabulary and media queries. Kept apart from lib/gsap.ts so that
 * reading a constant never pulls the animation libraries into the first load.
 */
export const motion = {
  duration: {
    reveal: 1.1,
    image: 1.4,
  },
  stagger: {
    lines: 0.08,
    items: 0.07,
  },
} as const;

export const media = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px)',
  desktop: '(min-width: 1024px)',
  finePointer: '(hover: hover) and (pointer: fine)',
} as const;

type Gsap = typeof import('./gsap');
let gsapModule: Promise<Gsap> | null = null;

/**
 * GSAP and its plugins load on demand, in their own chunk, the first time
 * anything needs them (at idle, or on the first hover or tap that animates).
 */
export function loadGsap() {
  gsapModule ??= import('./gsap');
  return gsapModule;
}
