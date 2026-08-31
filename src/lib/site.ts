export const site = {
  name: "Midwest Pixel Fest",
  shortName: "Pixel Fest",
  organizer: "PixelNation",
  location: "Emporia, Kansas",
  year: 2027,
  dateLabel: "2027 — Date To Be Announced",
  tagline: "Gaming • Cosplay • Collectibles • Community",
  description:
    "Midwest Pixel Fest brings gaming, cosplay, collectibles, creators, vendors and community together in Emporia, Kansas.",
} as const;

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
  { name: "Facebook", href: "#", comingSoon: true },
  { name: "Instagram", href: "#", comingSoon: true },
  { name: "YouTube", href: "#", comingSoon: true },
  { name: "TikTok", href: "#", comingSoon: true },
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
    description: "Classic hardware, cabinets, and the games that started it.",
  },
  {
    title: "Console Tournaments",
    description: "Brackets, side events, and a crowd that actually watches.",
  },
  {
    title: "Tabletop Gaming",
    description: "Open tables, library games, and space to sit down and play.",
  },
  {
    title: "Trading Card Games",
    description: "Casual trades, constructed events, and sealed when we can.",
  },
  {
    title: "Free Play",
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

export const faqs = [
  {
    question: "When is Midwest Pixel Fest?",
    answer:
      "The inaugural Midwest Pixel Fest is planned for 2027 in Emporia, Kansas. The official dates will be announced here and through our email list as soon as they are locked.",
  },
  {
    question: "Where will the convention be held?",
    answer:
      "Midwest Pixel Fest is based in Emporia, Kansas. Venue details will be published with the official date announcement so attendees, vendors, and hotels can plan with confidence.",
  },
  {
    question: "Are tickets on sale yet?",
    answer:
      "Not yet. Badge types, pricing, and on-sale dates will be posted on the tickets page. Join the list so you hear about it when sales open.",
  },
  {
    question: "Can I apply to be a vendor or artist?",
    answer:
      "Vendor and artist applications are coming soon. When they open, you will be able to apply from the Vendors page. Applications are not being accepted by email yet.",
  },
  {
    question: "Will there be a cosplay contest?",
    answer:
      "Yes. Cosplay is a core part of the weekend — contests, meetups, and photo opportunities are planned. Rules, categories, and registration will be posted on the Cosplay page.",
  },
  {
    question: "Is Midwest Pixel Fest family-friendly?",
    answer:
      "The convention is being built as an all-ages pop culture weekend. Specific policies for children, strollers, and after-dark programming will be published with the full event guide.",
  },
  {
    question: "Who is organizing the event?",
    answer:
      "Midwest Pixel Fest is presented by PixelNation, an organizer building a new regional convention for the Midwest gaming, cosplay, and collectibles community.",
  },
  {
    question: "How do I get to Emporia?",
    answer:
      "Emporia sits on the I-35 corridor between the Kansas City metro, Topeka, and Wichita. Most attendees will drive. Airport, hotel, and parking details will live on the Travel page.",
  },
] as const;
