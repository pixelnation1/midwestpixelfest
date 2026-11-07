import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Code of Conduct | Midwest Pixel Fest 2027",
  description:
    "Read the official Midwest Pixel Fest 2027 Code of Conduct covering respectful behavior, cosplay consent, gaming etiquette, harassment reporting and event safety.",
  path: "/code-of-conduct",
});

const values = [
  {
    eyebrow: "01 / Respect",
    title: "Everyone belongs",
    description:
      "Treat all attendees, guests, creators, exhibitors, volunteers, staff and venue workers with courtesy. People have different backgrounds, abilities and ways of enjoying fandom.",
  },
  {
    eyebrow: "02 / Consent",
    title: "Ask first. Respect no.",
    description:
      "Respect personal space and boundaries. Don't touch people, costumes, props or personal belongings without permission. Stop immediately when asked.",
  },
  {
    eyebrow: "03 / Safety",
    title: "Keep the floor safe",
    description:
      "Follow posted policies and reasonable instructions from authorized event and venue staff. Keep exits, walkways and accessibility routes clear.",
  },
];

const prohibited = [
  {
    title: "Harassment, threats and intimidation",
    description:
      "Threats, stalking, following, bullying, degrading or discriminatory remarks, sexual harassment, unwelcome sexual attention, persistent unwanted contact and hostile behavior are prohibited. This includes targeting someone because of race, ethnicity, national origin, religion, age, sex, sexual orientation, gender identity, disability, appearance or other personal characteristics.",
  },
  {
    title: "Unwanted contact and photography",
    description:
      "No unwanted hugging, grabbing, touching, blocking someone's way or touching their costume, mobility aids or props. Ask permission before taking a focused photo or recording of another attendee, particularly a child. Respect a refusal, and stop recording if someone asks you to stop photographing them individually.",
  },
  {
    title: "Disruptive and dangerous conduct",
    description:
      "Fighting, threatening gestures, dangerous horseplay, theft, vandalism, deliberately blocking accessible routes or exits, deliberate property damage and interference with safety procedures are prohibited. Do not bring prohibited weapons or hazardous props.",
  },
  {
    title: "Disruption of activities",
    description:
      "Do not repeatedly interrupt panels, obstruct a signing line, interfere with a tournament or harass creators, volunteers and guests at their tables. Follow activity rules and any reasonable line or room-capacity instructions.",
  },
  {
    title: "Inappropriate material and sales",
    description:
      "Do not display explicit sexual content in areas intended for the general all-ages public or sell prohibited, counterfeit or unlawful merchandise. Vendors and exhibitors must also comply with their applicable event policies and vendor terms.",
  },
  {
    title: "Retaliation and false accusations",
    description:
      "Retaliation against someone who makes a good-faith safety report or helps with a review is prohibited. Knowingly fabricating a report to harm someone is also prohibited. A report that cannot be substantiated is not automatically a false report.",
  },
];

const reportingSteps = [
  {
    number: "1",
    title: "Prioritize immediate safety",
    description:
      "If anyone is in immediate danger or a crime is in progress, call 911. Move to a safer location if you can. The website contact form and email are not monitored as emergency services.",
  },
  {
    number: "2",
    title: "Tell our team",
    description:
      "Before or after the event, email our official contact address with the subject 'Code of Conduct Report' or use the Contact page. During the convention, approach an identifiable event staff member and ask for an organizer or safety contact. The final staff locations and reporting points will be published closer to the event.",
  },
  {
    number: "3",
    title: "Share what you can",
    description:
      "When and where it happened, what occurred, who was involved, and any witnesses or relevant details can help. You may describe what support you need. You don't have to confront the person or provide medical information to make a report.",
  },
];

const faqs = [
  {
    question: "Does this policy apply to guests, staff and vendors?",
    answer:
      "Yes. Our event rules apply to attendees, featured guests, exhibitors, vendors, panelists, volunteers, organizers and staff while participating in Midwest Pixel Fest. Applicable venue rules and laws also apply.",
  },
  {
    question: "What if a concern involves an organizer or volunteer?",
    answer:
      "You may still report it to hello@midwestpixelfest.com and say that your concern involves an organizer or staff member. Request review by another member of event leadership where possible. We cannot promise an independent investigation or absolute confidentiality.",
  },
  {
    question: "Is all convention photography prohibited without individual permission?",
    answer:
      "No. General photography of event spaces may occur under the event's published photo and media rules. For focused photos or recordings of individuals, ask first and respect boundaries. Extra care is expected when photographing children.",
  },
  {
    question: "Can someone be removed without a warning?",
    answer:
      "Yes. Depending on the severity and circumstances, event organizers may take immediate protective action. Actions are assessed case by case in coordination with venue staff and, when appropriate, authorities.",
  },
  {
    question: "Does this replace the weapons and props rules?",
    answer:
      "No. The separate Weapons & Props Policy applies alongside this Code of Conduct. The finalized venue and security requirements may be more restrictive.",
  },
];

