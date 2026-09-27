# Brand guidelines: Dr. Ghada Metwally

The brand already exists on her Instagram: a pink water banner, her white
lettering and the line "A Blissful Facial Journey". These guidelines keep the
website, and anything made after it, consistent with that. Facts and their
sources live in [`content-sources.md`](content-sources.md); visual tokens in
[`design-system.md`](design-system.md).

## Positioning

Medical facials and laser in New Cairo, booked by Instagram DM.

The idea she comes back to in her posts is that a facial can do real work on
your skin and still be relaxing. Every page should say that without promising a
result.

| Say | Because |
| --- | --- |
| Medical facials and laser | Her profile category and bio |
| A blissful facial journey | Her own tagline |
| Real skin work that still feels like time off | Her caption: facials don't mean you can't relax |
| Book with a DM | The only booking route she publishes |

## Voice

Warm, direct and a little playful, the way her captions read ("This is your
sign to book a Dermapen session", "Be picky with your friends as well as your
esthetician too"). Talk to one person. Short sentences, British spelling.

- Say what a treatment is and, where she has said so, what she uses it for.
- Quote her own lines as quotes, dated and linked to the post.
- Keep CTAs plain: "Book an appointment", "Message on Instagram", "Ask about Dermapen".

### Never write

- Results, before/after claims, percentages, "guaranteed", "painless", "permanent".
- Credentials, years of experience, awards or client counts that she hasn't published.
- Reviews or testimonials that aren't real and approved.
- Filler luxury phrases: "elevate", "transform", "world-class", "state-of-the-art",
  "where science meets beauty", "your journey to confidence".
- Em dashes, and sentences without a verb stacked one after another.

### Sample rewrites

| Before | After |
| --- | --- |
| Peels matched to your skin. | She picks the peel to suit your skin. |
| Laser treatments in New Cairo. | Ghada also does laser. |
| Cleanse, extract, hydrate. / Exfoliate, infuse, oxygenate. | Deep cleanse, then hydration. / Three steps in one. |
| Treatments, training days and the odd funny moment. It is also where bookings happen. | She posts treatments, training days and the odd funny moment. |

## Logo

Her logo is the "ghada metwally" lettering from her banner, traced to vector
(`public/images/brand/wordmark.svg`). The site uses the lettering only; her
banner also has frangipani flowers and a "Medical Esthetician" line, which stay
off the site until she confirms her title.

| Version | Use |
| --- | --- |
| Ink `#2A1420` on pink or porcelain | Default: hero, header, share card, 404 |
| Porcelain on pink water | The About frame, like her banner |
| Petal `#FCA6D6` on ink | The footer |
| The "g" on pink | Favicon and app icon |

- Keep clear space of at least the height of the "g" bowl on all sides.
- Minimum width: 96px on screen for the two-line mark, 16px for the "g" icon.
- Don't rotate, stretch, recolour outside the three versions, add shadows or
  outlines, or set it over busy imagery.
- "Dr." sits above the mark in Fraunces italic. It is never part of the mark itself.

## Colour

| | Hex | Role |
| --- | --- | --- |
| Petal | `#FCA6D6` | Her pink. Large surfaces, fills, the footer mark |
| Ink | `#2A1420` | Text, dark sections, primary buttons |
| Porcelain | `#FBF6F3` | Page background |
| Blush | `#F9E4ED` | Quiet alternate sections |
| Plum | `#5B4452` | Secondary text |
| Berry | `#9C2A62` | Small accents, links and focus on light backgrounds |

Pink is a surface, never small text on a light background. Ink on petal is 9.7:1.

## Type

- **Fraunces**: headings, light (300) at display sizes; italic for her phrases and one
  accent word at most per heading.
- **Instrument Sans**: everything else. Labels in 12px capitals with wide tracking.

## Imagery

- Her own pink water (from the banner) is the brand texture.
- Treatment images are drawn textures until there's real photography. They must
  never look like a patient or a result.
- Real photos: her portrait, the studio, hands and equipment. Client faces only
  with the client's written consent, and never as before/after unless she provides
  real, approved pairs.
- Keep photos warm and soft; nothing cold, clinical or blue.

## Share cards and social

The share image is her mark in ink on pink with "Medical facials & laser · New
Cairo" (`src/app/opengraph-image.tsx`). New social graphics should reuse the same
three logo versions, the palette above and Fraunces for any headline.
