/**
 * Curated Emporia visitor directory.
 * Entries are grounded in Emporia's official tourism/city listings as of Nov 2026.
 * Not affiliated, endorsed, booked, or confirmed open for PixelFest 2027.
 */
export type VisitCategory = "family" | "gaming" | "arts" | "dining" | "outdoors" | "shopping";

export type VisitPlace = {
  slug: string;
  name: string;
  address: string;
  short: string;
  category: VisitCategory[];
  label: string;
  link: string;
  highlight?: string;
};

export const visitCategories: { id: "all" | VisitCategory; label: string }[] = [
  { id: "all", label: "Explore all" },
  { id: "family", label: "Family friendly" },
  { id: "gaming", label: "Games & fun" },
  { id: "arts", label: "Arts & culture" },
  { id: "dining", label: "Food & coffee" },
  { id: "outdoors", label: "Outdoors" },
  { id: "shopping", label: "Shop local" },
];

export const visitPlaces: VisitPlace[] = [
  {
    slug: "downtown",
    name: "Historic Downtown Emporia",
    address: "Commercial St, Emporia, KS 66801",
    short: "Stroll Commercial Street's walkable historic district, with independent shops, places to eat, arts and local character.",
    category: ["shopping", "arts", "dining"],
    label: "Downtown district",
    link: "https://visitemporia.com/downtown/",
    highlight: "Nine-block district",
  },
  {
    slug: "zoo",
    name: "David Traylor Zoo",
    address: "75 Soden Rd, Emporia, KS 66801",
    short: "See wildlife and landscaped gardens at a family favorite in Soden's Grove.",
    category: ["family", "outdoors"],
    label: "Zoo & gardens",
    link: "https://www.emporiaks.gov/159/David-Traylor-Zoo",
    highlight: "Free admission",
  },
  {
    slug: "lyon-history",
    name: "Lyon County History Center",
    address: "711 Commercial St, Emporia, KS 66801",
    short: "Explore local history, rotating exhibits and a hands-on children's area in the heart of downtown.",
    category: ["family", "arts"],
    label: "Museum",
    link: "https://visitemporia.com/place/lyon-county-history-center/",
  },
  {
    slug: "imaginarium",
    name: "Imaginarium",
    address: "707 Commercial St, Emporia, KS 66801",
    short: "Discover hands-on STEM activities and an educational toy shop. Check current drop-in sessions before visiting.",
    category: ["family", "gaming", "shopping"],
    label: "STEM & makerspace",
    link: "https://visitemporia.com/place/imaginarium/",
  },
  {
    slug: "reality-check",
    name: "Reality Check",
    address: "320 Commercial St, Emporia, KS 66801",
    short: "Add more games to your trip with virtual-reality experiences, board games and classic Nintendo fun.",
    category: ["gaming", "family"],
    label: "VR gaming",
    link: "https://visitemporia.com/place/reality-check/",
  },
  {
    slug: "granada",
    name: "Emporia Granada Theatre",
    address: "807 Commercial St, Emporia, KS 66801",
    short: "Admire a beautifully restored 1929 theatre and check its calendar for any live performances during your visit.",
    category: ["arts"],
    label: "Historic theatre",
    link: "https://visitemporia.com/downtown/",
  },
  {
    slug: "arts-center",
    name: "Emporia Arts Center",
    address: "815 Commercial St, Emporia, KS 66801",
    short: "See local and regional artwork, browse creative gifts and explore current arts events and classes.",
    category: ["arts", "shopping", "family"],
    label: "Gallery & arts",
    link: "https://visitemporia.com/place/emporia-arts-center/",
  },
  {
    slug: "axe-shedd",
    name: "The Axe Shedd & Simple Simon's Pizza",
    address: "616 Commercial St, Emporia, KS 66801",
    short: "Grab a pizza and plan a group outing with guided axe-throwing lanes. Ask about age restrictions and reservations.",
    category: ["gaming", "dining"],
    label: "Entertainment & pizza",
    link: "https://visitemporia.com/place/the-axe-shedd/",
  },
  {
    slug: "sweet-granada",
    name: "Sweet Granada Chocolate Cafe",
    address: "803 Commercial St, Emporia, KS 66801",
    short: "Treat yourself to locally made chocolates, truffles and sweets just steps from the Granada Theatre.",
    category: ["dining", "shopping", "family"],
    label: "Chocolate & treats",
    link: "https://visitemporia.com/place/the-sweet-granada/",
  },
  {
    slug: "radius",
    name: "Radius Brewing Company",
    address: "610 Merchant St, Emporia, KS 66801",
    short: "Sit down for brick-oven pizza, burgers and other food at this downtown restaurant.",
    category: ["dining"],
    label: "Restaurant & pizza",
    link: "https://visitemporia.com/place/radius-brewing-company/",
  },
  {
    slug: "gravel-city",
    name: "Gravel City Roasters",
    address: "715 Commercial St, Emporia, KS 66801",
    short: "Start your morning downtown with locally roasted coffee, drinks and a light bite.",
    category: ["dining"],
    label: "Coffee & breakfast",
    link: "https://visitemporia.com/downtown/",
  },
  {
    slug: "commercial-diner",
    name: "Commercial Street Diner",
    address: "614 Commercial St, Emporia, KS 66801",
    short: "Fuel up with classic diner-style breakfast before heading out to explore.",
    category: ["dining", "family"],
    label: "Breakfast diner",
    link: "https://visitemporia.com/downtown/",
  },
  {
    slug: "sodens-grove",
    name: "Soden's Grove Park",
    address: "1000 S Commercial St, Emporia, KS 66801",
    short: "Enjoy a relaxed outdoor break at the park near the zoo, with picnic space and room to stretch your legs.",
    category: ["family", "outdoors"],
    label: "Park & fresh air",
    link: "https://visitemporia.com/attractions/parks-recreation/",
  },
  {
    slug: "wooster-lake",
    name: "Wooster Lake",
    address: "E 15th Ave, Emporia, KS 66801",
    short: "Take a quiet stroll by the lake on Emporia State University's campus.",
    category: ["outdoors", "family"],
    label: "Campus outdoors",
    link: "https://visitemporia.com/attractions/parks-recreation/",
  },
  {
    slug: "flint-hills-lanes",
    name: "Flint Hills Lanes",
    address: "1519 W 6th Ave, Emporia, KS 66801",
    short: "Keep the friendly competition going with bowling and arcade-style entertainment.",
    category: ["gaming", "family"],
    label: "Bowling",
    link: "https://visitemporia.com/team-pass-schools/",
  },
  {
    slug: "do-bs",
    name: "Do-B's",
    address: "704 E 12th Ave, Emporia, KS 66801",
    short: "Order a burger, cheesesteak or po' boy at this local counter-service favorite.",
    category: ["dining", "family"],
    label: "Burgers & sandwiches",
    link: "https://visitemporia.com/dining/",
  },
];

export function visitMapUrl(place: VisitPlace): string {
  return "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(place.name + ", " + place.address);
}
