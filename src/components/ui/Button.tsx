import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Magnetic } from './Magnetic';

type Variant = 'ink' | 'petal' | 'outline';

type Props = Omit<ComponentPropsWithoutRef<'a'>, 'children'> & {
  children: string;
  variant?: Variant;
  icon?: ReactNode;
  external?: boolean;
  magnetic?: boolean;
  cursorLabel?: string;
  /** Classes for the magnetic wrapper, e.g. to let a full-width button stretch. */
  wrapperClassName?: string;
};

/**
 * Link styled as a button. The label rolls to a copy of itself on hover
 * (the copy is hidden from assistive tech), and on desktop the whole button
 * leans toward the pointer.
 */
export function ButtonLink({
  children,
  variant = 'ink',
  icon,
  external,
  magnetic = true,
  cursorLabel,
  className,
  wrapperClassName,
  ...rest
}: Props) {
  const link = (
    <a
      {...rest}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-cursor={cursorLabel ? 'label' : 'link'}
      data-cursor-label={cursorLabel}
      className={cn('btn', `btn-${variant}`, className)}
    >
      <span className="btn-label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {icon ? <span className="btn-icon">{icon}</span> : null}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );

  return magnetic ? <Magnetic className={wrapperClassName}>{link}</Magnetic> : link;
}
