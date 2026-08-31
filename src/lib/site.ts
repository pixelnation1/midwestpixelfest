export const siteUrl = "https://midwestpixelfest.com";

export type Venue = {
  name: string;
  streetAddress: string | null;
  addressLocality: string;
  addressRegion: string;
  postalCode: string | null;
  addressCountry: "US";
};

/**
 * Event facts used by metadata and JSON-LD.
 * Keep startDate, endDate, and venue null until they are officially announced.
 * Event schema will not render until all three are present.
 *
 * ticketUrl: set once to the public Ticketleap (or other) checkout URL.
 * All ticket CTAs read this value — do not hard-code checkout links in components.
 */
export const event = {
  status: "tba" as const,
  year: 2027,
  startDate: null as string | null,
  endDate: null as string | null,
  venue: null as Venue | null,
  ticketUrl: null as string | null,
};

export const site = {
  name: "Midwest Pixel Fest",
  shortName: "Pixel Fest",
  organizer: "PixelNation",
  location: "Emporia, Kansas",
  city: "Emporia",
  region: "Kansas",
  regionCode: "KS",
  country: "US",
  year: event.year,
  dateLabel: "2027 — Date To Be Announced",
  tagline: "Gaming • Cosplay • Collectibles • Community",
  description:
    "Midwest Pixel Fest brings gaming, cosplay, collectibles, creators, vendors and community together in Emporia, Kansas.",
  defaultTitle:
    "Midwest Pixel Fest | Gaming, Cosplay & Pop Culture Convention in Kansas",
  siteUrl,
  ogImagePath: "/opengraph-image",
  twitterImagePath: "/twitter-image",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null,
} as const;

