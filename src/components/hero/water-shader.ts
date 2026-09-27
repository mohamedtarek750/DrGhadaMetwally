/**
 * Pink water, drawn live. Caustic light comes from the edges of two
 * drifting Voronoi layers, bent by slow domain-warped noise so the network
 * moves like light on the bottom of a pool. The pointer sends out a faint
 * ripple. Colours come from `water` in lib/tokens.ts.
 */
import { glslColor, water } from '@/lib/tokens';

export const vertexShader = /* glsl */ `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;     // 0..1, origin bottom-left
uniform float uPointerAmt; // 0..1, eased presence of the pointer

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.37, 289.13))) * 45758.5453);
}

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}

// Distance between the nearest and second-nearest cell points. Small values
// trace the cell borders, which is where caustic light gathers.
float cellEdge(vec2 p, float t) {
  vec2 g = floor(p);
  vec2 f = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 o = vec2(float(x), float(y));
      vec2 h = hash2(g + o);
      vec2 pt = o + 0.5 + 0.42 * sin(t + 6.2831 * h);
      float d = length(pt - f);
      if (d < f1) {
        f2 = f1;
        f1 = d;
      } else if (d < f2) {
        f2 = d;
      }
    }
  }
  return f2 - f1;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime;

  // Pointer ripple.
  vec2 m = vec2(uPointer.x * aspect, uPointer.y);
  vec2 dm = p - m;
  float dist = length(dm);
  float ripple = sin(dist * 42.0 - t * 3.4) * exp(-dist * 5.0) * 0.014 * uPointerAmt;
  p += (dm / max(dist, 1e-4)) * ripple;

  // Slow drift of the whole surface. A strong warp keeps the cells from
  // reading as a grid.
  vec2 q = p * 1.1;
  vec2 w = vec2(fbm(q + vec2(0.0, t * 0.04)), fbm(q + vec2(5.2, -t * 0.034)));
  vec2 pw = p * 1.85 + (w - 0.5) * 2.4;

  float e1 = cellEdge(pw, t * 0.5);
  float e2 = cellEdge(pw * 1.7 + 3.1, t * 0.62 + 1.7);
  float c1 = 1.0 - smoothstep(0.0, 0.15, e1);
  float c2 = 1.0 - smoothstep(0.0, 0.09, e2);
  float caustic = pow(c1, 3.0) * 0.68 + pow(c2, 3.2) * 0.26;

  // Light doesn't fall evenly: some areas are bright, some almost calm.
  float lit = smoothstep(0.25, 0.75, fbm(p * 0.7 - w * 0.6 + vec2(t * 0.012, 0.0)));
  caustic *= mix(0.35, 1.0, lit);

  // Broad swells of light and shade under the caustics.
  float swell = fbm(p * 0.8 + w * 0.9 + t * 0.016);

  vec3 deep  = ${glslColor(water.deep)};
  vec3 base  = ${glslColor(water.base)};
  vec3 light = ${glslColor(water.light)};

  vec3 col = mix(deep, base, smoothstep(0.25, 0.75, swell));
  col = mix(col, light, clamp(caustic, 0.0, 1.0) * 0.7);

  // Light from above, a little shade at the foot of the frame.
  col += vec3(0.035, 0.022, 0.028) * smoothstep(0.35, 1.0, uv.y);
  col -= vec3(0.02, 0.035, 0.025) * smoothstep(0.45, 0.0, uv.y);

  // Dither to avoid banding in the gradients.
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`;
