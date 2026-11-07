/** Approved inaugural merch art; published product photography is illustrative. */
export const merchDesigns = [
  {
    slug: 'official-logo',
    name: 'Official Logo',
    collection: 'Official Collection',
    description: 'The badge of Midwest Pixel Fest. A bold mix of retro arcades, tabletop, cosplay, and our gaming community.',
  },
  {
    slug: 'midwest-nights',
    name: 'Midwest Nights',
    collection: 'Gaming & Community',
    description: 'Neon city lights, one more game, and a reminder: Play. Connect. Belong.',
  },
  {
    slug: 'arcade-mode',
    name: 'Arcade Mode',
    collection: 'Retro Arcade',
    description: 'Big cabinet energy. Bright pixels. Press start and chase the high score.',
  },
  {
    slug: 'roll-for-adventure',
    name: 'Roll for Adventure',
    collection: 'Tabletop & RPG',
    description: 'Bring the dragon, grab your dice, and begin your next legendary campaign.',
  },
  {
    slug: 'cosplay-lives-here',
    name: 'Cosplay Lives Here',
    collection: 'Cosplay & Fandom',
    description: 'A celebration of the creativity, craft, and characters that make cosplay special.',
  },
] as const;

export const merchTypes = [
  { slug: 'tee', name: 'Graphic T-Shirt', color: 'Black', priceCents: 2499, priceLabel: '$24.99' },
  { slug: 'hoodie', name: 'Pullover Hoodie', color: 'Black', priceCents: 4999, priceLabel: '$49.99' },
  { slug: 'tote', name: 'Canvas Tote Bag', color: 'Natural', priceCents: 1999, priceLabel: '$19.99' },
] as const;

export const merchProducts = merchDesigns.flatMap((design) =>
  merchTypes.map((type) => ({
    id: `${design.slug}-${type.slug}`,
    title: design.name,
    collection: design.collection,
    description: design.description,
    designSlug: design.slug,
    category: type.slug,
    productType: type.name,
    color: type.color,
    priceCents: type.priceCents,
    priceLabel: type.priceLabel,
    image: `/merch/${design.slug}-${type.slug}.webp`,
  })),
);
