'use client';

import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Wordmark } from '@/components/ui/Wordmark';
import { copy } from '@/content/copy';
import { navigation } from '@/content/navigation';
import { site } from '@/content/site';
import { cn } from '@/lib/cn';
import { loadGsap } from '@/lib/motion';
import { MobileMenu } from './MobileMenu';

/**
 * Transparent over the hero, frosted once you scroll, tucked away while you
 * read downward and back as soon as you scroll up. Switches to light text over
 * dark sections and underlines the section you're in.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(false);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const hero = document.getElementById('top');
        const heroEnd = hero ? hero.offsetHeight * 0.55 : 0;
        setScrolled(y > 24);
        setShowLogo(!hero || y > heroEnd);
        if (!menuOpenRef.current) setTucked(y > lastY && y > 640);
        lastY = y;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Light text while a dark section passes under the header.
  useEffect(() => {
    const darkSections = document.querySelectorAll('[data-theme="dark"]');
    const inView = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)));
        setDark(inView.size > 0);
      },
      { rootMargin: '0px 0px -94% 0px' },
    );
    darkSections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Which section is in the middle of the screen.
  useEffect(() => {
    const ids = navigation.map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
          else setActive((cur) => (cur === e.target.id ? null : cur));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const lightText = dark || menuOpen;

  return (
    <header
      data-site-header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[translate] duration-700 ease-out-expo',
        tucked && !menuOpen && '-translate-y-full',
      )}
    >
      {/* The intro animates this wrapper; the header itself only slides for the tuck. */}
      <div data-header-inner className="relative z-10">
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 border-b backdrop-blur-xl transition-[opacity,background-color,border-color] duration-500',
            scrolled && !menuOpen ? 'opacity-100' : 'opacity-0',
            dark ? 'border-hairline-inverse bg-surface-inverse/80' : 'border-hairline bg-surface/80',
          )}
        />

        <div
          className={cn(
            'container-site relative z-10 flex items-center justify-between gap-6 transition-[height,color] duration-500 ease-out-expo',
            scrolled ? 'h-16 md:h-[4.5rem]' : 'h-[4.5rem] md:h-24',
            lightText ? 'text-fg-inverse' : 'text-fg',
          )}
        >
          <a
            href="#top"
            aria-label={`${site.fullName}, back to top`}
            className={cn(
              'block w-24 transition-[opacity,transform] duration-700 ease-out-expo focus-visible:opacity-100 md:w-28',
              showLogo || menuOpen ? 'opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
            )}
          >
            <Wordmark />
          </a>

          <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
            <ul className="flex items-center gap-8 text-[0.9375rem]">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-u"
                    aria-current={active === item.href.slice(1) ? 'true' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <ButtonLink href={site.instagram.dm} external variant={dark ? 'petal' : 'ink'} className="btn-sm">
              {copy.hero.primary}
            </ButtonLink>
          </nav>

          <button
            type="button"
            className="-mr-3 flex h-11 items-center gap-3 px-3 text-sm font-medium md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
            onPointerDown={() => void loadGsap()}
          >
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={cn(
                  'absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-out-expo',
                  menuOpen && 'translate-y-1.5 rotate-45',
                )}
              />
              <span
                className={cn(
                  'absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-out-expo',
                  menuOpen && '-translate-y-1.5 -rotate-45',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
