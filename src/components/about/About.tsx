import Image from 'next/image';
import { ArrowUpRight } from '@/components/ui/Icons';
import { Wordmark } from '@/components/ui/Wordmark';
import { copy } from '@/content/copy';
import { images, portrait } from '@/content/images';
import { site } from '@/content/site';
import { cn } from '@/lib/cn';

/**
 * Personal section. Until there's an approved portrait, the frame carries her
 * wordmark over the pink water from her own banner, which reads as brand
 * rather than as a missing photo. Set `portrait` in content/images.ts to swap.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y overflow-clip bg-surface-muted">
      <div className="container-site grid gap-y-14 md:grid-cols-12 md:gap-x-8">
        <figure className="md:sticky md:top-28 md:col-span-5 md:row-span-2 md:self-start">
          <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden bg-surface-brand">
            <div data-reveal-inner className="absolute inset-0">
              <div data-parallax="7" className="absolute -inset-y-[9%] inset-x-0">
                <Image
                  src={portrait?.src ?? images.brand.waterSoft}
                  alt={portrait?.alt ?? ''}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
              {portrait ? null : (
                <div className="absolute inset-0 flex items-center justify-center p-[12%] text-fg-inverse">
                  <Wordmark className="w-full" />
                </div>
              )}
            </div>
          </div>
          <figcaption className="eyebrow mt-4 flex flex-wrap justify-between gap-x-6 gap-y-2 text-fg-muted">
            <span>{copy.about.portraitCaption}</span>
            <span>{site.area}</span>
          </figcaption>
        </figure>

        <div className="md:col-span-6 md:col-start-7 md:pt-8">
          <p data-reveal="fade" className="eyebrow text-accent-strong">
            {copy.about.label}
          </p>
          <h2 id="about-title" data-reveal="lines" className="font-display t-h1 mt-6">
            {copy.about.heading}
          </h2>
          <div data-reveal="stagger" className="t-lead mt-10 flex max-w-[36rem] flex-col gap-5 text-pretty text-fg/85">
            {copy.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:self-end">
          <figure data-reveal="fade" className="border-l border-accent-strong/40 pl-6 md:pl-8">
            <blockquote>
              <p className="font-display t-h3 italic text-balance">&ldquo;{copy.about.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="eyebrow mt-5 text-fg-muted">{copy.about.quoteSource}</figcaption>
          </figure>

          <dl data-reveal="stagger" className="mt-14 grid grid-cols-2 border-t border-hairline">
            {copy.about.facts.map((f, i) => (
              <div
                key={f.term}
                className={cn(
                  'flex flex-col gap-1.5 border-b border-hairline py-5',
                  i % 2 === 0 ? 'border-r pr-4' : 'pl-5',
                )}
              >
                <dt className="eyebrow text-fg-muted">{f.term}</dt>
                <dd className="font-display text-xl tracking-tight md:text-2xl">{f.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal="fade"
            className="tap mt-8 text-[0.9375rem] font-medium"
          >
            <span className="link-line inline-flex items-center gap-2">
              {copy.about.follow}
              <ArrowUpRight />
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
