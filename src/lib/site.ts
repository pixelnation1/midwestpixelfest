import { parseAllowedHttpUrl } from "@/lib/safe-url";

const PRODUCTION_SITE_URL = "https://midwestpixelfest.com";

function resolveSiteUrl(): string {
  const parsed = parseAllowedHttpUrl(process.env.NEXT_PUBLIC_SITE_URL);
  return parsed ? parsed.origin : PRODUCTION_SITE_URL;
}

export const siteUrl = resolveSiteUrl();

export type Venue = {
  name: string;
  streetAddress: string | null;
  addressLocality: string;
  addressRegion: string;
  postalCode: string | null;
  addressCountry: "US";
};

/**
 * Confirmed public event facts.
 *
 * venue: still TBA — do not invent a building name or street address.
 * ticketUrl: official public Ticketleap checkout. All ticket CTAs read this
 * value through src/lib/tickets.ts. Leave null only to take checkout offline.
 */
export const event = {
  status: "scheduled" as const,
  year: 2027,
  name: "Midwest Pixel Fest 2027",
  startDate: "2027-10-16T10:00:00-05:00",
  endDate: "2027-10-17T17:00:00-05:00",
  doorsLabel: "Saturday at 10:00 AM",
  closeLabel: "Sunday at 5:00 PM",
  venue: null as Venue | null,
  ticketUrl:
    "https://events.ticketleap.com/tickets/midwestpixelfest/midwest-pixel-fest-2027",
};

export const organizer = {
  name: "PixelNation",
  url: "https://pixelnation.co",
} as const;

export const ticketProducts = [
  {
    id: "weekend",
    name: "Weekend General Admission",
    price: 30,
    priceLabel: "$30",
    description: "Saturday + Sunday",
  },
  {
    id: "saturday",
    name: "Saturday General Admission",
    price: 20,
    priceLabel: "$20",
    description: "Saturday only",
  },
  {
    id: "sunday",
    name: "Sunday General Admission",
    price: 15,
    priceLabel: "$15",
    description: "Sunday only",
  },
  {
    id: "kids",
    name: "Kids 12 & Under",
    price: 0,
    priceLabel: "Free",
    description: "With a paid adult",
  },
] as const;

