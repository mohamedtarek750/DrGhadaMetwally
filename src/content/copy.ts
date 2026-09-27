import { site } from './site';

/**
 * Visible copy, kept apart from the components so it can be edited in one
 * place. Voice: warm, direct, short sentences, her own phrases where possible.
 * British spelling. No em dashes, no results promised.
 */
export const copy = {
  hero: {
    eyebrow: site.role,
    location: site.area,
    tagline: 'A blissful facial journey.',
    intro: 'Medical facials that do real work on your skin, and still feel like time off.',
    primary: 'Book an appointment',
    secondary: 'Explore treatments',
    scroll: 'Scroll',
  },

  approach: {
    label: 'The approach',
    statement:
      "A medical facial shouldn't feel clinical. Ghada treats your skin properly, and you still get to lie back and switch off for a while.",
    facts: [
      { term: 'Based in', value: site.area },
      { term: 'Bookings', value: 'By Instagram DM' },
      { term: 'Also', value: site.teaching.summary },
    ],
  },

  treatments: {
    label: 'Treatments',
    heading: 'What you can book',
    intro: 'Not sure which one suits your skin? Ask her in a DM before you book.',
    ask: (name: string) => `Ask about ${name}`,
  },

  about: {
    label: 'About',
    heading: 'Meet Ghada.',
    paragraphs: [
      `${site.fullName} specialises in medical facials, and she works with laser too. She sees clients in ${site.area}.`,
      `She also teaches. Her Instagram has highlights from her webinars and training sessions. ${site.teaching.highlight}`,
    ],
    quote: 'Be picky with your friends as well as your esthetician.',
    quoteSource: 'Ghada, on Instagram',
    facts: [
      { term: 'Focus', value: 'Medical facials' },
      { term: 'Also', value: 'Laser' },
      { term: 'Teaching', value: 'Webinars & training' },
      { term: 'Based in', value: site.area },
    ],
    follow: 'Follow on Instagram',
    portraitCaption: `@${site.instagram.handle}`,
  },

  instagram: {
    label: 'On Instagram',
    intro: 'She posts treatments, training days and the odd funny moment.',
    follow: 'Follow on Instagram',
    view: 'View post',
    tiktok: 'Also on TikTok',
  },

  book: {
    label: 'Book',
    headingStart: 'This is your',
    headingAccent: 'sign.',
    body: "Send Ghada a message on Instagram. Tell her about your skin or the treatment you have in mind, and you'll agree on a time together.",
    steps: [
      { title: 'Message', text: `DM @${site.instagram.handle} on Instagram.` },
      { title: 'Choose', text: 'Pick a treatment, or ask her which one suits you.' },
      { title: 'Come in', text: `See her in ${site.area}.` },
    ],
    primary: 'Message on Instagram',
    secondary: 'Watch on TikTok',
  },

  footer: {
    line: `${site.role} in ${site.area}`,
    top: 'Back to top',
  },

  mobileBar: 'Book an appointment',
} as const;
