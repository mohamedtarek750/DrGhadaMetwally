'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowRight, Plus } from '@/components/ui/Icons';
import { copy } from '@/content/copy';
import { site } from '@/content/site';
import { treatments } from '@/content/treatments';
import { cn } from '@/lib/cn';
import { loadGsap, media } from '@/lib/motion';

/**
 * The treatment index. Each row opens to a short description and a way to ask
 * about it. On desktop a preview follows the pointer down the list, swapping
 * its texture as you move between rows.
 */
export function Treatments() {
  const section = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  // Preview images load once the pointer comes near, not with the page.
  const [armed, setArmed] = useState(false);
  const previewApi = useRef<{ show: (i: number) => void; hide: () => void } | null>(null);
  const zIndex = useRef(1);

  // Pointer-following preview (desktop, motion allowed). Built the first time
  // a mouse enters the section, together with its images.
  useEffect(() => {
    const el = preview.current;
    if (!armed || !el) return;
    let revert: (() => void) | null = null;
    let disposed = false;

    loadGsap().then(({ gsap }) => {
      if (disposed) return;
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add(`${media.finePointer} and ${media.motion} and ${media.desktop}`, () => {
        const frames = gsap.utils.toArray<HTMLElement>('[data-preview-frame]', el);
        const xTo = gsap.quickTo(el, 'x', { duration: 0.65, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.65, ease: 'power3.out' });
        const rTo = gsap.quickTo(el, 'rotation', { duration: 0.9, ease: 'power3.out' });
        let lastX = 0;
        let current = -1;
        let visible = false;

        gsap.set(el, { autoAlpha: 0, scale: 0.7, yPercent: -50, transformOrigin: '0% 50%' });

        // Sits to the right of the pointer so it never covers the name being
        // pointed at, and stays inside the window near the right edge.
        const move = (e: PointerEvent) => {
          xTo(Math.min(e.clientX + 56, window.innerWidth - el.offsetWidth - 24));
          yTo(e.clientY);
          rTo(gsap.utils.clamp(-7, 7, (e.clientX - lastX) * 0.35));
          lastX = e.clientX;
        };
        window.addEventListener('pointermove', move, { passive: true });

        previewApi.current = {
          show(i) {
            if (!visible) {
              visible = true;
              gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'expo.out', overwrite: 'auto' });
            }
            if (i === current) return;
            current = i;
            const frame = frames[i];
            zIndex.current += 1;
            gsap.set(frame, { zIndex: zIndex.current });
            gsap.fromTo(
              frame,
              { clipPath: 'inset(100% 0% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.out', overwrite: true },
            );
            const img = frame.querySelector('img');
            if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.2, ease: 'expo.out' });
          },
          hide() {
            visible = false;
            current = -1;
            gsap.to(el, { autoAlpha: 0, scale: 0.7, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
          },
        };

        return () => {
          window.removeEventListener('pointermove', move);
          previewApi.current = null;
        };
      });
    });

    return () => {
      disposed = true;
      revert?.();
    };
  }, [armed]);

  const toggle = (slug: string) => {
    const next = open === slug ? null : slug;
    setOpen(next);
    const panels = section.current?.querySelectorAll<HTMLElement>('[data-panel]') ?? [];
    const reduce = window.matchMedia(media.reduce).matches;
    loadGsap().then(({ gsap }) => {
      panels.forEach((p) => {
        const isNext = p.dataset.panel === next;
        gsap.to(p, {
          height: isNext ? 'auto' : 0,
          duration: reduce ? 0 : isNext ? 0.9 : 0.6,
          ease: isNext ? 'expo.out' : 'power3.inOut',
          overwrite: true,
        });
        if (isNext && !reduce) {
          gsap.fromTo(
            p.querySelectorAll('[data-panel-item]'),
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, delay: 0.15, ease: 'expo.out' },
          );
        }
      });
    });
  };

  const onRowEnter = (i: number) => {
    setHovered(i);
    previewApi.current?.show(i);
  };
  const onListLeave = () => {
    setHovered(null);
    previewApi.current?.hide();
  };

  return (
    <section
      ref={section}
      id="treatments"
      aria-labelledby="treatments-title"
      className="section-y relative bg-surface"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setArmed(true)}
    >
      <div className="container-site">
        <div className="grid gap-y-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p data-reveal="fade" className="eyebrow flex items-center gap-3 text-accent-strong">
              {copy.treatments.label}
              <span className="text-fg-muted">({String(treatments.length).padStart(2, '0')})</span>
            </p>
            <h2 id="treatments-title" data-reveal="lines" className="font-display t-h1 mt-6">
              {copy.treatments.heading}
            </h2>
          </div>
          <div data-reveal="fade" className="md:col-span-4 md:col-start-9">
            <p className="t-lead text-fg-muted">{copy.treatments.intro}</p>
          </div>
        </div>

        <ul className="group/list mt-14 border-t border-hairline md:mt-20" onPointerLeave={onListLeave}>
          {treatments.map((t, i) => {
            const isOpen = open === t.slug;
            const dimmed = hovered !== null && hovered !== i && !isOpen;
            return (
              <li key={t.slug} data-reveal="fade" className="border-b border-hairline">
                <h3>
                  <button
                    type="button"
                    id={`treatment-${t.slug}`}
                    aria-expanded={isOpen}
                    aria-controls={`treatment-${t.slug}-panel`}
                    onClick={() => toggle(t.slug)}
                    onPointerEnter={() => onRowEnter(i)}
                    onFocus={() => setHovered(null)}
                    data-cursor="label"
                    data-cursor-label={isOpen ? 'Close' : 'Open'}
                    className={cn(
                      'group grid w-full grid-cols-[2.25rem_1fr_auto] items-center gap-x-3 py-6 text-left transition-opacity duration-500 sm:grid-cols-[3.5rem_1fr_auto] md:py-8 lg:grid-cols-[4.5rem_1fr_15rem_6rem_auto]',
                      dimmed && 'lg:opacity-30',
                    )}
                  >
                    <span className="eyebrow self-start pt-[0.6em] text-fg-muted sm:pt-[1.2em]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex flex-col gap-1.5">
                      <span className="font-display block text-[clamp(1.85rem,4.8vw,5rem)] leading-[1.02] tracking-[-0.03em] transition-transform duration-700 ease-out-expo group-hover:translate-x-3 md:group-hover:translate-x-5">
                        {t.name}
                      </span>
                      <span className="text-sm text-fg-muted lg:hidden">{t.line}</span>
                    </span>
                    <span className="hidden text-[0.9375rem] text-fg-muted lg:block">{t.line}</span>
                    <span className="eyebrow hidden text-fg-muted lg:block">{t.category}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex size-11 items-center justify-center rounded-full border border-hairline transition-[transform,background-color,color,border-color] duration-500 ease-out-expo md:size-14',
                        isOpen ? 'rotate-45 border-fg bg-fg text-fg-inverse' : 'group-hover:border-fg',
                      )}
                    >
                      <Plus />
                    </span>
                  </button>
                </h3>

                <div
                  id={`treatment-${t.slug}-panel`}
                  role="region"
                  aria-labelledby={`treatment-${t.slug}`}
                  data-panel={t.slug}
                  inert={!isOpen}
                  className="h-0 overflow-hidden"
                >
                  <div className="grid gap-6 pb-10 sm:grid-cols-[3.5rem_1fr] md:grid-cols-12 md:gap-8 md:pb-14">
                    <div
                      data-panel-item
                      className="relative aspect-[4/5] w-40 overflow-hidden bg-surface-muted sm:col-start-2 md:col-span-3 md:col-start-2 md:w-auto"
                    >
                      <Image
                        src={t.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 22vw, 10rem"
                        placeholder="blur"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-8 sm:col-start-2 md:col-span-5 md:col-start-6 md:self-end">
                      <p data-panel-item className="t-lead max-w-[34rem] text-pretty">
                        {t.description}
                      </p>
                      <div data-panel-item>
                        <ButtonLink
                          href={site.instagram.dm}
                          external
                          variant="outline"
                          icon={<ArrowRight />}
                          tabIndex={isOpen ? 0 : -1}
                        >
                          {copy.treatments.ask(t.shortName ?? t.name)}
                        </ButtonLink>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 hidden aspect-[4/5] w-[clamp(15rem,19vw,21rem)] overflow-hidden lg:block"
        style={{ visibility: 'hidden' }}
      >
        {treatments.map((t) => (
          <div
            key={t.slug}
            data-preview-frame
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          >
            {armed ? <Image src={t.image} alt="" fill sizes="21rem" className="object-cover" /> : null}
            <span className="eyebrow absolute bottom-4 left-4 rounded-full bg-surface/85 px-3 py-2 text-[0.625rem] text-fg backdrop-blur">
              {t.category}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
