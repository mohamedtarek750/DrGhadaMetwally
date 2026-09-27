import Link from 'next/link';
import { ArrowRight } from '@/components/ui/Icons';
import { Wordmark } from '@/components/ui/Wordmark';
import { site } from '@/content/site';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-svh flex-col bg-surface-brand text-fg">
      <div className="container-site flex flex-1 flex-col py-8">
        <Link href="/" aria-label={`${site.fullName}, home`} className="block w-28">
          <Wordmark />
        </Link>
        <div className="my-auto max-w-3xl py-20">
          <p className="eyebrow">404</p>
          <h1 className="font-display t-h1 mt-6">This page isn&rsquo;t here.</h1>
          <p className="t-lead mt-6 max-w-md text-fg-muted">
            The link may be old, or the address has a typo. Everything lives on the homepage.
          </p>
          <Link href="/" className="btn btn-ink mt-10">
            <span className="btn-label">
              <span>Back to the homepage</span>
              <span aria-hidden="true">Back to the homepage</span>
            </span>
            <span className="btn-icon">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
