'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { whenIdle } from '@/lib/idle';
import { loadGsap, media, motion } from '@/lib/motion';

/**
 * Scroll motion for server-rendered sections. Components opt in with data
 * attributes instead of each shipping their own animation code:
 *
 *   data-reveal="fade"     fades and lifts in
 *   data-reveal="lines"    text rises line by line out of masks
 *   data-reveal="words"    words brighten as the section scrolls through
 *   data-reveal="stagger"  direct children fade in one after another
 *   data-reveal="clip"     image frame wipes open, its [data-reveal-inner] settles
 *   data-parallax="12"     drifts by ±12% of its height while in view
 *
 * Setup waits for an idle moment so it doesn't compete with the first render;
 * everything it animates is below the fold at that point. With reduced motion
 * none of this runs and everything is simply visible.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    let revert: (() => void) | null = null;
    let disposed = false;

    const cancelIdle = whenIdle(async () => {
      const { gsap, ScrollTrigger, SplitText } = await loadGsap();
      if (disposed) return;
      const mm = gsap.matchMedia();
      revert = () => mm.revert();

      mm.add(media.motion, () => {
        // Lift the CSS guard first: from() tweens read each element's current
        // opacity as their end value. Same task as the tweens, so no frame paints between.
        root.classList.add('motion-ready');
        const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);
        const trigger = (el: Element, start = 'top 86%') => ({ trigger: el, start, once: true });
        // Reveals fade opacity only (never visibility), so everything stays in
        // the tab order. If focus lands inside something not yet revealed, its
        // reveal finishes at once so the focus ring is never invisible.
        const reveals = new Map<Element, gsap.core.Animation>();
        const finishOnFocus = (e: FocusEvent) => {
          for (let n = e.target as Element | null; n && n !== document.body; n = n.parentElement) {
            reveals.get(n)?.progress(1);
          }
        };
        document.addEventListener('focusin', finishOnFocus);

        q('[data-reveal="fade"]').forEach((el) => {
          reveals.set(
            el,
            gsap.from(el, { opacity: 0, y: 28, duration: motion.duration.reveal, scrollTrigger: trigger(el) }),
          );
        });

        q('[data-reveal="stagger"]').forEach((el) => {
          const tween = gsap.from(el.children, {
            opacity: 0,
            y: 24,
            duration: motion.duration.reveal,
            stagger: motion.stagger.items,
            scrollTrigger: trigger(el),
          });
          reveals.set(el, tween);
        });

        q('[data-reveal="lines"]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit(self) {
              self.masks.forEach((m) => m.classList.add('split-mask'));
              const tween = gsap.from(self.lines, {
                yPercent: 110,
                duration: motion.duration.reveal,
                stagger: motion.stagger.lines,
                scrollTrigger: trigger(el, 'top 88%'),
              });
              reveals.set(el, tween);
              return tween;
            },
          });
        });

        q('[data-reveal="words"]').forEach((el) => {
          SplitText.create(el, {
            type: 'words',
            autoSplit: true,
            onSplit(self) {
              return gsap.fromTo(
                self.words,
                { opacity: 0.14 },
                {
                  opacity: 1,
                  ease: 'none',
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: 0.6 },
                },
              );
            },
          });
        });

        q('[data-reveal="clip"]').forEach((el) => {
          const inner = el.querySelector('[data-reveal-inner]');
          const tl = gsap.timeline({ scrollTrigger: trigger(el, 'top 85%') });
          tl.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: motion.duration.image, ease: 'expo.inOut' },
          );
          if (inner) tl.from(inner, { scale: 1.18, duration: motion.duration.image * 1.3, ease: 'expo.out' }, 0.15);
        });

        q('[data-parallax]').forEach((el) => {
          const amount = Number(el.dataset.parallax) || 10;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });

        // Images and fonts change the page height after first layout.
        const refresh = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(refresh);
        if (document.readyState !== 'complete') window.addEventListener('load', refresh, { once: true });

        return () => document.removeEventListener('focusin', finishOnFocus);
      });

      mm.add(media.reduce, () => {
        root.classList.add('motion-ready');
      });
    }, 1200);

    return () => {
      disposed = true;
      cancelIdle();
      revert?.();
      root.classList.remove('motion-ready');
    };
  }, [pathname]);

  return null;
}
