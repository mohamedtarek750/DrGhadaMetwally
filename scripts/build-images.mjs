// Builds the site's imagery into public/images.
//
//  brand/   crops of her real Instagram banner (pink water + wordmark)
//  swatches/ one abstract "material" image per treatment. These are drawn,
//            not photographed, so they never pass for clinical or patient
//            photos. Replace them with real studio photography when it exists
//            (see src/content/treatments.ts).
//
// Run with: npm run images
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const BANNER = 'assets/source/ig-banner-full.jpg';
const OUT = 'public/images';
await mkdir(`${OUT}/brand`, { recursive: true });
await mkdir(`${OUT}/swatches`, { recursive: true });

const W = 900;
const H = 1125;

// Small seeded PRNG so every build draws the same swatches.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const webp = (img, file, quality = 82) => img.webp({ quality, effort: 6 }).toFile(`${OUT}/${file}`);

// Fine monochrome grain over the drawn swatches: it hides the banding that
// SVG lighting filters leave behind and gives them a photographic surface.
const grainLayer = (() => {
  const r = rng(99);
  const buf = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const v = Math.round(r() * 255);
    buf[i * 4] = buf[i * 4 + 1] = buf[i * 4 + 2] = v;
    buf[i * 4 + 3] = 16;
  }
  return buf;
})();
const drawn = async (svgBuffer, file, crop) => {
  let base = sharp(svgBuffer);
  if (crop) base = base.extract(crop);
  const flat = await base.png().toBuffer();
  return webp(sharp(flat).composite([{ input: grainLayer, raw: { width: W, height: H, channels: 4 } }]), file);
};
const svg = (body, w = W, h = H) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`,
  );

// --- Brand crops ----------------------------------------------------------

// The banner card on the site: wordmark and flowers only. The lines under the
// wordmark are left out so the card doesn't carry a second job title.
await webp(
  sharp(BANNER).extract({ left: 480, top: 10, width: 2280, height: 760 }),
  'brand/instagram-banner-card.webp',
  84,
);

// Clean water from the right-hand tile: caustics and bubbles, no lettering.
await webp(
  sharp(BANNER).extract({ left: 2552, top: 0, width: 688, height: 860 }).resize(W, H),
  'swatches/hydrafacial.webp',
);
await webp(
  sharp(BANNER).extract({ left: 2330, top: 0, width: 910, height: 700 }).resize(1300, 1000),
  'brand/water-caustics.webp',
);

// Softer water from the left-hand tile.
await webp(
  sharp(BANNER).extract({ left: 0, top: 0, width: 780, height: 860 }).resize(1170, 1290),
  'brand/water-soft.webp',
);

// --- Drawn swatches -------------------------------------------------------

// OxyGeneo: bubbles on blush, with a shallow depth of field.
{
  const r = rng(7);
  const bubble = (i, blur) => {
    const cx = r() * W,
      cy = r() * H;
    const rad = blur ? 60 + r() * 170 : 14 + r() * 96;
    const o = blur ? 0.55 : 0.9;
    return `<g filter="${blur ? 'url(#far)' : 'none'}" opacity="${o}">
      <circle cx="${cx}" cy="${cy}" r="${rad}" fill="url(#body)"/>
      <circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="${Math.max(1.2, rad * 0.035)}"/>
      <ellipse cx="${cx - rad * 0.38}" cy="${cy - rad * 0.42}" rx="${rad * 0.22}" ry="${rad * 0.13}" transform="rotate(-35 ${cx - rad * 0.38} ${cy - rad * 0.42})" fill="#fff" opacity=".85"/>
      <circle cx="${cx + rad * 0.45}" cy="${cy + rad * 0.5}" r="${rad * 0.06}" fill="#fff" opacity=".6"/>
    </g>`;
  };
  const far = Array.from({ length: 12 }, (_, i) => bubble(i, true)).join('');
  const near = Array.from({ length: 14 }, (_, i) => bubble(i, false)).join('');
  await drawn(
    svg(`<defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fdd9ec"/><stop offset=".55" stop-color="#fbb9dc"/><stop offset="1" stop-color="#f59ccb"/></linearGradient>
        <radialGradient id="body" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset=".92" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/></radialGradient>
        <filter id="far" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>${far}${near}`),
    'swatches/oxygeneo.webp',
  );
}

// AquaGold: flecks of gold leaf suspended in pink serum.
{
  const r = rng(11);
  const flake = (depth) => {
    const cx = r() * W,
      cy = r() * H;
    const size = depth === 'far' ? 30 + r() * 60 : 6 + r() * 34;
    const n = 5 + Math.floor(r() * 4);
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + r() * 0.5;
      const d = size * (0.45 + r() * 0.55);
      return `${(cx + Math.cos(a) * d).toFixed(1)},${(cy + Math.sin(a) * d * (0.5 + r() * 0.5)).toFixed(1)}`;
    }).join(' ');
    const rot = (r() * 360).toFixed(0);
    return `<polygon points="${pts}" transform="rotate(${rot} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="url(#leaf${1 + Math.floor(r() * 2)})" opacity="${depth === 'far' ? 0.5 : 0.95}"/>`;
  };
  const far = Array.from({ length: 10 }, () => flake('far')).join('');
  const near = Array.from({ length: 30 }, () => flake('near')).join('');
  const dust = Array.from(
    { length: 160 },
    () =>
      `<circle cx="${(r() * W).toFixed(1)}" cy="${(r() * H).toFixed(1)}" r="${(0.5 + r() * 1.6).toFixed(2)}" fill="#f6dca0" opacity="${(0.35 + r() * 0.6).toFixed(2)}"/>`,
  ).join('');
  await drawn(
    svg(`<defs>
        <linearGradient id="serum" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#fdd3e8"/><stop offset=".55" stop-color="#f8b3d7"/><stop offset="1" stop-color="#ee94c2"/></linearGradient>
        <linearGradient id="leaf1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1c4"/><stop offset=".4" stop-color="#e3b865"/><stop offset=".7" stop-color="#b98536"/><stop offset="1" stop-color="#f3d58e"/></linearGradient>
        <linearGradient id="leaf2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8923f"/><stop offset=".5" stop-color="#f7dc9c"/><stop offset="1" stop-color="#a8742d"/></linearGradient>
        <filter id="far" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
        <filter id="near" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#8f2b5c" flood-opacity=".25"/></filter>
        <radialGradient id="light" cx=".3" cy=".25" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#serum)"/>
      <rect width="100%" height="100%" fill="url(#light)"/>
      <g filter="url(#far)">${far}</g>
      ${dust}
      <g filter="url(#near)">${near}</g>`),
    'swatches/aquagold.webp',
  );
}

