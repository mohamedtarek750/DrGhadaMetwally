import { site } from '@/content/site';
import { treatments } from '@/content/treatments';

/**
 * Structured data built only from content/site.ts and content/treatments.ts.
 * No phone, street address, opening hours, ratings or prices: none of them
 * are published yet, and schema.org should say nothing the page doesn't.
 */
export function JsonLd() {
  const place = {
    '@type': 'PostalAddress',
    addressLocality: site.area,
    addressCountry: site.countryCode,
  };

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: site.fullName,
        inLanguage: 'en',
      },
      {
        '@type': 'Person',
        '@id': `${site.url}/#ghada`,
        name: site.name,
        honorificPrefix: site.honorific,
        jobTitle: site.role,
        url: site.url,
        sameAs: [site.instagram.url, site.tiktok.url],
        workLocation: { '@type': 'Place', address: place },
        knowsAbout: treatments.map((t) => t.name),
      },
      {
        '@type': 'HealthAndBeautyBusiness',
        '@id': `${site.url}/#practice`,
        name: site.fullName,
        url: site.url,
        description: `${site.role} in ${site.area}. Bookings by Instagram DM.`,
        address: place,
        areaServed: { '@type': 'City', name: site.area },
        sameAs: [site.instagram.url, site.tiktok.url],
        employee: { '@id': `${site.url}/#ghada` },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Treatments',
          itemListElement: treatments.map((t) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: t.name, description: t.description },
          })),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output can't close the script tag once "<" is escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
