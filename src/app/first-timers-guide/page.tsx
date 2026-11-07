import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { VisitChecklist } from "@/components/first-timers/VisitChecklist";
import { createPageMetadata } from "@/lib/seo";
import { site, plannedVenue, ticketProducts } from "@/lib/site";
import { isTicketSalesOpen } from "@/lib/tickets";

export const metadata: Metadata = createPageMetadata({
  title: "First-Timer's Guide | Midwest Pixel Fest 2027",
  description:
    "New to conventions? Plan your first Midwest Pixel Fest in Emporia, Kansas, October 16–17, 2027. Get the basics on tickets, arrival, cosplay, gaming, guests, families, and what to bring.",
  path: "/first-timers-guide",
});

const jumps = [
  { href: "#before-you-go", label: "Before you go" },
  { href: "#tickets", label: "Tickets & entry" },
  { href: "#arrival", label: "Getting there" },
  { href: "#what-to-do", label: "What to do" },
  { href: "#cosplay", label: "Cosplay" },
  { href: "#families", label: "Families & access" },
  { href: "#good-to-know", label: "Quick answers" },
];

const experiences = [
  { number: "01", title: "Grab a controller", description: "Explore our planned retro and modern gaming areas. Specific games, availability, and tournament signup details will be published with the schedule.", href: "/gaming", link: "Explore gaming" },
  { number: "02", title: "Shuffle up or roll dice", description: "Find tabletop fans, trade-card communities, and opportunities to meet people across the table. Individual events and entry requirements will be announced separately.", href: "/gaming#tabletop", link: "Tabletop & TCGs" },
  { number: "03", title: "Discover creators", description: "Browse the artists and vendors as our lineup is confirmed. Ask artists about their work, prints, and commissions; individual sellers set their own prices.", href: "/vendors", link: "Vendor hall" },
  { number: "04", title: "Meet the community", description: "Enjoy the cosplay, look for announced panels and guests, and make room for spontaneous conversations with people who love the same things you do.", href: "/guests", link: "Guest updates" },
];

const answers = [
  { q: "Do I have to wear a costume?", a: "No. Come as you are. Cosplay is welcome, not required. A comfortable outfit and shoes are a great choice for your first visit." },
  { q: "Can I bring my children?", a: "Yes. The event is being planned for all ages. Children 12 and under have free admission with a paid adult; check the Tickets page for any updates to admission terms. Children should remain with their responsible adult." },
  { q: "Are guest autographs, photos, and tournaments included?", a: "Not necessarily. Any special autograph, photo, tournament, or workshop pricing will be published with its official listing. Do not assume those activities are part of general admission." },
  { q: "Where will I park and check in?", a: "Exact entry doors, check-in procedures, parking lots, and any accessibility routes will be published after the venue agreement and event operating plan are finalized." },
  { q: "Can I bring a cosplay prop?", a: "Functional weapons are not allowed. Prop inspection and replica rules will be published with the final cosplay policy. Contact the organizers before bringing anything you are unsure about." },
  { q: "What if I need an accommodation or have a question?", a: "Please contact the Midwest Pixel Fest team in advance. We can help you plan around available information and will publish confirmed accessibility and attendee-service details as they are finalized." },
];

function StepHeading({ number, title, eyebrow }: { number: string; title: string; eyebrow?: string }) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-cyan/50 bg-cyan/10 font-pixel text-lg text-cyan">{number}</span>
      <div>
        {eyebrow ? <p className="font-pixel text-[11px] uppercase tracking-[.17em] text-gold">{eyebrow}</p> : null}
        <h2 className="mt-1 font-display text-3xl uppercase leading-tight tracking-wide text-paper sm:text-4xl">{title}</h2>
      </div>
    </div>
  );
}

function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="font-semibold text-cyan underline decoration-cyan/40 underline-offset-4 hover:text-gold">{children}</Link>;
}