export const site = {
  name: "Midwest Pixel Fest",
  shortName: "Pixel Fest",
  organizer: organizer.name,
  organizerUrl: organizer.url,
  location: "Emporia, Kansas",
  city: "Emporia",
  region: "Kansas",
  regionCode: "KS",
  country: "US",
  year: event.year,
  dateLabel: "October 16–17, 2027",
  dateLongLabel: "Saturday, October 16 – Sunday, October 17, 2027",
  venueLabel: "Emporia, Kansas — venue announcement coming",
  tagline: "Gaming • Cosplay • Collectibles • Community",
  description:
    "Midwest Pixel Fest is a gaming, cosplay, collectibles, and pop-culture convention in Emporia, Kansas on October 16–17, 2027.",
  defaultTitle:
    "Midwest Pixel Fest 2027 | Gaming, Cosplay & Pop Culture Convention in Kansas",
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

/** Event schema can render with city-level location until a venue is named. */
export function isEventSchemaReady(value = event): boolean {
  return Boolean(value.startDate && value.endDate);
}

/** Attendee-facing desktop nav. Tickets is a separate CTA. Home is the logo. */
export const navItems = [
  { href: "/#explore", label: "Explore" },
  { href: "/gaming", label: "Gaming" },
  { href: "/cosplay", label: "Cosplay" },
  { href: "/guests", label: "Guests" },
  { href: "/vendors", label: "Vendors" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/schedule", label: "Schedule" },
  { href: "/travel", label: "Travel" },
] as const;

export const mobileMoreLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/press", label: "Press" },
  { href: "/contact", label: "Contact" },
] as const;

export const socialLinks = [
  { name: "Facebook", href: null as string | null },
  { name: "Instagram", href: null as string | null },
  { name: "YouTube", href: null as string | null },
  { name: "TikTok", href: null as string | null },
] as const;

export function getPublishedSocialLinks() {
  return socialLinks.filter(
    (item): item is typeof item & { href: string } => Boolean(item.href),
  );
}

export const footerGroups = [
  {
    heading: "Event",
    links: [
      { href: "/tickets", label: "Tickets" },
      { href: "/schedule", label: "Schedule" },
      { href: "/guests", label: "Guests" },
      { href: "/gaming", label: "Gaming" },
      { href: "/cosplay", label: "Cosplay" },
    ],
  },
  {
    heading: "Get involved",
    links: [
      { href: "/vendors", label: "Vendors" },
      { href: "/sponsors", label: "Sponsors" },
      { href: "/sponsors/inquiry", label: "Become a Sponsor" },
      { href: "/volunteer", label: "Volunteer" },
      { href: "/guests/inquiry", label: "Guest Inquiry" },
      { href: "/press", label: "Press" },
    ],
  },
  {
    heading: "Plan",
    links: [
      { href: "/travel", label: "Travel" },
      { href: "/faq", label: "FAQ" },
      { href: "/news", label: "News" },
      { href: "/contact", label: "Contact" },
      { href: "/about", label: "About" },
    ],
  },
] as const;

export const footerLegalLinks = [{ href: "/privacy", label: "Privacy" }] as const;

export const exploreCards = [
  {
    href: "/gaming#retro-gaming",
    title: "Retro Gaming",
    description:
      "Classic hardware and the games that started it — cabinets and consoles as they are confirmed.",
    accent: "magenta" as const,
    icon: "retro" as const,
  },
  {
    href: "/gaming#tcg",
    title: "TCGs",
    description:
      "Shuffle up, trade, and play. Tables and organized events as they are confirmed.",
    accent: "gold" as const,
    icon: "tcg" as const,
  },
  {
    href: "/gaming#tabletop",
    title: "Tabletop Gaming",
    description:
      "Board games, RPGs, and open tables. Library and demo details post with the schedule.",
    accent: "cyan" as const,
    icon: "tabletop" as const,
  },
  {
    href: "/cosplay",
    title: "Cosplay",
    description:
      "A contest is planned, plus meetups and a floor that treats costumes as part of the show.",
    accent: "magenta" as const,
    icon: "cosplay" as const,
  },
  {
    href: "/vendors",
    title: "Vendors & Collectibles",
    description:
      "Artist alley, collectibles, handmade work, and a vendor hall worth walking twice.",
    accent: "lime" as const,
    icon: "vendors" as const,
  },
  {
    href: "/guests",
    title: "Guests & Creators",
    description:
      "Creators, talent, and community names — announcements drop here first.",
    accent: "cyan" as const,
    icon: "guests" as const,
  },
] as const;

export const gamingPillars = [
  {
    title: "Retro Gaming",
    slug: "retro-gaming",
    href: "/gaming#retro-gaming",
    icon: "cabinet" as const,
    tone: "magenta" as const,
    description: "Classic hardware, cabinets, and the games that started it.",
  },
  {
    title: "Video Gaming",
    slug: "console-gaming",
    href: "/gaming#console-gaming",
    icon: "joystick" as const,
    tone: "cyan" as const,
    description: "Modern and classic console play — free play, multiplayer, and brackets as they lock in.",
  },
  {
    title: "Trading Card Games",
    slug: "tcg",
    href: "/gaming#tcg",
    icon: "cards" as const,
    tone: "gold" as const,
    description: "Casual trades, constructed events, and community tables as they are confirmed.",
  },
  {
    title: "Tabletop",
    slug: "tabletop",
    href: "/gaming#tabletop",
    icon: "dice" as const,
    tone: "lime" as const,
    description: "Open tables, library games, and space to sit down and play.",
  },
  {
    title: "Tournaments / Organized Play",
    slug: "tournaments",
    href: "/gaming#tournaments",
    icon: "trophy" as const,
    tone: "magenta" as const,
    description: "Competitive formats and signup rules will be posted once they are final.",
  },
  {
    title: "Free Play",
    slug: "free-play",
    href: "/gaming#free-play",
    icon: "freeplay" as const,
    tone: "cyan" as const,
    description: "Grab a controller. No signup required. Stay as long as you want.",
  },
] as const;

export const vendorBrowseCategories = [
  { title: "Games", icon: "joystick" as const },
  { title: "Cards", icon: "cards" as const },
  { title: "Collectibles", icon: "star" as const },
  { title: "Art", icon: "mask" as const },
  { title: "Apparel", icon: "booth" as const },
  { title: "Makers", icon: "cartridge" as const },
  { title: "Pop culture merchandise", icon: "cabinet" as const },
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

function ticketPriceLine() {
  return ticketProducts
    .map((item) => `${item.name} ${item.priceLabel}`)
    .join(". ");
}

export function getFaqs() {
  const ticketsLive = Boolean(event.ticketUrl);

  return [
    {
      question: "When is Midwest Pixel Fest 2027?",
      answer:
        "Midwest Pixel Fest 2027 is Saturday, October 16 and Sunday, October 17, 2027 in Emporia, Kansas. Public opening is currently planned for Saturday at 10:00 AM, with Sunday currently planned through 5:00 PM.",
    },
    {
      question: "Where is Midwest Pixel Fest?",
      answer:
        "Midwest Pixel Fest is in Emporia, Kansas. The exact venue will be announced.",
    },
    {
      question: "How much are tickets?",
      answer: `${ticketPriceLine()}. Ticketleap service and transaction fees may apply at checkout. Ticket availability and event capacity are subject to venue limits.`,
    },
    {
      question: "Are tickets available yet?",
      answer: ticketsLive
        ? "Yes. Get tickets from the Tickets page. Checkout opens in a new tab on Ticketleap."
        : "Ticket types and prices are posted on the Tickets page. Online checkout is being finalized. Join the update list so you hear when purchase goes live.",
    },
    {
      question: "Is Midwest Pixel Fest family-friendly?",
      answer:
        "The convention is being built as an all-ages pop culture weekend. Kids 12 and under are free with a paid adult. Specific policies for strollers, quiet space, and any after-dark programming will be published with the full event guide.",
    },
    {
      question: "Will there be gaming?",
      answer:
        "Yes. Gaming is a core event area, including video games, retro play, tabletop, trading card games, organized play, and casual community play. Specific schedules, titles, and tournament formats will be announced on the Gaming and Schedule pages.",
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
      question: "Will there be cosplay?",
      answer:
        "Yes. Cosplay is a core event area. A contest and community meetups are planned. Rules, divisions, judging, registration, and prizes will be posted on the Cosplay page before the event.",
    },
    {
      question: "Is there a cosplay contest?",
      answer:
        "Yes. A cosplay contest is planned, along with meetups and photo-friendly space. Rules, divisions, judging, registration, and prizes will be posted on the Cosplay page before the event.",
    },
    {
      question: "Can I become a vendor?",
      answer:
        "Official vendor applications are not open. Register vendor interest on the Vendors page so we can notify you when the application window exists. That form is not an application, and it is not a booth offer.",
    },
    {
      question: "Can I apply as an artist?",
      answer:
        "Artist alley applications are not open yet. Register interest on the Vendors page. When official applications open, they will live there next to vendor hall applications.",
    },
    {
      question: "Can my business sponsor?",
      answer:
        "Yes. Official levels are Community Sponsor ($250), Bronze ($500), Silver ($1,000), Gold ($2,500), Presenting Sponsor ($5,000+), and custom / event sponsorship. Start with the inquiry on the Sponsors page. That form does not create a sponsorship agreement, reserve a level, or collect payment.",
    },
    {
      question: "Can I volunteer?",
      answer:
        "Official volunteer applications are not open yet. Register interest on the Volunteer page. That is not a shift assignment, and selection is not guaranteed. Final requirements — including any guardian notes for minors — will be published before official applications open.",
    },
    {
      question: "How can I become a guest?",
      answer:
        "Creators, streamers, artists, performers, and community personalities can send a guest inquiry. Submission does not guarantee an invitation. Confirmed guests will be posted on the Guests page and in News.",
    },
    {
      question: "How do guest announcements work?",
      answer:
        "Confirmed guests will be posted on the Guests page and in News. Until a name is published there, it is not official. Appearance schedules will follow once the programming grid is built.",
    },
    {
      question: "Where should I stay?",
      answer:
        "Official hotel partners and room blocks are not live yet. They will be listed on the Travel page after the venue is confirmed. We are not endorsing specific hotels until those partnerships exist.",
    },
    {
      question: "Is parking available?",
      answer:
        "Venue-specific parking, lots, and any shuttle notes will be posted on the Travel page after the venue is confirmed.",
    },
    {
      question: "Are refunds available?",
      answer:
        "Refund and transfer terms are shown during Ticketleap checkout. Midwest Pixel Fest will publish any additional ticket policy on the Tickets page if one is confirmed.",
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
        "Accessibility information — including entry, seating, and service details we can commit to — will be published after the venue is confirmed. If you have a question before that, use the Contact page or the update list.",
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
}

export const faqs = getFaqs();