// Hydrojelly mask: glossy, poured gel.
await drawn(
  svg(
    `<defs>
      <filter id="gel" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.0034 0.0046" numOctaves="2" seed="4" result="n"/>
        <feGaussianBlur in="n" stdDeviation="9" result="nb"/>
        <feSpecularLighting in="nb" surfaceScale="38" specularConstant="1.05" specularExponent="34" lighting-color="#ffffff" result="spec">
          <feDistantLight azimuth="235" elevation="52"/>
        </feSpecularLighting>
        <feComposite in="spec" in2="SourceGraphic" operator="arithmetic" k1="0" k2="0.62" k3="1" k4="0"/>
      </filter>
      <linearGradient id="base" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#fcb3da"/><stop offset=".6" stop-color="#f58fc5"/><stop offset="1" stop-color="#e46fae"/></linearGradient>
    </defs>
    <g transform="translate(160 160)"><rect x="-60" y="-60" width="${W + 120}" height="${H + 120}" fill="url(#base)" filter="url(#gel)"/></g>`,
    W + 320,
    H + 320,
  ),
  'swatches/hydrojelly.webp',
  { left: 160, top: 160, width: W, height: H },
);

// Dermapen: a precise field of micro-points, fading with depth.
{
  const pts = [];
  for (let row = 0; row < 70; row++) {
    const t = row / 69;
    const y = 80 + Math.pow(t, 1.35) * 1080;
    const gap = 9 + t * 22;
    const size = 0.9 + t * 3.2;
    const count = Math.ceil((W + 200) / gap);
    for (let i = 0; i < count; i++) {
      const x = -100 + i * gap + (row % 2) * gap * 0.5;
      pts.push(
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(2)}" fill="#8f2b5c" opacity="${(0.18 + t * 0.5).toFixed(2)}"/>`,
      );
      pts.push(
        `<circle cx="${(x - size * 0.3).toFixed(1)}" cy="${(y - size * 0.35).toFixed(1)}" r="${(size * 0.35).toFixed(2)}" fill="#fff" opacity="${(0.25 + t * 0.4).toFixed(2)}"/>`,
      );
    }
  }
  await drawn(
    svg(`<defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe4ee"/><stop offset=".5" stop-color="#f8cfe2"/><stop offset="1" stop-color="#f2b1d0"/></linearGradient>
        <filter id="tex"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .2  0 0 0 0 .35  0 0 0 .06 0"/></filter>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe4ee" stop-opacity="1"/><stop offset=".25" stop-color="#fbe4ee" stop-opacity="0"/></linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" filter="url(#tex)"/>
      ${pts.join('')}
      <rect width="100%" height="100%" fill="url(#fade)"/>`),
    'swatches/dermapen.webp',
  );
}

