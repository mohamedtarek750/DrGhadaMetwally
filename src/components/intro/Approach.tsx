import { copy } from '@/content/copy';
import { cn } from '@/lib/cn';

/**
 * The statement right after the hero. The sentence brightens word by word as
 * it scrolls through, then three plain facts sit underneath on hairlines.
 */
export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-label" className="section-y bg-surface">
      <div className="container-site grid gap-y-12 lg:grid-cols-12">
        <p id="approach-label" data-reveal="fade" className="eyebrow text-accent-strong lg:col-span-3 lg:pt-4">
          {copy.approach.label}
        </p>
        <p data-reveal="words" className="font-display t-statement text-balance lg:col-span-9">
          {copy.approach.statement}
        </p>

        <dl data-reveal="stagger" className="grid border-y border-hairline sm:grid-cols-3 lg:col-span-9 lg:col-start-4">
          {copy.approach.facts.map((fact, i) => (
            <div
              key={fact.term}
              className={cn(
                'flex flex-col gap-2 py-6 sm:px-6 sm:first:pl-0',
                i > 0 && 'border-t border-hairline sm:border-l sm:border-t-0',
              )}
            >
              <dt className="eyebrow text-fg-muted">{fact.term}</dt>
              <dd className="font-display text-2xl tracking-tight">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
