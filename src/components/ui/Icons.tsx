type IconProps = { className?: string };

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className={className} {...base}>
      <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
    </svg>
  );
}

export function ArrowDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className={className} {...base}>
      <path d="M12 4v15M6.5 13.5 12 19l5.5-5.5" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" className={className} {...base}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  );
}

export function Plus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" className={className} {...base} strokeWidth={1.25}>
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className={className} {...base}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className={className} {...base}>
      <path d="M14 3.5v11.25a3.75 3.75 0 1 1-3.75-3.75" />
      <path d="M14 3.5c.4 2.9 2.3 4.8 5.5 5.1" />
    </svg>
  );
}
