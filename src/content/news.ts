export type NewsSection = {
  heading?: string;
  paragraphs: string[];
};

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  image?: string;
  seoTitle: string;
  seoDescription: string;
  related: Array<{ href: string; label: string }>;
  body: NewsSection[];
};

export const newsArticles: NewsArticle[] = [
  {
    slug: "webb-hall-selected-as-planned-venue",
    title: "Webb Hall at Emporia State University Selected for Midwest Pixel Fest 2027",
    excerpt:
      "We've selected Webb Hall in ESU's Memorial Union as our planned home for October 16–17, 2027. Reservation is pending the final agreement and deposit.",
    publishedAt: "2026-11-06",
    category: "Venue update",
    seoTitle: "Webb Hall Selected as Planned Midwest Pixel Fest 2027 Venue",
    seoDescription:
      "Midwest Pixel Fest 2027 has selected Webb Hall in Emporia State University's Memorial Union as its planned venue for October 16–17, 2027. Reservation pending.",
    related: [
      { href: "/travel", label: "Plan Your Visit" },
      { href: "/vendors", label: "Vendor Interest" },
      { href: "/sponsors", label: "Sponsorship Opportunities" },
      { href: "/tickets", label: "Admission Prices" },
    ],
    body: [
      {
        paragraphs: [
          "Midwest Pixel Fest is taking shape in Emporia, Kansas. Following our venue tour, we have selected Webb Hall at Emporia State University as the planned home of our inaugural convention on Saturday and Sunday, October 16–17, 2027.",
          "Webb Hall is inside the ESU Memorial Union at 1331 Market St., Emporia, KS 66801. Our venue reservation is pending a signed agreement and deposit, so this is a venue selection announcement — not a confirmation that the space has been booked.",
        ],
      },
      {
        heading: "Why Webb Hall?",
        paragraphs: [
          "The venue offers a large event hall and adjoining lobby space that would let us bring gaming, cosplay, indie creators, comic books, vendors, and panels together in one place.",
          "During our tour, the venue team outlined tables, large displays, security, signage, setup support, food service, and a possible panel stage. Final amenities, room layout, capacity, and arrangements are subject to the venue contract and required approvals.",
        ],
      },
      {
        heading: "What happens next",
        paragraphs: [
          "We're working toward finalizing the reservation. Ticket prices are published, but online ticket sales remain on hold while the venue agreement is pending. Vendor interest and sponsorship inquiries remain open.",
          "We will publish an official booking confirmation and event-specific parking, access, and arrival details once the venue agreement is completed.",
        ],
      },
    ],
  },

  {
    slug: "midwest-pixel-fest-2027-dates-announced",
    title: "Midwest Pixel Fest 2027 Dates Announced: October 16–17",
    excerpt:
      "Midwest Pixel Fest will be Saturday, October 16 and Sunday, October 17, 2027 in Emporia, Kansas. Venue details will follow.",
    publishedAt: "2026-08-31",
    updatedAt: "2026-09-01",
    category: "Announcement",
    seoTitle: "Midwest Pixel Fest 2027 Dates Announced: October 16–17",
    seoDescription:
      "Midwest Pixel Fest 2027 is October 16–17 in Emporia, Kansas. Venue announcement coming later. Tickets, gaming, cosplay, and vendor details continue to roll out.",
    related: [
      { href: "/tickets", label: "Tickets" },
      { href: "/travel", label: "Travel" },
      { href: "/schedule", label: "Schedule" },
      { href: "/faq", label: "FAQ" },
    ],
    body: [
      {
        paragraphs: [
          "Midwest Pixel Fest 2027 will take place Saturday, October 16 and Sunday, October 17, 2027 in Emporia, Kansas.",
          "Public opening is currently planned for Saturday at 10:00 AM, with Sunday currently planned through 5:00 PM. Those hours can still shift with the venue.",
        ],
      },
      {
        heading: "Venue comes next",
        paragraphs: [
          "Update (November 2026): We have selected Webb Hall inside ESU Memorial Union as our planned venue, with the reservation pending a signed agreement and deposit. See our newest venue update for details.",
        ],
      },
      {
        heading: "What rolls out from here",
        paragraphs: [
          "Ticket prices are posted on the Tickets page. Sales are currently on hold pending a finalized venue agreement. Gaming, cosplay, collectibles, creators, vendors, and community programming continue to take shape for the weekend.",
          "Join the update list so you hear about the venue, guests, and application windows in one place.",
        ],
      },
    ],
  },
  {
    slug: "midwest-pixel-fest-coming-to-emporia-kansas-2027",
    title: "Midwest Pixel Fest Is Coming to Emporia, Kansas in 2027",
    excerpt:
      "A new regional convention for gaming, cosplay, collectibles, and community is being built in Emporia for October 16–17, 2027.",
    publishedAt: "2026-08-31",
    updatedAt: "2026-08-31",
    category: "Announcement",
    seoTitle: "Midwest Pixel Fest Coming to Emporia, Kansas in 2027",
    seoDescription:
      "Midwest Pixel Fest is a gaming, cosplay, and pop culture convention in Emporia, Kansas on October 16–17, 2027. Venue details will be announced here first.",
    related: [
      { href: "/about", label: "About" },
      { href: "/travel", label: "Travel" },
      { href: "/gaming", label: "Gaming" },
      { href: "/faq", label: "FAQ" },
    ],
    body: [
      {
        paragraphs: [
          "Midwest Pixel Fest is a new regional convention being built in Emporia, Kansas for October 16–17, 2027. The weekend is meant for people who play games, wear costumes, hunt collectibles, sell their work, and show up for a packed convention floor.",
          "This is the official site for tickets, guests, vendor applications, and travel information. Update (November 2026): Webb Hall at ESU has been selected as our planned venue; final reservation is still pending.",
        ],
      },
      {
        heading: "What we can say now",
        paragraphs: [
          "The inaugural weekend is October 16–17, 2027 in Emporia. The event is organized independently as Midwest Pixel Fest. Update (November 2026): Webb Hall at ESU is the selected venue, with the booking still pending.",
          "If you are planning a trip from Kansas City, Wichita, Topeka, Lawrence, Manhattan, or farther into the Midwest, bookmark the Travel page. Hotel blocks and parking notes will land there after the venue is public.",
        ],
      },
      {
        heading: "What happens next",
        paragraphs: [
          "Ticket prices are posted, but checkout is on hold while venue arrangements are finalized. Guest names and application windows will be posted on this News page and on the matching topic pages. Join the update list for venue, guests, and vendor news.",
        ],
      },
    ],
  },
  {
    slug: "what-to-expect-at-midwest-pixel-fest",
    title: "What to Expect at Midwest Pixel Fest",
    excerpt:
      "A look at the floor we are building: gaming, cosplay, vendors, creators, panels, and a weekend that is supposed to be played, not just walked.",
    publishedAt: "2026-08-25",
    category: "Guide",
    seoTitle: "What to Expect at Midwest Pixel Fest | Gaming, Cosplay & More",
    seoDescription:
      "What Midwest Pixel Fest is planning for 2027 in Emporia, Kansas: retro and console gaming, TCGs, tabletop, cosplay, vendors, guests, and panels.",
    related: [
      { href: "/gaming", label: "Gaming" },
      { href: "/cosplay", label: "Cosplay" },
      { href: "/vendors", label: "Vendors" },
      { href: "/guests", label: "Guests" },
      { href: "/schedule", label: "Schedule" },
    ],
    body: [
      {
        paragraphs: [
          "Midwest Pixel Fest is being designed as a play-first pop culture weekend. That means dedicated space for games, costumes, makers, and people who just want to walk the floor.",
          "Official event lists, game titles, and hour-by-hour programming will publish with the schedule. What follows is the shape of the convention — not a locked menu of titles or guests.",
        ],
      },
      {
        heading: "Games on the floor",
        paragraphs: [
          "Gaming is a core pillar. Planned areas include retro hardware and arcade-style play, console free play and competitive brackets, tabletop tables, and trading card space. Specific titles and tournament formats will be posted once they are confirmed.",
          "If you want the latest on brackets and free play, use the Gaming page. It will grow as partners and game lists are announced.",
        ],
      },
      {
        heading: "Cosplay, vendors, and the rest of the weekend",
        paragraphs: [
          "A cosplay contest is planned, along with meetups and photo-friendly space. Rules, divisions, and registration will be published on the Cosplay page.",
          "Vendor hall and artist alley applications are not open yet. Register interest on the Vendors page. Guest names will appear on the Guests page — no placeholders dressed up as confirmations.",
        ],
      },
    ],
  },
  {
    slug: "vendor-sponsor-and-guest-announcements-are-coming",
    title: "Vendor, Sponsor and Guest Announcements Are Coming",
    excerpt:
      "Applications are not open yet. Guest names are not public yet. Here is where those announcements will live when they are real.",
    publishedAt: "2026-08-18",
    category: "Planning",
    seoTitle: "Vendor, Sponsor & Guest Announcements | Midwest Pixel Fest",
    seoDescription:
      "Midwest Pixel Fest vendor applications, sponsor packages, and guest announcements are not live yet. This is where they will be posted for the Emporia, Kansas convention.",
    related: [
      { href: "/vendors", label: "Vendors" },
      { href: "/sponsors", label: "Sponsors" },
      { href: "/guests", label: "Guests" },
      { href: "/press", label: "Press" },
    ],
    body: [
      {
        paragraphs: [
          "If you want a table, a partnership, or a name on the guest list, the honest status is the same: nothing is open for applications or confirmations yet.",
          "That is intentional. We would rather publish a real window than collect forms we cannot answer.",
        ],
      },
      {
        heading: "Vendors and artists",
        paragraphs: [
          "Vendor hall and artist alley applications will open on the Vendors page. Rates, booth sizes, power, load-in, and deadlines will be included with the form — not guessed in advance.",
          "Until that form is live, register vendor interest on the Vendors page. That is not an application.",
        ],
      },
      {
        heading: "Sponsors and guests",
        paragraphs: [
          "Sponsorship categories are outlined on the Sponsors page. Packages, pricing, and a prospectus will follow. Guest announcements will be posted on the Guests page and in News, with appearance details when we have them.",
          "If you are press or a creator covering the show, the Press page is where credentials and assets will be posted. Those processes are not open yet either.",
        ],
      },
    ],
  },
];

export function getAllNews(): NewsArticle[] {
  return [...newsArticles].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
  );
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug);
}

export function getLatestNews(count = 3): NewsArticle[] {
  return getAllNews().slice(0, count);
}

export function formatNewsDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Chicago",
  }).format(new Date(year, month - 1, day));
}