export default function FirstTimersGuidePage() {
  const ticketsOpen = isTicketSalesOpen();

  return (
    <main>
      <header className="relative overflow-hidden border-b border-cyan/25 bg-[#090d22]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/retro-arcade-cabinets.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090d22] via-[#090d22]/90 to-[#090d22]/55" />
        </div>
        <div className="pointer-events-none absolute inset-0 pixel-grid opacity-30" aria-hidden="true" />
        <Container className="relative py-16 sm:py-24">
          <p className="font-pixel text-[11px] uppercase tracking-[.2em] text-cyan">New player? Welcome to the party.</p>
          <h1 className="mt-5 max-w-5xl font-display text-[clamp(3.2rem,9vw,7rem)] uppercase leading-[.9] tracking-wide text-paper">
            Your first <span className="text-gold">Pixel Fest</span> starts here.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85 sm:text-xl">
            Never been to a gaming or comic convention? You're exactly who this guide is for. From getting in the door to finding your people, here's how to make the most of your first Midwest Pixel Fest.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#before-you-go" className="inline-flex min-h-12 items-center justify-center bg-cyan px-6 py-3 font-display text-sm uppercase tracking-widest text-ink transition-colors hover:bg-gold">Start your guide <span aria-hidden="true" className="ml-2">↓</span></a>
            <Link href="/tickets" className="inline-flex min-h-12 items-center justify-center border border-paper/50 bg-[#090d22]/65 px-6 py-3 font-display text-sm uppercase tracking-widest text-paper transition-colors hover:border-gold hover:text-gold">Admission & tickets</Link>
          </div>
        </Container>
      </header>

      <section aria-label="Event essentials" className="border-b border-line bg-ink-2">
        <Container className="grid grid-cols-2 gap-4 py-7 md:grid-cols-4">
          {[
            { label: "When", value: site.dateLabel },
            { label: "Where", value: site.location },
            { label: "Saturday", value: "Planned opening: 10 AM" },
            { label: "Sunday", value: "Planned closing: 5 PM" },
          ].map((fact) => (
            <div key={fact.label} className="border-l-2 border-magenta px-3 py-2">
              <p className="font-pixel text-[10px] uppercase tracking-[.17em] text-cyan">{fact.label}</p>
              <p className="mt-2 font-display text-lg uppercase tracking-wide text-paper sm:text-xl">{fact.value}</p>
            </div>
          ))}
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <nav aria-label="On this page" className="mb-14 border border-line bg-panel p-5 sm:p-7">
          <p className="font-pixel text-[11px] uppercase tracking-[.16em] text-gold">Jump to what you need</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {jumps.map((item) => (
              <a key={item.href} href={item.href} className="inline-flex min-h-11 items-center border border-paper/20 px-4 py-2 font-display text-sm uppercase tracking-wide text-paper transition-colors hover:border-cyan hover:bg-cyan/10 hover:text-cyan">{item.label}</a>
            ))}
          </div>
        </nav>

        <section id="before-you-go" className="scroll-mt-28">
          <StepHeading number="01" eyebrow="Know the essentials" title="Before you go" />
          <p className="max-w-3xl text-lg leading-relaxed text-muted">
            Midwest Pixel Fest 2027 is our inaugural event in Emporia, Kansas. We're building a weekend around gaming, tabletop, collectibles, cosplay, artists, and community. More details will be posted as each part of the event is confirmed.
          </p>
          <div className="mt-6 border-l-4 border-gold bg-panel p-5 sm:p-7">
            <h3 className="font-display text-xl uppercase tracking-wide text-gold">Venue update — please read before booking travel</h3>
            <p className="mt-3 leading-relaxed text-paper/85">
              {plannedVenue.name} at {plannedVenue.institution}, inside Memorial Union at {plannedVenue.streetAddress}, {plannedVenue.city}, {plannedVenue.region}, is our selected venue. The reservation still requires a signed agreement and deposit. Until it's confirmed, avoid making nonrefundable hotel or travel arrangements.
            </p>
            <p className="mt-3 text-sm text-muted">We'll publish verified entry, parking, accessibility, and hotel information on the <InlineLink href="/travel">Travel page</InlineLink>.</p>
          </div>
        </section>

        <div className="my-12 border-t border-line" />

        <section id="tickets" className="scroll-mt-28">
          <StepHeading number="02" eyebrow="Your admission" title="Tickets & checking in" />
          <p className="max-w-3xl leading-relaxed text-muted">
            Start at our <InlineLink href="/tickets">official Tickets page</InlineLink>. {ticketsOpen ? "Admission is currently offered through Ticketleap, with a venue reservation notice displayed before checkout." : "Ticket types and prices are available to review; online sales are temporarily on hold."} Save your purchase confirmation where you can find it on event day. The exact check-in location, credentials, and entry process are still being planned.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ticketProducts.map((item) => (
              <div key={item.id} className="border border-line bg-panel p-5">
                <p className="font-display text-lg uppercase tracking-wide text-paper">{item.name}</p>
                <p className="mt-3 font-display text-3xl text-gold">{item.priceLabel}</p>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">Ticketleap fees may apply. Capacity and event details depend on the finalized venue agreement. Review refund and transfer terms before purchase.</p>
        </section>

        <div className="my-12 border-t border-line" />

        <section id="arrival" className="scroll-mt-28">
          <StepHeading number="03" eyebrow="Getting here" title="Arrive ready to explore" />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="leading-relaxed text-muted">Emporia is right on the I-35 corridor and is an easy place to plan a road trip from communities across Kansas. When you arrive, look for the official event entrance and attendee instructions we will publish closer to the show.</p>
              <p className="mt-4 leading-relaxed text-muted">Exact parking lots, check-in times, wristbands or badges, bag rules, and any early pickup options have <strong className="text-paper">not</strong> been finalized. We'll share those details when we can verify them.</p>
              <Link href="/travel" className="mt-6 inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-widest text-cyan hover:bg-cyan hover:text-ink">Travel and parking updates ↗</Link>
            </div>
            <div className="relative min-h-[220px] overflow-hidden border border-line">
              <Image src="/images/community/friends-console-play.jpg" alt="Friends enjoying a game together with classic controllers" fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
            </div>
          </div>
        </section>

        <div className="my-12 border-t border-line" />

        <section id="what-to-do" className="scroll-mt-28">
          <StepHeading number="04" eyebrow="Find your lane" title="What do you do at a con?" />
          <p className="mb-7 max-w-3xl leading-relaxed text-muted">There isn't a correct way to enjoy your first convention. Start with the things you love, check the schedule when it's published, and give yourself time to discover something new. Activities and participating guests will be confirmed individually.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {experiences.map((item) => (
              <article key={item.number} className="flex flex-col border border-line bg-panel p-6">
                <span className="font-pixel text-sm text-magenta">{item.number} / PLAY</span>
                <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">{item.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{item.description}</p>
                <Link href={item.href} className="mt-6 inline-flex min-h-11 items-center font-display text-sm uppercase tracking-widest text-cyan hover:text-gold">{item.link} <span aria-hidden="true" className="ml-2">→</span></Link>
              </article>
            ))}
          </div>
          <div className="mt-6 border border-cyan/25 bg-ink-2 p-5">
            <h3 className="font-display text-xl uppercase tracking-wide">Guests, panels & signings</h3>
            <p className="mt-2 text-muted">Our guest lineup and programming are still being developed. Some meet-and-greets, autographs, photos, tournaments, or workshops may have additional charges or capacity limits. We'll label those details on official listings before the event.</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <InlineLink href="/guests">Guest announcements</InlineLink>
              <InlineLink href="/schedule">Schedule updates</InlineLink>
            </div>
          </div>
        </section>

        <div className="my-12 border-t border-line" />

        <section id="cosplay" className="scroll-mt-28">
          <StepHeading number="05" eyebrow="Costumes welcome" title="Cosplay, or come as you are" />
          <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div className="relative min-h-[250px] overflow-hidden border border-magenta/25">
              <Image src="/images/cosplay/cosplay-convention-hall.jpg" alt="Cosplayer wearing a handmade costume at a convention" fill sizes="(min-width: 1024px) 360px, 100vw" className="object-cover object-center" />
            </div>
            <div>
              <p className="leading-relaxed text-muted">Whether your costume took six months or you're wearing your favorite gaming shirt, you'll fit right in. A cosplay contest and community meetups are planned, with specific rules and times to come.</p>
              <ul className="mt-5 space-y-3 text-paper/90">
                <li className="flex gap-3"><span className="text-magenta" aria-hidden="true">◆</span>Ask permission before photographing anyone.</li>
                <li className="flex gap-3"><span className="text-magenta" aria-hidden="true">◆</span>Don't touch costumes, props, or other attendees without consent.</li>
                <li className="flex gap-3"><span className="text-magenta" aria-hidden="true">◆</span>Functional weapons aren't allowed. Read our <Link href="/weapons-policy" className="text-cyan underline underline-offset-4">Weapons & Props Policy</Link> for preliminary guidance; final venue procedures are forthcoming.</li>
                <li className="flex gap-3"><span className="text-magenta" aria-hidden="true">◆</span>You don't need a costume to enjoy cosplay.</li>
              </ul>
              <p className="mt-5"><InlineLink href="/cosplay">Cosplay details and rules</InlineLink></p>
            </div>
          </div>
        </section>

        <div className="my-12 border-t border-line" />

        <section id="families" className="scroll-mt-28">
          <StepHeading number="06" eyebrow="Everyone belongs" title="Families, breaks & accessibility" />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Bringing kids?", description: "Midwest Pixel Fest is planned as an all-ages weekend. Children 12 and under receive free admission with a paid adult. Plan breaks and keep your group together." },
              { title: "Food & water", description: "Eat before you arrive if you need to, and plan time for a meal and water breaks. Event food and drink arrangements will be announced after venue details are finalized." },
              { title: "Accessibility", description: "Entry routes, seating, accommodation processes, and any quiet-space details are being finalized. Contact us with access questions before making travel plans." },
            ].map((item) => (
              <div key={item.title} className="border border-line bg-panel p-6">
                <h3 className="font-display text-xl uppercase tracking-wide text-paper">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-muted">
            Everyone deserves a respectful weekend. <InlineLink href="/code-of-conduct">Read our Code of Conduct</InlineLink> before attending.
          </p>
          <p className="mt-5 text-sm text-muted">
            Have accessibility or family-service questions? <InlineLink href="/attendee-services">Read the Attendee Services & Accessibility guide</InlineLink>.
          </p>
          <p className="mt-5 text-sm text-muted">
            Want more to do while you're here? <InlineLink href="/visit-emporia">Explore our Visit Emporia guide</InlineLink>.
          </p>
          <p className="mt-5 text-sm text-muted">Questions about accommodations, family planning, or event policies? <InlineLink href="/contact">Contact the Midwest Pixel Fest team.</InlineLink></p>
        </section>

        <div className="my-12 border-t border-line" />

        <section aria-labelledby="packing-title">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Your inventory</p>
              <h2 id="packing-title" className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">First-day packing list</h2>
              <p className="mt-4 leading-relaxed text-muted">This is a practical packing list, not a final bag policy. Check the official attendee updates before you head out.</p>
            </div>
            <VisitChecklist />
          </div>
        </section>

        <div className="my-12 border-t border-line" />

        <section id="good-to-know" className="scroll-mt-28">
          <StepHeading number="07" eyebrow="Common questions" title="Good to know" />
          <div className="divide-y divide-line border-y border-line">
            {answers.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg uppercase tracking-wide text-paper marker:hidden sm:text-xl">
                  {item.q}
                  <span aria-hidden="true" className="shrink-0 text-2xl text-cyan transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-muted">Need more detail? Visit the <InlineLink href="/faq">full FAQ</InlineLink> or <InlineLink href="/contact">send us a question</InlineLink>.</p>
        </section>
      </Container>

      <section className="border-t border-line bg-ink-2 py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Stay in the loop</p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-tight text-paper sm:text-5xl">Your adventure starts before the doors open.</h2>
            <p className="mt-5 leading-relaxed text-muted">Guests, schedules, entry instructions, parking, and final policies will appear on our official website as details are confirmed. Join the update list to follow along.</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
              <InlineLink href="/news">Latest news</InlineLink>
              <InlineLink href="/travel">Plan your trip</InlineLink>
              <InlineLink href="/tickets">Ticket details</InlineLink>
            </div>
          </div>
          <div className="border border-line bg-panel p-5 sm:p-8">
            <NewsletterForm />
          </div>
        </Container>
      </section>
    </main>
  );
}
