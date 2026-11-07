import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";
import { plannedVenue, site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Attendee Services & Accessibility | Midwest Pixel Fest 2027",
  description: "Plan for mobility access, sensory needs, family services, service animals, seating and accommodation requests at Midwest Pixel Fest 2027.",
  path: "/attendee-services",
});

const topics = [
  {
    id: "mobility",
    number: "01",
    eyebrow: "Getting around",
    title: "Mobility & accessible entry",
    body: [
      "Wheelchairs, scooters, walkers, canes and other mobility aids are welcome. We're coordinating with the venue to identify accessible entry, drop-off, parking, elevators, restrooms and routes for the event.",
      "The exact 2027 event entrances, accessible parking locations and floor plan are not finalized. We will publish verified directions before the convention.",
    ],
  },
  {
    id: "seating",
    number: "02",
    eyebrow: "Every seat matters",
    title: "Seating & event participation",
    body: [
      "We want guests to be able to enjoy panels, gaming, vendor areas and other activities with the support they need. Accessible seating and companion-space arrangements will be confirmed with the final room layout.",
      "If you need a particular seating, viewing or activity arrangement, contact us early to discuss options. No priority entry or special seating service has been announced yet.",
    ],
  },
  {
    id: "sensory",
    number: "03",
    eyebrow: "Take your time",
    title: "Sensory needs & breaks",
    body: [
      "Conventions may involve bright screens, crowds, music, public-address announcements and game audio. Bring personal sensory supports, such as ear protection, if they help you feel comfortable.",
      "We are exploring suitable break areas with the venue. A dedicated quiet or sensory room is not confirmed and should not be assumed available.",
    ],
  },
  {
    id: "communication",
    number: "04",
    eyebrow: "Stay connected",
    title: "Hearing, vision & communication",
    body: [
      "Let us know if you need communication-related assistance to follow a panel, find your way around, read event information or participate in an activity.",
      "Specific services such as ASL interpreting, live captions, assisted-listening systems or audio descriptions have not yet been confirmed. Early requests give us time to investigate possible arrangements.",
    ],
  },
  {
    id: "families",
    number: "05",
    eyebrow: "Bring the whole party",
    title: "Families & care needs",
    body: [
      "Our convention is being planned as an all-ages weekend. Children 12 and under receive free admission when accompanied by a paid adult, subject to published ticket conditions.",
      "The locations of family restrooms, diaper-changing stations, nursing or lactation spaces, stroller storage and any dedicated family area are pending venue confirmation. Plan breaks and keep your group together.",
    ],
  },
];

const known = [
  "Midwest Pixel Fest is planned for October 16–17, 2027, in Emporia, Kansas.",
  "Webb Hall inside the ESU Memorial Union is the selected venue; the signed agreement is still pending.",
  "Attendee accessibility requests can be sent to our official email and Contact page.",
  "We will follow applicable disability-access laws, including service-animal requirements.",
];

const pending = [
  "Signed venue agreement, final room map and entrance plan",
  "Accessible parking, drop-off points, travel routes and restroom locations",
  "Accessible seating and companion seating for programmed activities",
  "Nursing, changing and family services at the event",
  "Any dedicated quiet space or sensory supports",
  "Special communication services and on-site attendee assistance",
];

const questions = [
  {
    q: "Do I need to provide a diagnosis when requesting an accommodation?",
    a: "No. Tell us what you need to attend or participate and how we can reach you. Please don't send medical records or unnecessary private health details in the general Contact form.",
  },
  {
    q: "Is a quiet room available?",
    a: "A dedicated quiet or sensory room has not been confirmed. We're checking available options and will update this page once an arrangement is finalized.",
  },
  {
    q: "Are service animals permitted?",
    a: "We will comply with applicable disability-access laws. The ADA generally permits trained service dogs with their handlers in public areas and does not require a vest or certification.",
  },
  {
    q: "Where is accessible parking and check-in?",
    a: "The exact accessible parking, drop-off, entrance and check-in plans have not been finalized. We will share verified routes after the venue booking and event layout are confirmed.",
  },
  {
    q: "Will captioning or interpretation be provided?",
    a: "Specific captioning, interpretation and assisted-listening services are not confirmed. Contact us as early as possible to discuss your needs and possible arrangements.",
  },
];

