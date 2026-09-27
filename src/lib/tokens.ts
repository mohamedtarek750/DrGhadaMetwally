/**
 * Brand colours for places CSS variables can't reach: the generated share
 * image, the browser theme colour and the WebGL water. They mirror the
 * primitives in src/app/globals.css (@theme); change both together.
 */
export const palette = {
  ink: '#2a1420',
  plum: '#5b4452',
  porcelain: '#fbf6f3',
  blush: '#f9e4ed',
  petal: '#fca6d6',
  berry: '#9c2a62',
} as const;

/** The water in the hero: her pink, with a deeper and a lighter step. */
export const water = {
  deep: '#f392c8',
  base: palette.petal,
  light: '#ffdaef',
} as const;

/** "#rrggbb" to a GLSL vec3 literal, e.g. "vec3(0.988, 0.651, 0.839)". */
export function glslColor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => (v / 255).toFixed(3));
  return `vec3(${c.join(', ')})`;
}