export function absoluteUrl(path = "/"): string {
  if (path === "/") {
    return site.siteUrl;
  }
  return `${site.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isEventSchemaReady(
  value = event,
): value is typeof event & { startDate: string; endDate: string; venue: Venue } {
  return Boolean(value.startDate && value.endDate && value.venue?.name);
}

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/guests", label: "Guests" },
  { href: "/schedule", label: "Schedule" },
  { href: "/gaming", label: "Gaming" },
  { href: "/cosplay", label: "Cosplay" },
  { href: "/vendors", label: "Vendors" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/travel", label: "Travel" },
  { href: "/faq", label: "FAQ" },
] as const;

export const socialLinks = [
  { name: "Facebook", href: null as string | null, comingSoon: true },
  { name: "Instagram", href: null as string | null, comingSoon: true },
  { name: "YouTube", href: null as string | null, comingSoon: true },
  { name: "TikTok", href: null as string | null, comingSoon: true },
] as const;

export const exploreCards = [
  {
    href: "/gaming",
    title: "Gaming",
    description:
      "Retro cabinets, console brackets, tabletop nights, and free play all weekend.",
    accent: "cyan",
    icon: "gaming",
  },
  {
    href: "/cosplay",
    title: "Cosplay",
    description:
      "Contests, meetups, photos, and a floor that celebrates getting into character.",
    accent: "magenta",
    icon: "cosplay",
  },
  {
    href: "/gaming#tcg",
    title: "TCGs",
    description:
      "Shuffle up, trade, and compete. Tables, brackets, and casual play.",
    accent: "gold",
    icon: "tcg",
  },
  {
    href: "/vendors",
    title: "Vendors & Artists",
    description:
      "Artist alley, collectibles, handmade work, and a vendor hall worth walking twice.",
    accent: "lime",
    icon: "vendors",
  },
  {
    href: "/guests",
    title: "Special Guests",
    description:
      "Creators, talent, and community names — announcements drop here first.",
    accent: "magenta",
    icon: "guests",
  },
  {
    href: "/schedule",
    title: "Panels & Events",
    description:
      "Stages, screens, tournaments, and a schedule built for a full weekend.",
    accent: "cyan",
    icon: "panels",
  },
] as const;

export const guestPlaceholders = [
  {
    id: "guest-01",
    name: "Guest TBA",
    role: "Special Guest",
    note: "Announcement coming soon",
    accent: "magenta",
  },
  {
    id: "guest-02",
    name: "Guest TBA",
    role: "Creator / Talent",
    note: "Announcement coming soon",
    accent: "cyan",
  },
  {
    id: "guest-03",
    name: "Guest TBA",
    role: "Industry Guest",
    note: "Announcement coming soon",
    accent: "gold",
  },
] as const;

export const gamingPillars = [
  {
    title: "Retro Gaming",
    slug: "retro-gaming",
    href: "/gaming#retro-gaming",
    description: "Classic hardware, cabinets, and the games that started it.",
  },
  {
    title: "Console Tournaments",
    slug: "console-tournaments",
    href: "/gaming#console-tournaments",
    description: "Brackets, side events, and a crowd that actually watches.",
  },
  {
    title: "Tabletop Gaming",
    slug: "tabletop",
    href: "/gaming#tabletop",
    description: "Open tables, library games, and space to sit down and play.",
  },
  {
    title: "Trading Card Games",
    slug: "tcg",
    href: "/gaming#tcg",
    description: "Casual trades, constructed events, and sealed when we can.",
  },
  {
    title: "Free Play",
    slug: "free-play",
    href: "/gaming#free-play",
    description: "Grab a controller. No signup required. Stay as long as you want.",
  },
] as const;

export const tickerItems = [
  "Video Games",
  "Retro Gaming",
  "Tabletop",
  "Trading Card Games",
  "Cosplay",
  "Artists",
  "Vendors",
  "Collectibles",
  "Special Guests",
  "Creators",
  "Tournaments",
  "Panels",
  "Community",
] as const;

export const footerSecondaryLinks = [
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/press", label: "Press" },
] as const;

export const footerUtilityLinks = [
  { href: "/tickets", label: "Tickets" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
] as const;

export const faqs = [
  {
    question: "When is Midwest Pixel Fest?",
    answer:
      "The inaugural Midwest Pixel Fest is planned for 2027 in Emporia, Kansas. Official dates will be announced on this site and through the email list as soon as they are locked.",
  },
  {
    question: "Where is Midwest Pixel Fest?",
    answer:
      "Midwest Pixel Fest is based in Emporia, Kansas. The exact venue will be published with the official date announcement so attendees, vendors, and hotels can plan with confidence.",
  },
  {
    question: "Are tickets available?",
    answer:
      "Not yet. Badge types, pricing, and on-sale dates will be posted on the Tickets page. Join the list so you hear about it when sales open.",
  },
  {
    question: "Is Midwest Pixel Fest family-friendly?",
    answer:
      "The convention is being built as an all-ages pop culture weekend. Specific policies for children, strollers, and any after-dark programming will be published with the full event guide.",
  },
  {
    question: "Will there be gaming tournaments?",
    answer:
      "Competitive programming is planned, including console brackets and other events as partners lock in. Official formats, game lists, and signup rules will be posted on the Gaming and Schedule pages once finalized.",
  },
  {
    question: "Will there be trading card events?",
    answer:
      "Trading card space is part of the floor plan. Planned areas may include communities such as Pokémon, Magic: The Gathering, One Piece, and other supported TCG groups. Exact games, vendors, and event types will be announced when they are confirmed.",
  },
  {
    question: "Is there a cosplay contest?",
    answer:
      "Yes. A cosplay contest is planned, along with meetups and photo-friendly space. Rules, divisions, judging, registration, and prizes will be posted on the Cosplay page before the event.",
  },
  {
    question: "Can I apply as a vendor?",
    answer:
      "Not yet. Official vendor applications are not open. You can register vendor interest on the Vendors page so we can notify you when the application window exists. That form is not an application, and it is not a booth offer.",
  },
  {
    question: "Can I apply as an artist?",
    answer:
      "Artist alley applications are not open yet. When they are, they will live on the Vendors page next to vendor hall applications.",
  },
  {
    question: "Can I become a sponsor?",
    answer:
      "Sponsorship packages are in progress. Categories are outlined on the Sponsors page. Use the sponsor inquiry form to introduce your organization. Submitting that form does not create a sponsorship agreement, and dollar amounts are not published yet.",
  },
  {
    question: "Can I volunteer?",
    answer:
      "Official volunteer applications are not open yet. You can register interest on the Volunteer page. That is not a shift assignment, and selection is not guaranteed. Final requirements — including any guardian notes for minors — will be published before official applications open.",
  },
  {
    question: "How do guest announcements work?",
    answer:
      "Confirmed guests will be posted on the Guests page and in News. Until a name is published there, it is not official. Appearance schedules will follow once the programming grid is built.",
  },
  {
    question: "Where should I stay?",
    answer:
      "Official hotel partners and room blocks are not live yet. They will be listed on the Travel page after the venue and dates are confirmed. We are not endorsing specific hotels until those partnerships exist.",
  },
  {
    question: "Is parking available?",
    answer:
      "Venue-specific parking, lots, and any shuttle notes will be posted on the Travel page after the venue is confirmed.",
  },
  {
    question: "Are refunds available?",
    answer:
      "A ticket refund and transfer policy will be published with badge sales. There is no policy to cite yet because tickets are not on sale.",
  },
  {
    question: "Can I bring cosplay props?",
    answer:
      "Props will likely be inspected, and functional weapons will not be allowed. Full prop and replica rules depend on the venue and will be posted on the Cosplay page. Until then, plan on peace-bonded, non-functional props and respect for other attendees.",
  },
  {
    question: "Will there be food?",
    answer:
      "Food options depend on the venue and any on-site or nearby partners. Details will be added to Travel and the event guide once the building is confirmed.",
  },
  {
    question: "Is the event accessible?",
    answer:
      "Accessibility information — including entry, seating, and service details we can commit to — will be published after the venue is confirmed. If you have a question before that, use the update list so you are notified when the guide goes live.",
  },
  {
    question: "Who is organizing the event?",
    answer:
      "Midwest Pixel Fest is presented by PixelNation, building a regional convention for the Midwest gaming, cosplay, and collectibles community.",
  },
  {
    question: "How do I get to Emporia?",
    answer:
      "Emporia sits on the I-35 corridor and is a meeting point for Kansas City, Wichita, Topeka, Lawrence, Manhattan, and surrounding Midwest communities. Most attendees will drive. Airport, parking, and hotel details live on the Travel page as they are confirmed.",
  },
] as const;