export default function AttendeeServicesPage() {
  const emailHref = `mailto:${site.contactEmail}?subject=${encodeURIComponent("Midwest Pixel Fest - Accessibility Request")}`;

  return (
    <InnerPage
      path="/attendee-services"
      breadcrumbLabel="Attendee Services"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Info", path: "/info" },
        { name: "Attendee Services & Accessibility", path: "/attendee-services" },
      ]}
      eyebrow="Info / Everyone belongs"
      title="Attendee Services & Accessibility"
      intro="We want every visitor to feel welcome and informed. Here's what we're planning, what's still being confirmed, and how to ask for assistance."
    >
      <div className="mb-10 border-l-4 border-gold bg-panel p-6 sm:p-8">
        <p className="font-pixel text-[11px] uppercase tracking-[.15em] text-gold">Important venue information</p>
        <h2 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">Arrangements are being finalized</h2>
        <p className="mt-3 leading-relaxed text-muted">
          {plannedVenue.name} at {plannedVenue.institution} ({plannedVenue.streetAddress}, Emporia)
          is our selected venue, but the venue agreement and deposit are still pending.
          Exact accessible entrances, parking, room layouts and attendee services cannot be
          confirmed until our event arrangements are complete.
        </p>
      </div>

      <div className="mb-12 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="flex flex-col border border-cyan/30 bg-[#101729] p-6 sm:p-8">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Request an accommodation</p>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">Tell us what would help.</h2>
          <p className="mt-4 flex-1 leading-relaxed text-muted">
            Email our team about the event activity or access you need help with.
            Include the day you plan to attend, if known, and your preferred way to communicate.
            You don't need to share a diagnosis or medical records. We can discuss what is possible
            and clearly identify any venue-dependent details.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={emailHref} className="inline-flex min-h-11 items-center justify-center bg-magenta px-5 py-3 font-display text-sm uppercase tracking-widest text-ink hover:bg-gold">
              Email an accessibility request
            </a>
            <Link href="/contact" className="inline-flex min-h-11 items-center justify-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-widest text-cyan hover:bg-cyan/10">
              Contact the team
            </Link>
          </div>
          <p className="mt-4 text-sm text-paper/75">{site.contactEmail}</p>
        </div>
        <div className="border border-line bg-panel p-6 sm:p-8">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Plan ahead</p>
          <h2 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">What to include</h2>
          <ul className="mt-5 space-y-4 text-muted">
            <li className="flex gap-3"><span className="shrink-0 text-cyan">◆</span>Which activity or part of the event you want to attend</li>
            <li className="flex gap-3"><span className="shrink-0 text-cyan">◆</span>The accommodation or assistance you're requesting</li>
            <li className="flex gap-3"><span className="shrink-0 text-cyan">◆</span>Your preferred contact method</li>
            <li className="flex gap-3"><span className="shrink-0 text-cyan">◆</span>Any timing needs for planning purposes</li>
          </ul>
        </div>
      </div>

      <nav aria-label="Accessibility page sections" className="mb-10 border border-line bg-ink-2 p-5">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Jump to a topic</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["#mobility", "Mobility"],
            ["#seating", "Seating"],
            ["#sensory", "Sensory"],
            ["#communication", "Communication"],
            ["#families", "Families"],
            ["#service-animals", "Service animals"],
            ["#status", "What's confirmed"],
            ["#questions", "FAQ"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="inline-flex min-h-11 items-center border border-paper/25 px-4 py-2 font-display text-xs uppercase tracking-wider text-paper hover:border-cyan hover:text-cyan">{label}</a>
          ))}
        </div>
      </nav>

      <div className="grid gap-5 md:grid-cols-2">
        {topics.map((topic) => (
          <section id={topic.id} key={topic.id} className="scroll-mt-28 border border-line border-t-4 border-t-cyan/60 bg-panel p-6">
            <p className="font-pixel text-[11px] uppercase tracking-[.14em] text-gold">{topic.number} / {topic.eyebrow}</p>
            <h2 className="mt-4 font-display text-2xl uppercase leading-tight tracking-wide text-paper sm:text-3xl">{topic.title}</h2>
            {topic.body.map((p) => <p key={p} className="mt-4 leading-relaxed text-muted">{p}</p>)}
          </section>
        ))}
      </div>

      <section id="service-animals" className="mt-10 scroll-mt-28 border border-cyan/30 bg-[#101729] p-6 sm:p-8">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Service animals</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">Access for working animals.</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Midwest Pixel Fest will follow applicable disability-access laws.
          Under the Americans with Disabilities Act, trained service dogs generally can accompany
          their handlers in public areas. Service dogs do not need certification, special IDs or vests.
          Emotional-support animals that provide comfort alone are not service animals under the
          federal ADA, although state and local laws may provide additional rights.
        </p>
        <p className="mt-4 text-sm text-muted">
          <a href="https://www.ada.gov/topics/service-animals/" target="_blank" rel="noopener noreferrer" className="text-cyan underline underline-offset-4 hover:text-gold">
            Read the U.S. Department of Justice guidance on service animals (opens in new tab)
          </a>
        </p>
      </section>

      <section id="status" className="mt-12 scroll-mt-28">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Planning transparency</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">What we know / what comes next</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="border border-cyan/30 bg-panel p-6">
            <h3 className="font-display text-2xl uppercase tracking-wide text-cyan">Current information</h3>
            <ul className="mt-4 space-y-3">
              {known.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-muted"><span aria-hidden="true" className="shrink-0 text-cyan">✓</span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="border border-gold/30 bg-panel p-6">
            <h3 className="font-display text-2xl uppercase tracking-wide text-gold">Awaiting confirmation</h3>
            <ul className="mt-4 space-y-3">
              {pending.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-muted"><span aria-hidden="true" className="shrink-0 text-gold">◇</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          ESU publishes general building information for the
          {" "}<a href="https://www.emporia.edu/student-life/mem-union-rec-center/memorial-union/" target="_blank" rel="noopener noreferrer" className="text-cyan underline underline-offset-4">Memorial Union</a>,
          but our specific 2027 event routes and services must be confirmed separately.
        </p>
      </section>

      <section id="questions" className="mt-12 scroll-mt-28">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Common questions</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Attendee services FAQ</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {questions.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg uppercase tracking-wide text-paper [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="shrink-0 text-2xl text-cyan transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-12 border border-line bg-ink-2 p-6">
        <h2 className="font-display text-2xl uppercase tracking-wide text-paper">Keep planning your visit</h2>
        <p className="mt-3 text-muted">More information about tickets, travel and visitor services is available in our event guides.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { href: "/first-timers-guide", label: "First-Timer's Guide" },
            { href: "/travel", label: "Hotels & Travel" },
            { href: "/info", label: "All Attendee Info" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center border border-cyan/40 px-4 py-3 font-display text-sm uppercase tracking-widest text-cyan hover:text-gold">{item.label}</Link>
          ))}
        </div>
      </div>
    </InnerPage>
  );
}
