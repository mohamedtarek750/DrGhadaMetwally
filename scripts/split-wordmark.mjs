// Splits the wordmark path into its two lines ("ghada" / "metwally") so the
// hero can animate them separately. Every glyph (and every counter inside a
// glyph) is its own subpath, so each one is sorted by the height of its
// centre. Writes #mark, #line1 and #line2 symbols into wordmark.svg.
//
// Runs after trace-wordmark.mjs; safe to run again.
import { readFile, writeFile } from 'node:fs/promises';

const FILE = 'public/images/brand/wordmark.svg';
// Centre heights below this belong to the second line (wordmark units).
const SPLIT_Y = 1245;

export function splitLines(d) {
  const subpaths = d.match(/M[^M]*/g) ?? [];
  const line1 = [];
  const line2 = [];
  for (const sp of subpaths) {
    const nums = sp.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 1; i < nums.length; i += 2) {
      minY = Math.min(minY, nums[i]);
      maxY = Math.max(maxY, nums[i]);
    }
    ((minY + maxY) / 2 < SPLIT_Y ? line1 : line2).push(sp);
  }
  return { line1: line1.join(''), line2: line2.join('') };
}

export function buildSvg(viewBox, d) {
  const { line1, line2 } = splitLines(d);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">` +
    `<symbol id="line1" viewBox="${viewBox}"><path d="${line1}" fill="currentColor"/></symbol>` +
    `<symbol id="line2" viewBox="${viewBox}"><path d="${line2}" fill="currentColor"/></symbol>` +
    `<symbol id="mark" viewBox="${viewBox}"><use href="#line1"/><use href="#line2"/></symbol>` +
    `<use href="#mark"/></svg>\n`
  );
}

// Only when run directly (trace-wordmark.mjs imports buildSvg from here).
if (process.argv[1]?.endsWith('split-wordmark.mjs')) {
  const svg = await readFile(FILE, 'utf8');
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
  const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join('');
  const out = buildSvg(viewBox, d);
  await writeFile(FILE, out);
  const { line1, line2 } = splitLines(d);
  console.log(
    'line1 subpaths',
    line1.match(/M/g).length,
    '| line2 subpaths',
    line2.match(/M/g).length,
    '| bytes',
    out.length,
  );
}
