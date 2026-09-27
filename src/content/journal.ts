import type { StaticImageData } from 'next/image';
import { images } from './images';

type Base = { id: string; href: string; date: string; dateTime: string };

export type JournalEntry =
  | (Base & { kind: 'banner'; image: StaticImageData; alt: string; caption: string })
  | (Base & { kind: 'caption'; image: StaticImageData; caption: string; tag: string });

const post = (path: string) => `https://www.instagram.com/dr_glow_ghadametwally/${path}/`;

/**
 * Lines from her own Instagram captions, linked to the posts they come from.
 * Quotes are kept to her wording, with only spelling and capitals tidied
 * ("adermapen" → "a Dermapen").
 */
export const journal: JournalEntry[] = [
  {
    id: 'banner',
    kind: 'banner',
    href: post('p/DD2cCTtMOfu'),
    date: 'Dec 21, 2024',
    dateTime: '2024-12-21',
    image: images.brand.instagramBanner,
    alt: 'From her Instagram banner: the Ghada Metwally wordmark in white over pink water, with frangipani flowers.',
    caption: 'Your blissful facial journey starts here.',
  },
  {
    id: 'dermapen',
    kind: 'caption',
    href: post('reel/C3csyhosvca'),
    date: 'Feb 17, 2024',
    dateTime: '2024-02-17',
    image: images.swatches.dermapen,
    tag: 'Dermapen',
    caption: 'This is your sign to book a Dermapen session.',
  },
  {
    id: 'aquagold',
    kind: 'caption',
    href: post('reel/DHy75C3O-SN'),
    date: 'Mar 29, 2025',
    dateTime: '2025-03-29',
    image: images.swatches.aquagold,
    tag: 'AquaGold',
    caption: 'Unlock your glow with the AquaGold facial.',
  },
  {
    id: 'selfcare',
    kind: 'caption',
    href: post('reel/DIegWUcx95A'),
    date: 'Apr 15, 2025',
    dateTime: '2025-04-15',
    image: images.swatches.hydrojelly,
    tag: 'Hydrojelly mask',
    caption: "Self care isn't a luxury, it's a necessity.",
  },
  {
    id: 'training',
    kind: 'caption',
    href: post('reel/DRNjSLhDERD'),
    date: 'Nov 18, 2025',
    dateTime: '2025-11-18',
    image: images.swatches.laser,
    tag: 'Training',
    caption: 'Building expertise, strengthening partnerships.',
  },
];
