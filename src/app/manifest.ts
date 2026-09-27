import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { palette } from '@/lib/tokens';

/** Lets "Add to Home Screen" show her mark on her pink. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.fullName,
    short_name: site.name,
    description: `${site.role} in ${site.area}.`,
    start_url: '/',
    display: 'browser',
    background_color: palette.porcelain,
    theme_color: palette.petal,
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/icon.png', type: 'image/png', sizes: '512x512' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  };
}
