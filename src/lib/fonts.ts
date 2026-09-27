import { Fraunces, Instrument_Sans } from 'next/font/google';

/**
 * Display serif, variable weight with optical sizing (the high-contrast cut at
 * large sizes is what makes the headlines work). Preloaded: the hero needs it.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  style: 'normal',
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
});

/**
 * The italic is its own file and is not preloaded, so it doesn't compete with
 * the stylesheet and the upright face on a slow connection. See `.font-display`
 * italics in globals.css.
 */
export const frauncesItalic = Fraunces({
  subsets: ['latin'],
  style: 'italic',
  axes: ['opsz'],
  variable: '--font-fraunces-italic',
  display: 'swap',
  preload: false,
});

/** Body and interface. */
export const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});
