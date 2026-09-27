// One-off: traces the "ghada metwally" lettering from her Instagram banner
// (assets/source/ig-banner-full.jpg) into a vector wordmark.
//
// The output (public/images/brand/wordmark.svg) is committed, so this only
// needs to run again if the source banner changes. potrace is not a project
// dependency; install it temporarily:
//   npm i -D potrace && node scripts/trace-wordmark.mjs && npm rm potrace
import sharp from 'sharp';
import potrace from 'potrace';
import { writeFile } from 'node:fs/promises';
import { buildSvg } from './split-wordmark.mjs';

const SRC = 'assets/source/ig-banner-full.jpg';
// Wordmark bounds inside the 3240x1080 stitched banner.
const REGION = { left: 800, top: 100, width: 1670, height: 770 };

// Areas that are not lettering (banner coordinates): the two frangipani
// flowers and the "MEDICAL ESTHETICIAN" line under "metwally".
const BLANK = [
  { x0: 1505, y0: 778, x1: 2205, y1: 834 }, // MEDICAL ESTHETICIAN
  { x0: 2088, y0: 230, x1: 2420, y1: 499 }, // large flower, above the "ll"
  { x0: 2039, y0: 499, x1: 2176, y1: 529 }, // gap between "ghada" and the "ll"
  { x0: 2096, y0: 499, x1: 2119, y1: 640 }, // petal between the two "l" stems
  { x0: 2177, y0: 499, x1: 2420, y1: 574 }, // large flower, above the "y"
  { x0: 2177, y0: 574, x1: 2195, y1: 610 },
  { x0: 940, y0: 612, x1: 1079, y1: 735 }, // small flower before the "m"
  { x0: 940, y0: 735, x1: 1079, y1: 748 },
  { x0: 940, y0: 748, x1: 1066, y1: 775 },
  { x0: 1018, y0: 575, x1: 1079, y1: 612 },
];

// The flower hides the tops of the "ll". Redraw them as plain stems with the
// same rising wedge the other ascenders have, set a little lower than the
// hidden originals so they don't run into the "a" of "ghada" above.
const STEMS = [
  { x0: 2039, x1: 2095, top: 530, bottom: 640 },
  { x0: 2120, x1: 2176, top: 530, bottom: 640 },
];
const WEDGE = 10;

const inside = (list, x, y) => list.some((b) => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1);
const onStem = (x, y) =>
  STEMS.some((s) => x >= s.x0 && x <= s.x1 && y <= s.bottom && y >= s.top + WEDGE * (1 - (x - s.x0) / (s.x1 - s.x0)));

const { data, info } = await sharp(SRC).extract(REGION).raw().toBuffer({ resolveWithObject: true });
const ink = Buffer.alloc(info.width * info.height);

for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels;
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const gx = x + REGION.left,
      gy = y + REGION.top;
    // The pink ground sits around G=166, the letters at 255. Using the green
    // channel as a continuous value keeps the anti-aliased edge, so the traced
    // outline lands on the real letter boundary instead of on JPEG noise.
    const tinted = Math.max(r, g, b) - Math.min(r, g, b) > 40 && g > 200;
    let w = tinted ? 0 : Math.min(1, Math.max(0, (g - 170) / 80));
    if (inside(BLANK, gx, gy)) w = 0;
    if (onStem(gx, gy)) w = 1;
    ink[y * info.width + x] = Math.round(255 * (1 - w));
  }
}

const SCALE = 3;
const png = await sharp(ink, { raw: { width: info.width, height: info.height, channels: 1 } })
  .resize(info.width * SCALE, info.height * SCALE, { kernel: 'cubic' })
  .blur(1.6)
  .png()
  .toBuffer();

const svg = await new Promise((resolve, reject) =>
  potrace.trace(png, { threshold: 128, turdSize: 900, optTolerance: 0.6, alphaMax: 1.1, optCurve: true }, (err, out) =>
    err ? reject(err) : resolve(out),
  ),
);

// Keep only the path data and crop the viewBox tight to the letters.
const d = svg.match(/ d="([^"]+)"/)[1];
const W = info.width * SCALE;
const H = info.height * SCALE;
const probe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><path d="${d}"/></svg>`;
const { data: px, info: pi } = await sharp(Buffer.from(probe))
  .flatten({ background: '#fff' })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

let minX = W,
  minY = H,
  maxX = 0,
  maxY = 0;
for (let y = 0; y < pi.height; y++) {
  for (let x = 0; x < pi.width; x++) {
    if (px[y * pi.width + x] >= 128) continue;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
}

const pad = 6;
const viewBox = [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2].join(' ');

// Whole units are plenty at this scale and halve the file size. The symbols
// (#mark, and #line1/#line2 for the two lines) let pages reference the file
// once via <use href="...#mark">.
const compact = d
  .replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n))))
  .replace(/\s+/g, ' ')
  .replace(/ ?([MCLZ]) ?/g, '$1');
await writeFile('public/images/brand/wordmark.svg', buildSvg(viewBox, compact));
console.log('viewBox', viewBox, '| path chars', compact.length);