// Chemical peels: smooth satin, like skin after the surface has renewed.
await drawn(
  svg(
    `<defs>
      <filter id="satin" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.0016 0.0105" numOctaves="2" seed="9" result="n"/>
        <feGaussianBlur in="n" stdDeviation="14" result="nb"/>
        <feSpecularLighting in="nb" surfaceScale="60" specularConstant=".95" specularExponent="16" lighting-color="#fff4f9" result="spec">
          <feDistantLight azimuth="300" elevation="38"/>
        </feSpecularLighting>
        <feDiffuseLighting in="nb" surfaceScale="40" diffuseConstant="1" lighting-color="#ffffff" result="diff">
          <feDistantLight azimuth="300" elevation="55"/>
        </feDiffuseLighting>
        <feComposite in="diff" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="shaded"/>
        <feComposite in="spec" in2="shaded" operator="arithmetic" k1="0" k2="0.55" k3="1" k4="0"/>
      </filter>
      <linearGradient id="base" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe3f1"/><stop offset=".5" stop-color="#fbc1df"/><stop offset="1" stop-color="#f3a2cb"/></linearGradient>
    </defs>
    <g transform="translate(160 160) rotate(-24 450 562)"><rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="url(#base)" filter="url(#satin)"/></g>`,
    W + 320,
    H + 320,
  ),
  'swatches/peels.webp',
  { left: 160, top: 160, width: W, height: H },
);

// Laser: parallel beams of rose light on ink.
{
  const r = rng(31);
  const beams = Array.from({ length: 22 }, (_, i) => {
    const y = 90 + i * 45 + (r() - 0.5) * 12;
    const w = 0.6 + r() * 1.8;
    const o = 0.25 + r() * 0.7;
    return `<line x1="-20" y1="${y}" x2="${W + 20}" y2="${y - 160}" stroke="url(#beam)" stroke-width="${w}" opacity="${o}"/>`;
  }).join('');
  await drawn(
    svg(`<defs>
        <radialGradient id="bg" cx=".62" cy=".44" r=".8"><stop offset="0" stop-color="#4a1d33"/><stop offset=".6" stop-color="#2a1420"/><stop offset="1" stop-color="#1a0c14"/></radialGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fca6d6" stop-opacity="0"/><stop offset=".55" stop-color="#ffd1ea"/><stop offset="1" stop-color="#fca6d6" stop-opacity=".1"/></linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="hot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".25" stop-color="#ffc2e3" stop-opacity=".7"/><stop offset="1" stop-color="#fca6d6" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <g filter="url(#glow)">${beams}</g>
      <circle cx="560" cy="500" r="190" fill="url(#hot)" opacity=".55"/>`),
    'swatches/laser.webp',
  );
}

// --- App icons: the "g" from her wordmark, ink on brand pink ---------------
//
//  src/app/icon.svg       crisp at any size; browsers that support SVG favicons use it
//  src/app/favicon.ico    16/32/48 px for everything else (and /favicon.ico requests)
//  src/app/icon.png       512 px, for the web manifest
//  src/app/apple-icon.png 180 px, full bleed (iOS rounds the corners itself)
{
  const { readFile, writeFile } = await import('node:fs/promises');
  const mark = await readFile(`${OUT}/brand/wordmark.svg`, 'utf8');
  const line1 = mark.match(/<symbol id="line1"[^>]*><path d="([^"]+)"/)[1];
  // The "g" is the first two subpaths of line 1: its teardrop ear, and its body
  // (which touches the "h", so the viewBox below clips at the g's right edge).
  const gPath = line1
    .match(/M[^M]*/g)
    .slice(0, 2)
    .join('');
  const g = { x: 18, y: 28, w: 870, h: 1205 };
  const INK = '#2a1420';
  const PETAL = '#fca6d6';

  // fill: share of the tile height the glyph takes. Small sizes get a bigger
  // glyph so the letter survives at 16 px.
  const iconSvg = (size, { fill, radius }) => {
    const h = size * fill;
    const w = (g.w / g.h) * h;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${PETAL}"/><svg x="${((size - w) / 2 + size * 0.02).toFixed(2)}" y="${((size - h) / 2).toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" viewBox="${g.x} ${g.y} ${g.w} ${g.h}"><path d="${gPath}" fill="${INK}"/></svg></svg>`;
  };
  const png = (size, opts) =>
    sharp(Buffer.from(iconSvg(size, opts)))
      .png()
      .toBuffer();

  await writeFile('src/app/icon.svg', `${iconSvg(64, { fill: 0.8, radius: 14 })}\n`);
  await writeFile('src/app/icon.png', await png(512, { fill: 0.7, radius: 112 }));
  await writeFile('src/app/apple-icon.png', await png(180, { fill: 0.7, radius: 0 }));

  // ICO with PNG entries (supported by every current browser).
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map((sz) => png(sz, { fill: 0.86, radius: Math.round(sz * 0.18) })));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((sz, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(sz, e);
    header.writeUInt8(sz, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(images[i].length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += images[i].length;
  });
  await writeFile('src/app/favicon.ico', Buffer.concat([header, ...images]));
}

console.log('images built');
