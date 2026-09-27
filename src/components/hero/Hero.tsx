'use client';

import Image from 'next/image';
import { useEffect, useRef, type CSSProperties } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowDown, ArrowRight } from '@/components/ui/Icons';
import { Wordmark } from '@/components/ui/Wordmark';
import { copy } from '@/content/copy';
import { images } from '@/content/images';
import { site } from '@/content/site';
import { whenIdle } from '@/lib/idle';
import { loadGsap, media } from '@/lib/motion';
import { WaterCanvas } from './WaterCanvas';

/**
 * Each line of the wordmark sits in its own clipped layer so it can rise into
 * place. The clip edges leave room for the "g" descender and the "ll" tops.
 */
const LINE_CLIPS = { line1: 'inset(0 0 40% 0)', line2: 'inset(50% 0 0 0)' } as const;

export function Hero() {
  const root = useRef<HTMLElement>(null);

  // The intro itself is CSS (globals.css, "Page intro"), so it doesn't wait for
  // hydration. Remember it has played so later visits skip the curtain.
  useEffect(() => {
    try {
      sessionStorage.setItem('gm-intro', '1');
    } catch {
      /* private mode */
    }
  }, []);

  // Leaving the hero: the wordmark drifts up slower than the page and the
  // water settles back. Set up at idle; it only matters once you scroll.
  useEffect(() => {
    let revert: (() => void) | null = null;
    let disposed = false;
    const cancelIdle = whenIdle(async () => {
      const { gsap } = await loadGsap();
      if (disposed || !root.current) return;
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add(media.motion, () => {
        const q = gsap.utils.selector(root);
        const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(q('[data-hero-mark]'), { yPercent: -18, ease: 'none', scrollTrigger: scrub });
        gsap.to(q('[data-hero-bg]'), { scale: 1.08, yPercent: 8, ease: 'none', scrollTrigger: scrub });
      });
    }, 1500);
    return () => {
      disposed = true;
      cancelIdle();
      revert?.();
    };
  }, []);

  return (
    <>
      <div
        data-curtain
        aria-hidden="true"
        className="intro-curtain fixed inset-0 z-[90] hidden items-center justify-center bg-surface"
      >
        <div data-curtain-mark className="w-36 text-fg sm:w-44">
          <Wordmark />
        </div>
      </div>

      <section
        ref={root}
        id="top"
        aria-labelledby="hero-title"
        className="relative isolate flex min-h-svh flex-col overflow-hidden bg-surface-brand text-fg"
      >
        <div data-hero-bg className="absolute inset-0 -z-10 origin-top">
          <Image
            src={images.brand.waterCaustics}
            alt=""
            fill
            // Decorative: the section is already the same pink and the live
            // water fades in over it, so it shouldn't compete with text and fonts.
            loading="eager"
            fetchPriority="low"
            sizes="100vw"
            placeholder="blur"
            className="object-cover"
          />
          <WaterCanvas className="absolute inset-0 size-full" />
        </div>

        <div className="container-site flex flex-1 flex-col pb-5 pt-24 sm:pt-28 md:pb-7 md:pt-32">
          <div
            data-intro="fade"
            style={{ '--i': 0 } as CSSProperties}
            className="eyebrow flex items-center justify-between gap-6 text-fg/80"
          >
            <p>{copy.hero.eyebrow}</p>
            <p className="hidden sm:block">{copy.hero.location}</p>
          </div>

          <div className="mt-auto grid gap-9 pt-10 lg:grid-cols-12 lg:items-end lg:gap-x-10">
            <h1 id="hero-title" className="lg:col-span-8">
              <span className="sr-only">
                {site.fullName}, {site.roleLong} in {site.area}
              </span>
              <span
                aria-hidden="true"
                data-intro="dr"
                className="font-display mb-[0.2em] block text-[clamp(1.6rem,3.2vw,3.25rem)] italic leading-none tracking-tight"
              >
                {site.honorific}
              </span>
              {/* Width is capped by viewport height too, so the hero always fits one screen. */}
              <span
                aria-hidden="true"
                data-hero-mark
                className="relative block w-full md:w-[min(100%,calc((100svh_-_31rem)*2.14))] lg:w-[min(100%,calc((100svh_-_21rem)*2.14))]"
              >
                <span className="block" style={{ clipPath: LINE_CLIPS.line1 }}>
                  <span data-mark-line className="block" style={{ '--i': 0 } as CSSProperties}>
                    <Wordmark part="line1" />
                  </span>
                </span>
                <span className="absolute inset-0 block" style={{ clipPath: LINE_CLIPS.line2 }}>
                  <span data-mark-line className="block" style={{ '--i': 1 } as CSSProperties}>
                    <Wordmark part="line2" />
                  </span>
                </span>
              </span>
            </h1>

            <div className="grid gap-8 md:grid-cols-12 md:items-end lg:col-span-4 lg:block lg:pb-[0.4vw]">
              <div className="md:col-span-6">
                <p data-intro="fade" style={{ '--i': 1 } as CSSProperties} className="font-display t-h3 italic">
                  {copy.hero.tagline}
                </p>
                <p
                  data-intro="fade"
                  style={{ '--i': 2 } as CSSProperties}
                  className="t-lead mt-3 max-w-[30rem] text-fg-muted"
                >
                  {copy.hero.intro}
                </p>
              </div>
              <div
                data-intro="fade"
                style={{ '--i': 3 } as CSSProperties}
                className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center md:col-span-6 md:justify-end lg:mt-8 lg:justify-start"
              >
                <ButtonLink
                  href={site.instagram.dm}
                  external
                  variant="ink"
                  icon={<ArrowRight />}
                  className="w-full sm:w-auto"
                  wrapperClassName="w-full sm:w-auto"
                >
                  {copy.hero.primary}
                </ButtonLink>
                <a href="#treatments" className="tap group -my-2 text-[0.9375rem] font-medium">
                  <span className="link-line inline-flex items-center gap-2">
                    {copy.hero.secondary}
                    <ArrowDown className="transition-transform duration-500 group-hover:translate-y-0.5" />
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div
            data-intro="fade"
            style={{ '--i': 4 } as CSSProperties}
            className="mt-10 flex items-center justify-between gap-4 border-t border-fg/15 pt-4 text-sm text-fg/75 md:mt-14"
          >
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="tap -my-2.5">
              <span className="link-u">@{site.instagram.handle}</span>
              <span className="sr-only"> on Instagram (opens in a new tab)</span>
            </a>
            <span aria-hidden="true" className="eyebrow hidden items-center gap-3 md:flex">
              {copy.hero.scroll}
              <span className="relative block h-px w-12 overflow-hidden bg-fg/20">
                <span className="scroll-cue absolute inset-y-0 left-0 w-1/2 bg-fg" />
              </span>
            </span>
            <span>
              {site.area}, {site.country}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
