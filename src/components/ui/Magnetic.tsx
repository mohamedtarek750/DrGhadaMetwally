'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { loadGsap, media } from '@/lib/motion';

type To = (value: number) => void;

/**
 * Pulls its child a few pixels toward the pointer and lets it spring back.
 * Desktop pointers only, and never with reduced motion. GSAP loads on the
 * first hover, not with the page.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia(`${media.finePointer} and ${media.motion}`).matches) return;
    let disposed = false;
    let pull: { x: To; y: To } | null = null;
    let reset: (() => void) | null = null;

    const arm = () => {
      if (pull) return;
      loadGsap().then(({ gsap }) => {
        if (disposed || pull) return;
        pull = {
          x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' }),
          y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' }),
        };
        reset = () => gsap.set(el, { clearProps: 'transform' });
      });
    };
    const move = (e: PointerEvent) => {
      if (!pull) return arm();
      const r = el.getBoundingClientRect();
      pull.x((e.clientX - (r.left + r.width / 2)) * strength);
      pull.y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      pull?.x(0);
      pull?.y(0);
    };

    el.addEventListener('pointerenter', arm);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      disposed = true;
      el.removeEventListener('pointerenter', arm);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      reset?.();
    };
  }, [strength]);

  return (
    <span ref={ref} className={cn('inline-block will-change-transform', className)}>
      {children}
    </span>
  );
}
