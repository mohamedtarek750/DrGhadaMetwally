'use client';

import { useEffect, useRef } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowRight, InstagramIcon, TikTokIcon } from '@/components/ui/Icons';
import { copy } from '@/content/copy';
import { navigation } from '@/content/navigation';
import { site } from '@/content/site';
import { loadGsap, media } from '@/lib/motion';
import { lockScroll, unlockScroll } from '@/lib/scroll';

type Props = { open: boolean; onClose: () => void };

/**
 * Full-screen menu for small screens. It drops down like a curtain and the
 * links rise in one by one. While open, the page behind is inert, scrolling is
 * locked, Escape closes it and focus returns to the Menu button.
 */
export function MobileMenu({ open, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const el = panel.current;
    if (!el || open === wasOpen.current) return;
    wasOpen.current = open;
    const outside = [document.querySelector('main'), document.getElementById('site-footer')];
    const reduce = window.matchMedia(media.reduce).matches;

    if (open) {
      lockScroll();
      outside.forEach((node) => node?.setAttribute('inert', ''));
      el.style.display = 'flex';
      requestAnimationFrame(() => el.querySelector<HTMLElement>('[data-menu-link]')?.focus({ preventScroll: true }));
      if (reduce) return;
      // Usually already loaded (at idle, or on pointer-down of the Menu button).
      // If not, the menu simply appears and the next open animates.
      loadGsap().then(({ gsap }) => {
        if (!wasOpen.current) return;
        const q = gsap.utils.selector(el);
        gsap.killTweensOf([el, ...q('[data-menu-link]'), ...q('[data-menu-foot]')]);
        gsap.fromTo(
          el,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'power4.inOut' },
        );
        gsap.fromTo(
          q('[data-menu-link]'),
          { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.06, delay: 0.35, ease: 'expo.out' },
        );
        gsap.fromTo(
          q('[data-menu-foot]'),
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, delay: 0.55, ease: 'expo.out' },
        );
      });
    } else {
      unlockScroll();
      outside.forEach((node) => node?.removeAttribute('inert'));
      document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]')?.focus({ preventScroll: true });
      const hide = () => {
        el.style.display = 'none';
        el.style.clipPath = '';
      };
      if (reduce) return hide();
      loadGsap().then(({ gsap }) => {
        if (wasOpen.current) return;
        const q = gsap.utils.selector(el);
        gsap.killTweensOf([el, ...q('[data-menu-link]'), ...q('[data-menu-foot]')]);
        gsap.to(el, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.55,
          ease: 'power4.inOut',
          onComplete: hide,
        });
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const closeOnDesktop = window.matchMedia(media.tablet);
    const onResize = () => closeOnDesktop.matches && onClose();
    window.addEventListener('keydown', onKey);
    closeOnDesktop.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      closeOnDesktop.removeEventListener('change', onResize);
    };
  }, [open, onClose]);

  return (
    <div
      ref={panel}
      id="mobile-menu"
      data-theme="dark"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      className="fixed inset-0 z-0 hidden flex-col bg-surface-inverse pb-8 pt-24 text-fg-inverse md:hidden"
    >
      <nav aria-label="Mobile" className="container-site flex-1">
        <ol className="flex flex-col gap-1">
          {[...navigation, { label: 'Book', href: '#book' as const }].map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <a
                href={item.href}
                data-menu-link
                tabIndex={open ? 0 : -1}
                onClick={onClose}
                className="font-display flex items-baseline gap-4 py-1.5 text-[clamp(2.75rem,13vw,4.5rem)] leading-[1.02] tracking-[-0.025em]"
              >
                <span className="font-sans text-xs tracking-[0.2em] text-accent">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="container-site flex flex-col gap-8">
        <div data-menu-foot>
          <ButtonLink
            href={site.instagram.dm}
            external
            variant="petal"
            magnetic={false}
            icon={<ArrowRight />}
            className="w-full"
            tabIndex={open ? 0 : -1}
          >
            {copy.hero.primary}
          </ButtonLink>
        </div>
        <div data-menu-foot className="flex items-center justify-between border-t border-hairline-inverse pt-5 text-sm">
          <div className="flex gap-5">
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="flex size-11 items-center justify-center rounded-full border border-hairline-inverse"
            >
              <InstagramIcon />
              <span className="sr-only">Instagram (opens in a new tab)</span>
            </a>
            <a
              href={site.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="flex size-11 items-center justify-center rounded-full border border-hairline-inverse"
            >
              <TikTokIcon />
              <span className="sr-only">TikTok (opens in a new tab)</span>
            </a>
          </div>
          <span className="text-fg-inverse/70">{site.area}</span>
        </div>
      </div>
    </div>
  );
}
