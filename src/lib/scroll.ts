'use client';

import type Lenis from 'lenis';
import { media } from './motion';

/**
 * One place to talk to the scroller. With reduced motion there is no Lenis
 * instance, and everything falls back to native scrolling.
 */
let lenis: Lenis | null = null;
let locks = 0;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function scrollToTarget(target: string | HTMLElement | number, opts: { immediate?: boolean } = {}) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;

  // Move focus to the section so keyboard and screen reader users land there
  // too. This happens before scrolling starts: a focus change cancels any glide
  // in progress (see SmoothScroll), and it must not cancel this one.
  if (el instanceof HTMLElement) {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  if (lenis) {
    // force: a link in the mobile menu fires while scrolling is still locked for the menu.
    lenis.scrollTo(el, { duration: opts.immediate ? 0 : 1.6, immediate: opts.immediate, force: true });
  } else {
    // Before Lenis has loaded (or with reduced motion), use the browser's own scrolling.
    const behavior = window.matchMedia(media.motion).matches ? 'smooth' : 'auto';
    if (typeof el === 'number') window.scrollTo({ top: el, behavior });
    else el.scrollIntoView({ behavior });
  }
}

export function isScrollLocked() {
  return locks > 0;
}

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  lenis?.start();
  document.documentElement.style.overflow = '';
}
