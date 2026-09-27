import { ArrowUpRight } from '@/components/ui/Icons';
import { Wordmark } from '@/components/ui/Wordmark';
import { copy } from '@/content/copy';
import { navigation } from '@/content/navigation';
import { site } from '@/content/site';

export function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { label: 'Instagram', href: site.instagram.url, handle: `@${site.instagram.handle}` },
    { label: 'TikTok', href: site.tiktok.url, handle: `@${site.tiktok.handle}` },
  ];

  return (
    <footer id="site-footer" data-theme="dark" className="overflow-hidden bg-surface-inverse text-fg-inverse">
      <div className="container-site border-t border-hairline-inverse pb-8 pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-12 lg:col-span-5">
            <p className="font-display t-h3">{site.fullName}</p>
            <p className="mt-2 text-fg-inverse/65">{copy.footer.line}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-5 lg:col-span-3">
            <ul className="-my-2 flex flex-col">
              {[...navigation, { label: 'Book', href: '#book' }].map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="tap text-fg-inverse/85 hover:text-fg-inverse">
                    <span className="link-u">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-col gap-4 md:col-span-7 lg:col-span-4">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between border-b border-hairline-inverse pb-3"
                >
                  <span>
                    <span className="eyebrow block text-accent">{s.label}</span>
                    <span className="mt-1 block text-fg-inverse/85">{s.handle}</span>
                  </span>
                  <ArrowUpRight className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal="clip" className="mt-20 text-accent md:mt-28">
          <div data-reveal-inner>
            <Wordmark className="w-full" />
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-hairline-inverse pt-6 text-sm text-fg-inverse/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.fullName}
          </p>
          <a href="#top" className="tap -my-2.5 self-start text-fg-inverse/80 sm:self-auto">
            <span className="link-u">{copy.footer.top}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
