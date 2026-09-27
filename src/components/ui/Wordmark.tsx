import { cn } from '@/lib/cn';

/** viewBox of public/images/brand/wordmark.svg */
export const WORDMARK_RATIO = 4785 / 2234;

type Props = {
  className?: string;
  /** Accessible name. Leave out when the name is already in nearby text. */
  label?: string;
  /** The whole mark, or just "ghada" (line1) or "metwally" (line2). Same box either way. */
  part?: 'mark' | 'line1' | 'line2';
};

/**
 * Her own lettering, traced from her Instagram banner. The SVG lives in one
 * cached file and is referenced with <use>, so it can appear several times on
 * a page without repeating 46KB of path data. Colour follows `currentColor`.
 */
export function Wordmark({ className, label, part = 'mark' }: Props) {
  return (
    <svg
      viewBox="18 28 4785 2234"
      className={cn('block h-auto', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <use href={`/images/brand/wordmark.svg#${part}`} />
    </svg>
  );
}
