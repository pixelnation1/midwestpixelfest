export type NewsSection = {
  heading?: string;
  paragraphs: string[];
};

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  image?: string;
  seoTitle: string;
  seoDescription: string;
  related: Array<{ href: string; label: string }>;
  body: NewsSection[];
};

export const newsArticles: NewsArticle[] = [
  {
    slug: "midwest-pixel-fest-coming-to-emporia-kansas-2027",
    title: "Midwest Pixel Fest Is Coming to Emporia, Kansas in 2027",
    excerpt:
      "A new regional convention for gaming, cosplay, collectibles, and community is being built in Emporia — with dates still to be announced.",
    publishedAt: "2026-08-31",
    category: "Announcement",
    seoTitle: "Midwest Pixel Fest Coming to Emporia, Kansas in 2027",
    seoDescription:
      "Midwest Pixel Fest is a gaming, cosplay, and pop culture convention coming to Emporia, Kansas in 2027. Dates and venue will be announced here first.",
    related: [
      { href: "/about", label: "About" },
      { href: "/travel", label: "Travel" },
      { href: "/gaming", label: "Gaming" },
      { href: "/faq", label: "FAQ" },
    ],
    body: [
      {
        paragraphs: [
          "Midwest Pixel Fest is a new regional convention being built in Emporia, Kansas for 2027. The weekend is meant for people who play games, wear costumes, hunt collectibles, sell their work, and show up for a packed convention floor.",
          "This is the official site for dates, guests, tickets, vendor applications, and travel information. None of those are locked yet. When they are, they will be published here before they disappear into a social feed.",
        ],
      },
      {
        heading: "What we can say now",
        paragraphs: [
          "The inaugural year is 2027. The city is Emporia. The organizer is PixelNation. Exact dates and the venue will be announced once they are confirmed — not before.",
          "If you are planning a trip from Kansas City, Wichita, Topeka, Lawrence, Manhattan, or farther into the Midwest, bookmark the Travel page. Hotel blocks and parking notes will land there after the venue is public.",
        ],
      },
      {
        heading: "What happens next",
        paragraphs: [
          "Guest names, badge types, and application windows will be posted on this News page and on the matching topic pages. Until then, the most useful thing you can do is join the update list so you hear about the date drop, ticket on-sale, and vendor window in one place.",
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
          "A cosplay contest is planned, along with meetups and photo-friendly space. Rules, divisions, and registration will be published on the Cosplay page before badges go on sale.",
          "Vendor hall and artist alley applications are not open yet. When they are, the Vendors page is the official place to apply. Guest names will appear on the Guests page — no placeholders dressed up as confirmations.",
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
          "Until that form is live, there is no unofficial waitlist by email.",
        ],
      },
      {
        heading: "Sponsors and guests",
        paragraphs: [
          "Sponsorship categories are outlined on the Sponsors page. Packages, pricing, and a prospectus will follow. Guest announcements will be posted on the Guests page and in News, with appearance details when we have them.",
          "If you are press or a creator covering the show, the Press page is the placeholder for credentials and assets. Those processes are not open yet either.",
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
