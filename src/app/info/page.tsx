import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Attendee Info | Midwest Pixel Fest 2027",
  description:
    "Everything you need to plan Midwest Pixel Fest 2027: first-timer's guide, weapons and props rules, FAQs, travel, accessibility updates and contact information.",
  path: "/info",
});

const topics = [
  {
    number: "01",
    title: "First-Timer's Guide",
    description: "New to conventions? Start here for tickets, what to bring, what to do, and how to enjoy your first Pixel Fest.",
    href: "/first-timers-guide",
    accent: "border-cyan/60",
    action: "Plan your visit",
  },
  {
    number: "02",
    title: "Weapons & Props Policy",
    description: "Understand our preliminary cosplay prop safety rules, prohibited items, and what happens as venue policies are finalized.",
    href: "/weapons-policy",
    accent: "border-magenta/60",
    action: "Read the policy",
  },
  {
    number: "03",
    title: "Frequently Asked Questions",
    description: "Answers about admission, gaming, kids, cosplay, vendors, and the things attendees ask most often.",
    href: "/faq",
    accent: "border-gold/60",
    action: "See the FAQ",
  },
  {
    number: "04",
    title: "Hotels, Parking & Travel",
    description: "How to get to Emporia, our selected venue, and travel details that will be announced after the reservation is signed.",
    href: "/travel",
    accent: "border-cyan/60",
    action: "Plan your trip",
  },
  {
    number: "05",
    title: "Cosplay Information",
    description: "Cosplay community, planned meetups and contest information, photography etiquette, and links to safety guidance.",
    href: "/cosplay",
    accent: "border-magenta/60",
    action: "Explore cosplay",
  },
  {
    number: "06",
    title: "Visit Emporia / Things to Do",
    description: "Explore downtown, local dining, games, family attractions, museums and parks beyond the convention.",
    href: "/visit-emporia",
    accent: "border-cyan/60",
    action: "Explore the city",
  },
  {
    number: "07",
    title: "Attendee Services & Accessibility",
    description: "Mobility routes, seating, sensory needs, family services, service animals and how to request accommodations.",
    href: "/attendee-services",
    accent: "border-cyan/60",
    action: "Plan for accessibility",
  },
  {
    number: "08",
    title: "Code of Conduct",
    description: "Our community rules for respectful participation, cosplay and photography consent, safe gaming, reporting and accountability.",
    href: "/code-of-conduct",
    accent: "border-magenta/60",
    action: "Read community standards",
  },
  {
    number: "09",
    title: "Panel Submissions",
    description: "Propose a workshop, talk, fan discussion, or community programming session for Midwest Pixel Fest 2027.",
    href: "/panels/submit",
    accent: "border-cyan/60",
    action: "Submit an idea",
  },
  {
    number: "10",
    title: "Cosplay Contest Registration",
    description: "Discover proposed contest divisions, judging guidelines, and apply to participate in the inaugural cosplay contest.",
    href: "/cosplay/contest",
    accent: "border-magenta/60",
    action: "Explore the contest",
  },
  {
    number: "11",
    title: "Exhibitor & Artist Directory",
    description: "Explore confirmed exhibitors, Artist Alley creators, shops and booth assignments as they're announced.",
    href: "/exhibitors",
    accent: "border-cyan/60",
    action: "Browse exhibitors",
  },
  {
    number: "12",
    title: "Convention Floor Map",
    description: "Find confirmed activity zones, exhibitor booths, entrances and attendee services once the approved layout is released.",
    href: "/floor-map",
    accent: "border-cyan/60",
    action: "Explore the map",
  },
  {
    number: "13",
    title: "Guest Autographs & Photo Opportunities",
    description: "Find official guest signing prices, selfie and photo-op options, schedules, and purchasing information when announced.",
    href: "/guests/autographs",
    accent: "border-gold/60",
    action: "Explore guest experiences",
  },
  {
    number: "14",
    title: "Invited Author Guest Program",
    description: "Explore a separate invited author track for readings, writing workshops, panels and signings beyond paid Artist Alley spaces.",
    href: "/guests/authors",
    accent: "border-magenta/60",
    action: "Discover invited authors",
  },
  {
    number: "15",
    title: "Tournament Registration & Brackets",
    description: "Find confirmed gaming tournaments, register players or teams, view rules, waitlists, check-in and results.",
    href: "/tournaments",
    accent: "border-cyan/60",
    action: "Explore tournaments",
  },
  {
    number: "16",
    title: "Contact the Team",
    description: "Questions about accessibility, attending with kids, props, tickets, or something else? Start here.",
    href: "/contact",
    accent: "border-gold/60",
    action: "Get in touch",
  },
  { number: "17", title: "Comic & TCG Card Grading", description: "Follow grading provider announcements for comics and trading cards, with submission guidance and collector FAQs. Providers and services to be announced.", href: "/grading-services", accent: "border-gold/60", action: "View grading updates" },
  { number: "18", title: "Hotels & Lodging", description: "Find Emporia lodging options and watch for official hotel partners, room blocks and event-rate announcements.", href: "/hotels", accent: "border-cyan/60", action: "Find a place to stay" },
];

export default function AttendeeInfoPage() {
  return (
    <InnerPage
      path="/info"
      breadcrumbLabel="Info"
      eyebrow="Plan your weekend"
      title="Attendee Information"
      intro="First convention or longtime fan, we're here to help you feel ready. Your guides, policies and planning resources live together in one place."
    >
      <div className="mb-8 border-l-4 border-gold bg-panel px-5 py-6">
        <p className="font-display text-lg uppercase tracking-wide text-gold">2027 venue status</p>
        <p className="mt-2 leading-relaxed text-muted">
          Midwest Pixel Fest is planned for October 16–17, 2027 in Emporia, Kansas. Webb Hall at Emporia State University
          is our selected venue, but the reservation and venue agreement are still pending. Details such as check-in,
          parking, security screening, and food options will be updated when confirmed.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className={`group flex h-full flex-col border border-line border-t-4 bg-panel p-6 transition-colors hover:border-cyan ${topic.accent}`}
          >
            <span className="font-pixel text-sm text-cyan">{topic.number} / INFO</span>
            <h2 className="mt-5 font-display text-2xl uppercase leading-tight tracking-wide text-paper">{topic.title}</h2>
            <p className="mt-4 flex-1 leading-relaxed text-muted">{topic.description}</p>
            <span className="mt-7 font-display text-sm uppercase tracking-widest text-gold group-hover:text-cyan">
              {topic.action} <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-12 border border-cyan/25 bg-ink-2 p-6">
        <p className="font-display text-xl uppercase tracking-wide text-paper">Looking for the weekend schedule?</p>
        <p className="mt-2 text-muted">Programming, guest appearances and activities will be listed as they're confirmed.</p>
        <Link href="/schedule" className="mt-4 inline-flex min-h-11 items-center font-display text-sm uppercase tracking-widest text-cyan underline underline-offset-4">
          View schedule updates
        </Link>
      </div>
    </InnerPage>
  );
}
