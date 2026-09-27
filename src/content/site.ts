/**
 * Facts about Dr. Ghada Metwally. Everything the site states comes from this
 * folder, and every value here has a source:
 *
 *   IG      instagram.com/dr_glow_ghadametwally (profile, bio, highlights, captions)
 *   TT      tiktok.com/@ghadametwallyskincare (bio)
 *   OWNER   confirmed by the site owner on 2026-09-27
 *
 * Rule: if a fact isn't published by her or confirmed by the owner, it does not
 * go on the page. That covers credentials, years of experience, results,
 * prices, reviews, phone numbers and street addresses. docs/content-sources.md
 * lists what is still missing.
 */

const instagramHandle = 'dr_glow_ghadametwally';
const tiktokHandle = 'ghadametwallyskincare';

export const site = {
  /** OWNER: "Dr Ghada Metwally". */
  name: 'Ghada Metwally',
  honorific: 'Dr.',
  fullName: 'Dr. Ghada Metwally',

  /** IG profile category "Medical facials"; IG bio lists Laser; OWNER: all facials plus laser. */
  role: 'Medical facials & laser',
  roleLong: 'medical facials and laser',

  /** IG bio: "A Blissful Facial Journey". */
  tagline: 'A blissful facial journey',

  /** IG bio: "New Cairo"; TT bio: "new cairo". */
  area: 'New Cairo',
  country: 'Egypt',
  countryCode: 'EG',

  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dr-ghada-metwally.vercel.app').replace(/\/$/, ''),

  instagram: {
    handle: instagramHandle,
    url: `https://www.instagram.com/${instagramHandle}/`,
    /** Opens a DM thread. IG bio: "DM For Appointment Reservations". */
    dm: `https://ig.me/m/${instagramHandle}`,
  },
  tiktok: {
    handle: tiktokHandle,
    url: `https://www.tiktok.com/@${tiktokHandle}`,
  },

  /** IG highlights "Webinars" and "Training"; IG caption 2025-11-18. */
  teaching: {
    summary: 'Webinars and training days',
    highlight: 'In November 2025 she held a training day with Yellow Rose at the Four Seasons.',
  },
} as const;

export type Site = typeof site;
