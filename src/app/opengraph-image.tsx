import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { site } from '@/content/site';
import { palette, water } from '@/lib/tokens';

export const alt = `${site.fullName}, ${site.roleLong} in ${site.area}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Share card: her wordmark in ink on her pink, like the banner she posted. */
export default async function OpengraphImage() {
  const svg = await readFile(join(process.cwd(), 'public/images/brand/wordmark.svg'), 'utf8');
  const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join('');
  const mark = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="18 28 4785 2234"><path d="${d}" fill="${palette.ink}"/></svg>`,
  ).toString('base64')}`;

  const label = { fontSize: 22, letterSpacing: 5, textTransform: 'uppercase' as const, color: palette.ink };

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: `radial-gradient(circle at 78% 18%, ${water.light} 0%, transparent 45%), radial-gradient(circle at 12% 92%, ${water.deep} 0%, transparent 50%), ${water.base}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', ...label }}>
        <span>{site.honorific}</span>
        <span>{site.tagline}</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={mark} width={760} height={Math.round((760 * 2234) / 4785)} alt="" />
      <div style={{ display: 'flex', justifyContent: 'space-between', ...label }}>
        <span>{site.role}</span>
        <span>{site.area}</span>
      </div>
    </div>,
    size,
  );
}
