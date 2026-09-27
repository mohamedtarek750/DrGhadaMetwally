import type { Metadata, Viewport } from 'next';
import { Cursor } from '@/components/animations/Cursor';
import { MotionRoot } from '@/components/animations/MotionRoot';
import { SmoothScroll } from '@/components/animations/SmoothScroll';
import { JsonLd } from '@/components/seo/JsonLd';
import { site } from '@/content/site';
import { fraunces, frauncesItalic, instrument } from '@/lib/fonts';
import { palette } from '@/lib/tokens';
import './globals.css';

const title = `${site.fullName} · Medical Facials & Laser in ${site.area}`;
const description = `${site.fullName} offers medical facials and laser in ${site.area}: HydraFacial, OxyGeneo, AquaGold, hydrojelly masks, Dermapen microneedling and chemical peels. Book by Instagram DM.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.fullName}` },
  description,
  applicationName: site.fullName,
  category: 'health & beauty',
  keywords: [
    site.fullName,
    'Ghada Metwally',
    'medical facials New Cairo',
    'HydraFacial New Cairo',
    'OxyGeneo',
    'AquaGold facial',
    'Dermapen microneedling',
    'chemical peel',
    'laser New Cairo',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.fullName,
    title,
    description,
    locale: 'en_EG',
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: palette.petal,
  colorScheme: 'light',
};

/**
 * Runs before first paint. Marks the page as scripted and, unless the visitor
 * prefers reduced motion, lets the CSS hold back elements that will animate in.
 * The intro curtain only plays once per browser session.
 */
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion-ok');if(sessionStorage.getItem('gm-intro'))d.classList.add('intro-skip')}}catch(e){}})();`;

/**
 * Development only: `localStorage.setItem('gm-force-motion', '1')` makes the
 * page ignore an OS-level reduced-motion setting, so the full animation can be
 * checked on a machine that has it on. Not included in production builds.
 */
const devForceMotion =
  process.env.NODE_ENV === 'development'
    ? `(function(){try{if(!localStorage.getItem('gm-force-motion'))return;var real=window.matchMedia.bind(window);window.matchMedia=function(q){return real(String(q).replace(/\\(prefers-reduced-motion:\\s*no-preference\\)/g,'(min-width: 0px)').replace(/\\(prefers-reduced-motion:\\s*reduce\\)/g,'(max-width: 0px)'))};document.documentElement.classList.add('force-motion')}catch(e){}})();`
    : '';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${frauncesItalic.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: devForceMotion + boot }} />
      </head>
      <body className="bg-surface font-sans text-fg">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-surface-inverse px-5 py-3 text-sm text-fg-inverse transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
        <SmoothScroll />
        <MotionRoot />
        <Cursor />
        <JsonLd />
      </body>
    </html>
  );
}
