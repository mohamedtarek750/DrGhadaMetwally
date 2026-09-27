import { ButtonLink } from '@/components/ui/Button';
import { ArrowRight, TikTokIcon } from '@/components/ui/Icons';
import { copy } from '@/content/copy';
import { site } from '@/content/site';
import { Spotlight } from './Spotlight';

/**
 * The closing invitation. The heading borrows her own caption ("This is your
 * sign to book..."), and the three steps say plainly how booking works: it
 * all happens in her Instagram DMs.
 */
export function Appointment() {
  return (
    <section
      id="book"
      data-theme="dark"
      aria-labelledby="book-title"
      className="section-y relative isolate overflow-hidden bg-surface-inverse text-fg-inverse"
    >
      <Spotlight />
      <div className="container-site">
        <p data-reveal="fade" className="eyebrow text-accent">
          {copy.book.label}
        </p>
        <h2
          id="book-title"
          data-reveal="lines"
          className="font-display mt-8 text-[clamp(3.4rem,11vw,12rem)] leading-[0.92] tracking-[-0.04em]"
        >
          {copy.book.headingStart} <em className="italic text-accent">{copy.book.headingAccent}</em>
        </h2>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:items-end">
          <p data-reveal="fade" className="t-lead max-w-[34rem] text-pretty text-fg-inverse/80 lg:col-span-5">
            {copy.book.body}
          </p>
          <div
            data-reveal="fade"
            className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center lg:col-span-7 lg:justify-end"
          >
            <ButtonLink
              href={site.instagram.dm}
              external
              variant="petal"
              icon={<ArrowRight />}
              className="w-full sm:w-auto"
              wrapperClassName="w-full sm:w-auto"
            >
              {copy.book.primary}
            </ButtonLink>
            <ButtonLink
              href={site.tiktok.url}
              external
              variant="outline"
              icon={<TikTokIcon />}
              className="w-full sm:w-auto"
              wrapperClassName="w-full sm:w-auto"
            >
              {copy.book.secondary}
            </ButtonLink>
          </div>
        </div>

        <ol data-reveal="stagger" className="mt-20 grid border-t border-hairline-inverse md:mt-28 md:grid-cols-3">
          {copy.book.steps.map((step, i) => (
            <li
              key={step.title}
              className="border-b border-hairline-inverse py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <span className="eyebrow text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display mt-5 text-3xl tracking-tight">{step.title}</h3>
              <p className="mt-2 text-fg-inverse/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
