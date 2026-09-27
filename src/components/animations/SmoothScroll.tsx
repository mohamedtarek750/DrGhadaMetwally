'use client';

import type Lenis from 'lenis';
import { useEffect } from 'react';
import { whenIdle } from '@/lib/idle';
import { loadGsap, media } from '@/lib/motion';
import { isScrollLocked, scrollToTarget, setLenis } from '@/lib/scroll';

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and the
 * scroller never disagree about where the page is. Both load at idle, after
 * the first render; until then scrolling is simply native. In-page anchor
 * links are handled from the start so they always glide instead of jumping.
 */
export function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let teardown: (() => void) | null = null;
    let disposed = false;

    const cancelIdle = whenIdle(async () => {
      if (!window.matchMedia(media.motion).matches) return;
      const [{ gsap, ScrollTrigger }, { default: LenisClass }] = await Promise.all([loadGsap(), import('lenis')]);
      if (disposed) return;
      lenis = new LenisClass({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.2 });
      setLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add('lenis-ready');
      // When focus moves (keyboard), the browser scrolls the element into view.
      // Cancel any glide still running so it can't pull the page back. The
      // pinned Instagram row handles its own focus.
      const onFocusIn = (e: FocusEvent) => {
        if (!lenis || isScrollLocked() || (e.target as Element).closest?.('[data-ig-track]')) return;
        lenis.stop();
        lenis.start();
      };
      document.addEventListener('focusin', onFocusIn);
      // Lets automated visual checks scroll the page in development.
      if (process.env.NODE_ENV === 'development') Object.assign(window, { __lenis: lenis });
      teardown = () => {
        document.removeEventListener('focusin', onFocusIn);
        gsap.ticker.remove(tick);
        lenis?.destroy();
        setLenis(null);
      };
    }, 800);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href') ?? '';
      if (hash === '#' || hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      history.pushState(null, '', hash);
    };
    document.addEventListener('click', onClick);

    return () => {
      disposed = true;
      cancelIdle();
      document.removeEventListener('click', onClick);
      teardown?.();
    };
  }, []);

  return null;
}