export default function CodeOfConductPage() {
  const reportHref = `mailto:${site.contactEmail}?subject=${encodeURIComponent("Midwest Pixel Fest - Code of Conduct Report")}`;

  return (
    <InnerPage
      path="/code-of-conduct"
      eyebrow="Info / Community standards"
      title="Code of Conduct"
      intro="Good games. Good people. Everyone deserves an experience built on respect, safety and belonging at Midwest Pixel Fest."
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Info", path: "/info" },
        { name: "Code of Conduct", path: "/code-of-conduct" },
      ]}
    >
      <div className="mb-10 border-l-4 border-cyan bg-panel p-6 sm:p-8">
        <p className="font-pixel text-[11px] uppercase tracking-[.14em] text-cyan">
          Official Midwest Pixel Fest community policy
        </p>
        <h2 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">
          A convention for everyone
        </h2>
        <p className="mt-3 max-w-4xl leading-relaxed text-muted">
          This policy applies to everyone participating in Midwest Pixel Fest activities,
          including attendees, guests, vendors, artists, volunteers, panelists, organizers
          and staff. It covers our convention spaces, official activities and event-managed
          online channels. It operates alongside applicable laws, ticket terms and venue rules.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Webb Hall at Emporia State University is our selected 2027 venue, but the final
          agreement is pending. We will publish any additional venue-specific requirements
          and confirmed on-site safety contacts before the event.
        </p>
      </div>

      <nav aria-label="Code of Conduct sections" className="mb-10 border border-line bg-ink-2 p-5 sm:p-6">
        <p className="font-pixel text-[11px] uppercase tracking-[.14em] text-gold">Jump to a section</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["#expectations", "Our expectations"],
            ["#unacceptable", "Prohibited behavior"],
            ["#cosplay", "Cosplay & photography"],
            ["#gaming", "Gaming & vendors"],
            ["#report", "Report a concern"],
            ["#response", "What happens next"],
            ["#questions", "Questions"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center border border-paper/25 px-4 py-2 font-display text-xs uppercase tracking-wider text-paper hover:border-cyan hover:text-cyan"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="expectations" className="scroll-mt-28">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Our ground rules</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">
          Play. Connect. Respect.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {values.map((item) => (
            <article key={item.title} className="border border-line border-t-4 border-t-cyan/70 bg-panel p-6">
              <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">{item.eyebrow}</p>
              <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-paper">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="unacceptable" className="mt-14 scroll-mt-28">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-magenta">Not welcome at Pixel Fest</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">
          Prohibited behavior
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted">
          The following examples are not exhaustive. If conduct is threatening,
          harassing or unsafe, our team may address it even if it does not
          appear verbatim in this list.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {prohibited.map((item) => (
            <article key={item.title} className="border border-magenta/30 bg-panel p-6">
              <h3 className="font-display text-xl uppercase tracking-wide text-paper sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="cosplay" className="mt-14 scroll-mt-28 border border-cyan/30 bg-[#101729] p-6 sm:p-8">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Respect the craft and the person</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">
          Cosplay is not consent.
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          A costume is an expression of creativity, not permission to photograph,
          touch, follow or comment sexually about its wearer. Ask before photographing
          a person, touching a prop or requesting a pose. No means no, even if you
          think you are being playful. When someone declines, move on respectfully.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          General event photography and officially credentialed media may be subject
          to separate published media notices. That does not excuse targeted,
          harassing or intrusive photography or recording.
        </p>
        <p className="mt-5 text-sm">
          <Link href="/weapons-policy" className="text-cyan underline underline-offset-4 hover:text-gold">
            Read the Weapons & Props Policy
          </Link>
          <span className="mx-3 text-paper/40" aria-hidden="true">·</span>
          <Link href="/cosplay" className="text-cyan underline underline-offset-4 hover:text-gold">
            Cosplay information
          </Link>
        </p>
      </section>

      <section id="gaming" className="mt-14 scroll-mt-28">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Play fair. Shop respectfully.</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">
          Gaming, trading, guests & exhibitors
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border border-line bg-panel p-6">
            <h3 className="font-display text-2xl uppercase tracking-wide text-paper">Good sportsmanship</h3>
            <p className="mt-3 leading-relaxed text-muted">
              Follow posted game and tournament rules, respect opponents, don't
              cheat or damage equipment, and let staff address disputes. Do not
              pressure or exploit other players, especially minors, during trading
              or games. Do not block accessible routes or emergency exits.
            </p>
          </div>
          <div className="border border-line bg-panel p-6">
            <h3 className="font-display text-2xl uppercase tracking-wide text-paper">Creators & vendors</h3>
            <p className="mt-3 leading-relaxed text-muted">
              Respect booth boundaries, vendor rules and the time of guests,
              creators and staff. No theft, counterfeit goods, unlawful sales or
              deliberate interference with someone else's work. Exhibitors
              must also follow applicable <Link href="/vendors/policies" className="text-cyan underline underline-offset-4">vendor policies</Link>.
            </p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          Children are welcome with responsible adult supervision. Please respect
          the personal space and privacy of minors. Do not photograph a child
          individually or seek one-on-one contact without appropriate guardian permission.
        </p>
      </section>

      <section id="report" className="mt-14 scroll-mt-28">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Speak up. We take concerns seriously.</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">
          How to report a concern
        </h2>
        <div className="mt-6 border-l-4 border-gold bg-panel p-6 sm:p-7">
          <p className="font-display text-xl uppercase tracking-wide text-gold">If someone is in immediate danger, call 911.</p>
          <p className="mt-3 leading-relaxed text-muted">
            Email and website forms are not emergency channels. For urgent
            danger or an active crime, contact emergency services instead.
          </p>
        </div>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {reportingSteps.map((step) => (
            <li key={step.number} className="border border-line bg-panel p-6">
              <span className="font-pixel text-xl text-magenta">0{step.number}</span>
              <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-paper">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={reportHref}
            className="inline-flex min-h-11 items-center justify-center bg-magenta px-5 py-3 font-display text-sm uppercase tracking-widest text-ink transition-colors hover:bg-gold"
          >
            Email a conduct report
          </a>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-widest text-cyan hover:bg-cyan/10"
          >
            Contact the team
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">
          Our current official inbox: <a href={`mailto:${site.contactEmail}`} className="text-cyan underline underline-offset-4">{site.contactEmail}</a>.
          Any confirmed event-day help point or staff identification method will
          be published before October 2027.
        </p>
      </section>

      <section id="response" className="mt-14 scroll-mt-28 border border-cyan/25 bg-ink-2 p-6 sm:p-8">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">What happens after a report?</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">Response & accountability</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Event leadership will review concerns based on the information
          available and the circumstances. Depending on severity and safety needs,
          actions may include a conversation or warning, instructions to stop,
          restrictions on activities, loss of event access, removal from the
          venue, or referral to authorities. Serious incidents may require
          immediate action without a warning.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          We aim to handle reports respectfully, limit unnecessary sharing
          of personal information, and avoid retaliation. However, we cannot
          promise complete confidentiality, a particular outcome or an
          investigation independent of the event. Information may need to be
          shared with appropriate staff, venue personnel, or authorities when
          necessary for safety or legal reasons. Refund questions are governed
          by the applicable ticket terms and law.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          If your concern involves a staff member or organizer, say so in
          your report and ask for review by another member of event leadership
          where possible. You do not have to confront the person involved.
        </p>
      </section>

      <section id="questions" className="mt-14 scroll-mt-28">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Good to know</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">Questions about our policy</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {faqs.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg uppercase tracking-wide text-paper [&::-webkit-details-marker]:hidden">
                {item.question}
                <span aria-hidden="true" className="shrink-0 text-2xl text-cyan transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-12 border border-line bg-panel p-6 sm:p-8">
        <h2 className="font-display text-2xl uppercase tracking-wide text-paper">Help keep the community welcoming</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Read our other attendee policies and plan a weekend where everyone
          gets to enjoy the games, creativity and people who make Pixel Fest special.
          We may update this policy as event operations, venue terms and legal
          requirements are finalized; the current version will be published here.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { href: "/info", label: "Attendee Info" },
            { href: "/weapons-policy", label: "Props & Weapons" },
            { href: "/attendee-services", label: "Accessibility" },
            { href: "/first-timers-guide", label: "First-Timer's Guide" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center border border-cyan/40 px-4 py-3 font-display text-sm uppercase tracking-widest text-cyan hover:border-gold hover:text-gold">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </InnerPage>
  );
}
