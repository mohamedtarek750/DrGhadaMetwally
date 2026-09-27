import instagramBanner from '../../public/images/brand/instagram-banner-card.webp';
import waterCaustics from '../../public/images/brand/water-caustics.webp';
import waterSoft from '../../public/images/brand/water-soft.webp';
import aquagold from '../../public/images/swatches/aquagold.webp';
import dermapen from '../../public/images/swatches/dermapen.webp';
import hydrafacial from '../../public/images/swatches/hydrafacial.webp';
import hydrojelly from '../../public/images/swatches/hydrojelly.webp';
import laser from '../../public/images/swatches/laser.webp';
import oxygeneo from '../../public/images/swatches/oxygeneo.webp';
import peels from '../../public/images/swatches/peels.webp';

/**
 * All images on the site. Static imports give next/image the dimensions and a
 * blur placeholder.
 *
 * `brand` images are crops of her Instagram banner. `swatches` are drawn
 * textures (scripts/build-images.mjs) standing in for treatment photography.
 * To use a real photo, drop it in public/images and point the entry at it.
 */
export const images = {
  brand: { instagramBanner, waterCaustics, waterSoft },
  swatches: { aquagold, dermapen, hydrafacial, hydrojelly, laser, oxygeneo, peels },
};

/**
 * Portrait for the About section. There is no approved portrait yet, so the
 * section shows her wordmark on pink water instead. Set this to an imported
 * photo to replace it.
 */
export const portrait: { src: typeof waterSoft; alt: string } | null = null;
