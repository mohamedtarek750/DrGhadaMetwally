'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowUpRight, InstagramIcon, TikTokIcon } from '@/components/ui/Icons';
import { Wordmark } from '@/components/ui/Wordmark';
import { copy } from '@/content/copy';
import { journal, type JournalEntry } from '@/content/journal';
import { site } from '@/content/site';
import { whenIdle } from '@/lib/idle';
import { loadGsap, media } from '@/lib/motion';
import { getLenis } from '@/lib/scroll';

/**
 * Her Instagram, brought into the page as editorial cards rather than an
 * embedded feed: the banner she posted and lines from her own captions, each
 * linking back to the post. On desktop the row is pinned and moves sideways as
 * you scroll; on touch screens and with reduced motion it's a normal swipeable
 * row.
 */
export function InstagramSection() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    let revert: (() => void) | null = null;
    let disposed = false;
    const cancelIdle = whenIdle(async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (disposed) return;
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add(`${media.desktop} and ${media.motion}`, () => {
        const pin = section.current?.querySelector<HTMLElement>('[data-ig-pin]');
        const track = section.current?.querySelector<HTMLElement>('[data-ig-track]');
        const bar = section.current?.querySelector<HTMLElement>('[data-ig-progress]');
        if (!pin || !track) return;
        const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            pin: true,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
            // Created at idle, possibly after triggers further down the page;
            // refreshing first keeps their positions right below the pin.
            refreshPriority: 1,
          },
        });
        tl.to(track, { x: () => -distance(), ease: 'none' }, 0);
        if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);

        // Cards lean slightly with the scroll direction, then settle.
        gsap.utils.toArray<HTMLElement>('[data-ig-card]', track).forEach((card, i) => {
          gsap.from(card, {
            yPercent: 5 + (i % 2) * 3,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: 'left 105%',
              end: 'left 80%',
              scrub: true,
            },
          });
        });
        ScrollTrigger.refresh();

        // Keyboard: the row only moves with page scroll, so a focused card is
        // brought into view by scrolling the page to where the row shows it.
        const onFocus = (e: FocusEvent) => {
          const card = (e.target as Element).closest<HTMLElement>('[data-ig-card]');
          const st = tl.scrollTrigger;
          if (!card || !st) return;
          const max = distance();
          const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
          const offset = gsap.utils.clamp(0, max, card.offsetLeft - pad);
          const y = st.start + (st.end - st.start) * (max ? offset / max : 0);
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, { duration: 0.9 });
          else window.scrollTo({ top: y });
        };
        track.addEventListener('focusin', onFocus);
        return () => track.removeEventListener('focusin', onFocus);
      });
    }, 1200);
    return () => {
      disposed = true;
      cancelIdle();
      revert?.();
    };
  }, []);

  return (
    <section ref={section} id="instagram" aria-labelledby="instagram-title" className="relative bg-surface">
      <div data-ig-pin className="flex flex-col justify-center overflow-clip py-24 md:py-32 lg:min-h-svh lg:py-20">
        <div className="container-site grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7 lg:col-span-8">
            <p data-reveal="fade" className="eyebrow text-accent-strong">
              {copy.instagram.label}
            </p>
            <h2 id="instagram-title" className="font-display t-h2 mt-5 break-words">
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal="lines"
                className="block transition-colors duration-500 hover:text-accent-strong"
                data-cursor="label"
                data-cursor-label="Follow"
              >
                @dr_glow_
                <br />
                ghadametwally
                <span className="sr-only"> on Instagram (opens in a new tab)</span>
              </a>
            </h2>
          </div>
          <div data-reveal="fade" className="flex flex-col gap-6 md:col-span-5 lg:col-span-4">
            <p className="t-lead text-fg-muted">{copy.instagram.intro}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink href={site.instagram.url} external variant="ink" icon={<InstagramIcon />}>
                {copy.instagram.follow}
              </ButtonLink>
              <a
                href={site.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tap text-[0.9375rem] font-medium"
              >
                <span className="link-line inline-flex items-center gap-2">
                  <TikTokIcon />
                  {copy.instagram.tiktok}
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>

        <ul
          data-ig-track
          aria-label="Posts from her Instagram"
          className="relative mt-12 flex snap-x snap-mandatory scroll-px-[clamp(1.25rem,4vw,3.5rem)] gap-4 overflow-x-auto px-[clamp(1.25rem,4vw,3.5rem)] pb-4 [scrollbar-width:none] md:mt-16 md:gap-6 lg:snap-none lg:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {journal.map((entry) => (
            <li key={entry.id} data-ig-card className="shrink-0 snap-start">
              <JournalCard entry={entry} />
            </li>
          ))}
          <li data-ig-card className="shrink-0 snap-start">
            <FollowCard />
          </li>
        </ul>

        <div className="container-site mt-8 hidden lg:block" aria-hidden="true">
          <div className="h-px w-full bg-hairline">
            <div data-ig-progress className="h-px origin-left scale-x-0 bg-fg" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Square cards share one height. The banner keeps its 3:1 shape: on phones it
// sizes by width so the whole wordmark stays in view; on desktop by height.
const frame = {
  square: 'aspect-square h-[clamp(15rem,40svh,24rem)] max-w-[78vw]',
  wide: 'aspect-[3/1] w-[84vw] lg:h-[clamp(15rem,40svh,24rem)] lg:w-auto',
};

function JournalCard({ entry }: { entry: JournalEntry }) {
  const wide = entry.kind === 'banner';
  return (
    <a
      href={entry.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="label"
      data-cursor-label="View"
      className="group relative flex h-full flex-col border border-hairline bg-surface"
    >
      <div className={`relative overflow-hidden bg-surface-muted ${wide ? frame.wide : frame.square}`}>
        <Image
          src={entry.image}
          alt={entry.kind === 'banner' ? entry.alt : ''}
          fill
          sizes={wide ? '(min-width: 1024px) 72rem, 88vw' : '(min-width: 1024px) 24rem, 78vw'}
          placeholder="blur"
          className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]"
        />
        {entry.kind === 'caption' ? (
          <span className="eyebrow absolute left-4 top-4 rounded-full bg-surface/85 px-3 py-2 text-[0.625rem] backdrop-blur">
            {entry.tag}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-6 p-5 md:p-6">
        <blockquote
          className={`font-display text-[1.375rem] leading-[1.2] tracking-[-0.01em] text-balance md:text-2xl ${wide ? '' : 'max-w-[20rem]'}`}
        >
          &ldquo;{entry.caption}&rdquo;
        </blockquote>
        <div className="eyebrow flex items-center justify-between gap-4 text-fg-muted">
          <time dateTime={entry.dateTime}>{entry.date}</time>
          <span className="inline-flex items-center gap-1.5 transition-colors group-hover:text-fg">
            {copy.instagram.view}
            <ArrowUpRight className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
      <span className="sr-only"> (opens Instagram in a new tab)</span>
    </a>
  );
}

function FollowCard() {
  return (
    <a
      href={site.instagram.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="label"
      data-cursor-label="Follow"
      className="group relative flex h-full w-[min(78vw,22rem)] flex-col justify-between bg-surface-brand p-6 text-fg"
    >
      <Wordmark className="w-40 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1" />
      <div className="mt-16">
        <p className="font-display t-h3">Follow along</p>
        <p className="mt-2 text-sm text-fg/75">@{site.instagram.handle}</p>
        <span className="mt-6 inline-flex size-12 items-center justify-center rounded-full bg-fg text-fg-inverse transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight />
        </span>
      </div>
      <span className="sr-only"> (opens Instagram in a new tab)</span>
    </a>
  );
}
