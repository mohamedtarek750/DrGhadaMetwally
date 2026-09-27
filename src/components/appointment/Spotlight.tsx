'use client';

import { useEffect, useRef } from 'react';
import { media } from '@/lib/motion';

/**
 * A soft pink glow in the dark booking section that drifts toward the pointer.
 * It rests in the upper right on touch screens and with reduced motion.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(`${media.finePointer} and ${media.motion}`).matches) return;

    const pos = { x: 72, y: 28, tx: 72, ty: 28 };
    let raf = 0;
    let running = false;

    const tick = () => {
      pos.x += (pos.tx - pos.x) * 0.05;
      pos.y += (pos.ty - pos.y) * 0.05;
      el.style.setProperty('--x', `${pos.x}%`);
      el.style.setProperty('--y', `${pos.y}%`);
      if (Math.abs(pos.tx - pos.x) + Math.abs(pos.ty - pos.y) > 0.05) raf = requestAnimationFrame(tick);
      else running = false;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      pos.tx = ((e.clientX - r.left) / r.width) * 100;
      pos.ty = ((e.clientY - r.top) / r.height) * 100;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          'radial-gradient(circle at var(--x, 72%) var(--y, 28%), color-mix(in oklab, var(--color-accent) 20%, transparent), color-mix(in oklab, var(--color-accent) 6%, transparent) 28%, transparent 55%)',
      }}
    />
  );
}
