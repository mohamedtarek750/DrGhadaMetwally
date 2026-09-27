import type { StaticImageData } from 'next/image';
import { images } from './images';

export type TreatmentCategory = 'Facial' | 'Skin' | 'Laser';

export type Treatment = {
  slug: string;
  name: string;
  /** Used where space is tight, like button labels. */
  shortName?: string;
  category: TreatmentCategory;
  /** One line shown in the list. */
  line: string;
  /** Shown when the row is opened. */
  description: string;
  image: StaticImageData;
  /** Where the treatment is named on her own channels. */
  source: string;
};

/**
 * Only treatments she names herself. Descriptions say what the treatment is and,
 * where she has said so, what she uses it for. No promised results.
 */
export const treatments: Treatment[] = [
  {
    slug: 'hydrafacial',
    name: 'HydraFacial',
    category: 'Facial',
    line: 'Deep cleanse, then hydration.',
    description:
      'HydraFacial deep-cleans the skin, clears pores with gentle extraction and finishes with hydrating serums, all in one sitting.',
    image: images.swatches.hydrafacial,
    source: 'IG bio "Hydra Facial"; #hydrafacial on posts 2025-04-15 and 2025-11-27',
  },
  {
    slug: 'oxygeneo',
    name: 'OxyGeneo',
    category: 'Facial',
    line: 'Three steps in one.',
    description: 'OxyGeneo puts three steps into one treatment: exfoliation, serum infusion and oxygenation.',
    image: images.swatches.oxygeneo,
    source: 'IG bio "OxyGeneo"',
  },
  {
    slug: 'aquagold',
    name: 'AquaGold facial',
    shortName: 'AquaGold',
    category: 'Facial',
    line: 'Serums, delivered straight in.',
    description:
      'AquaGold delivers customised serums straight into the skin. Ghada says it leaves skin hydrated and glowy, with no downtime.',
    image: images.swatches.aquagold,
    source: 'IG caption 2025-03-29',
  },
  {
    slug: 'hydrojelly-mask',
    name: 'Hydrojelly mask',
    shortName: 'hydrojelly masks',
    category: 'Facial',
    line: 'A cool, peel-off mask.',
    description:
      'Esthemax hydrojelly masks are mixed fresh, left to set on your skin and lifted off in one soft sheet.',
    image: images.swatches.hydrojelly,
    source: 'IG highlights "Hydrojelly mask", "Esthemax"; #hydrojellymask #esthemax',
  },
  {
    slug: 'dermapen',
    name: 'Dermapen microneedling',
    shortName: 'Dermapen',
    category: 'Skin',
    line: 'For scars, marks, pores and fine lines.',
    description: 'Dermapen is a microneedling pen. Ghada uses it for acne scars and marks, open pores and fine lines.',
    image: images.swatches.dermapen,
    source: 'IG bio "Dermapen"; IG caption 2024-02-17',
  },
  {
    slug: 'peels',
    name: 'Chemical peels',
    shortName: 'peels',
    category: 'Skin',
    line: 'Picked to suit your skin.',
    description: "She picks the peel to suit your skin. Tell her what you're dealing with and she'll suggest one.",
    image: images.swatches.peels,
    source: 'IG bio "Peeling"; IG highlight "Peeling"',
  },
  {
    slug: 'laser',
    name: 'Laser',
    shortName: 'laser',
    category: 'Laser',
    line: 'Ask what it can do for you.',
    description:
      "Ghada also does laser. Message her with what you'd like treated and she'll tell you whether it's the right call.",
    image: images.swatches.laser,
    source: 'IG bio "Laser"; OWNER',
  },
];
