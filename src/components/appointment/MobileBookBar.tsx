'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from '@/components/ui/Icons';
import { copy } from '@/content/copy';
import { site } from '@/content/site';
import { cn } from '@/lib/cn';

/**
 * Thumb-reach booking button on phones. It appears once the hero's own button
 * has scrolled away and steps aside when the booking section or footer is on
 * screen, so there's never two of them.
 */
export function MobileBookBar() {
  const [pastHero, setPastHero] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    const end = [document.getElementById('book'), document.getElementById('site-footer')].filter(Boolean) as Element[];
    const seen = new Set<Element>();

    const heroIo = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0 });
    if (hero) heroIo.observe(hero);
    const endIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      setNearEnd(seen.size > 0);
    });
    end.forEach((el) => endIo.observe(el));

    return () => {
      heroIo.disconnect();
      endIo.disconnect();
    };
  }, []);

  const show = pastHero && !nearEnd;

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-700 ease-out-expo md:hidden',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[130%] opacity-0',
      )}
    >
      <a
        href={site.instagram.dm}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
        aria-hidden={!show}
        className="btn btn-ink w-full shadow-float"
      >
        <span className="btn-label">
          <span>{copy.mobileBar}</span>
          <span aria-hidden="true">{copy.mobileBar}</span>
        </span>
        <ArrowRight />
        <span className="sr-only"> on Instagram (opens in a new tab)</span>
      </a>
    </div>
  );
}
