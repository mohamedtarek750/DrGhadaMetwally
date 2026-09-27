'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { whenIdle } from '@/lib/idle';
import { loadGsap, media } from '@/lib/motion';

type Mode = 'default' | 'link' | 'label' | 'hidden';

/**
 * A small dot with a trailing ring. The ring grows over links and turns into
 * a labelled disc over elements with data-cursor="label". It switches to light
 * colours over dark sections. Desktop pointers only; with reduced motion the
 * native cursor stays.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>('default');
  const [label, setLabel] = useState('');
  const [dark, setDark] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`${media.finePointer} and ${media.motion}`);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!enabled || !dotEl || !ringEl) return;
    const root = document.documentElement;
    let disposed = false;
    type To = (value: number) => void;
    let follow: { dx: To; dy: To; rx: To; ry: To } | null = null;

    // The native cursor stays until the custom one can actually follow.
    const cancelIdle = whenIdle(async () => {
      const { gsap } = await loadGsap();
      if (disposed) return;
      follow = {
        dx: gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power3.out' }),
        dy: gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power3.out' }),
        rx: gsap.quickTo(ringEl, 'x', { duration: 0.5, ease: 'power3.out' }),
        ry: gsap.quickTo(ringEl, 'y', { duration: 0.5, ease: 'power3.out' }),
      };
      root.classList.add('has-cursor');
    }, 1000);

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !follow) return;
      follow.dx(e.clientX);
      follow.dy(e.clientY);
      follow.rx(e.clientX);
      follow.ry(e.clientY);
      setVisible(true);
    };

    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const hit = target.closest<HTMLElement>('[data-cursor], a, button, [role="button"], summary, label');
      if (hit?.dataset.cursor === 'hide') setMode('hidden');
      else if (hit?.dataset.cursor === 'label') {
        setMode('label');
        setLabel(hit.dataset.cursorLabel ?? '');
      } else setMode(hit ? 'link' : 'default');
      setDark(Boolean(target.closest('[data-theme="dark"]')));
    };

    const leaveWindow = () => setVisible(false);

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leaveWindow);

    return () => {
      disposed = true;
      cancelIdle();
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leaveWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = mode === 'label' ? 92 : mode === 'link' ? 56 : 34;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className={cn(
            'flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background-color,border-color,opacity] duration-500 ease-out-expo',
            dark ? 'border-fg-inverse/60' : 'border-fg/40',
            mode === 'label' && (dark ? 'border-transparent bg-accent' : 'border-transparent bg-fg'),
            mode === 'link' && (dark ? 'bg-fg-inverse/10' : 'bg-accent/25'),
            mode === 'hidden' && 'opacity-0',
          )}
          style={{ width: ringSize, height: ringSize }}
        >
          <span
            className={cn(
              'eyebrow whitespace-nowrap text-[0.625rem] transition-opacity duration-300',
              dark ? 'text-fg' : 'text-fg-inverse',
              mode === 'label' ? 'opacity-100' : 'opacity-0',
            )}
          >
            {label}
          </span>
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0">
        <div
          className={cn(
            'size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300',
            dark ? 'bg-fg-inverse' : 'bg-fg',
            (mode === 'label' || mode === 'hidden') && 'opacity-0',
          )}
        />
      </div>
    </div>
  );
}
