'use client';

/**
 * Runs `fn` once the browser is idle, or after `timeout` ms at the latest.
 * Used for setup that would otherwise block the main thread while the page is
 * still loading (shader compilation, text splitting, scroll triggers).
 * Returns a cancel function.
 */
export function whenIdle(fn: () => void, timeout: number) {
  // Safari has no requestIdleCallback.
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(fn, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
}
