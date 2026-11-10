import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Press & Media Credential Information | Midwest Pixel Fest 2027",
  description: "Media and creator coverage guidelines for Midwest Pixel Fest 2027. Learn about eligibility, credential access, interview requests, photography and press inquiries. Formal credential applications are not open yet.",
  path: "/press",
});
const categories = [
  ["News & editorial", "Local and regional newspapers, magazines, online newsrooms, community publications and freelance journalists with a defined editorial assignment."],
  ["Broadcast & audio", "Television, radio, podcasts and other programs preparing relevant event reporting, interviews or features for their audience."],
  ["Digital creators", "Independent video creators, streamers, bloggers and photographers with public examples of relevant work and a specific coverage plan."],
  ["Student & campus media", "College newspapers, campus broadcasters, journalism programs and student reporters covering the convention for a publication or class assignment."],
] as const;
const questions = [
  ["Are press credential applications open?", "Not yet. The press inquiry form is open for coverage introductions and questions. A formal credential application and its deadline will be published here when available. An inquiry is not an application or an approval."],
  ["Do I need a minimum number of followers?", "No fixed follower minimum is currently published. Relevant work, an active outlet or channel, your assignment or coverage plan, and the needs of the event will inform review. A large audience does not automatically qualify an applicant."],
  ["Can independent photographers or creators inquire?", "Yes. Include your portfolio, publication or channel and explain where your event coverage will appear. Personal photos, a portfolio-building visit or general attendance alone do not establish a media assignment. Commercial photography arrangements should be discussed separately."],
  ["Can my whole team use one credential?", "No. Any approved credential will be assigned to a named person and may not be shared, transferred or sold. Identify each team member and their working role in your inquiry; team size and access will require approval."],
  ["Does a credential include guest interviews or photo ops?", "No. Guest interviews require separate arrangements and guest or representative approval. Autographs, paid photo opportunities and other separately ticketed experiences are not included unless explicitly stated in writing."],
  ["Will credentials include early entry or backstage access?", "No special access is promised. A credential does not automatically allow early entry, line skipping, backstage or private areas, reserved seats or access to a full session. Any approved exceptions must be arranged with the event team."],
  ["When will I hear back about credentials?", "A credential application window, decision schedule and pickup instructions have not been announced. We can discuss coverage plans through the inquiry form now; submitting one does not reserve a badge."],
  ["Can I interview the organizer before the event?", "Use the press inquiry form to describe your outlet, topic, preferred format and deadline. Organizer interviews are subject to availability. Guest interview availability will be handled separately as appearances are announced."],
] as const;

export default function PressPage() {
  return <InnerPage path="/press" breadcrumbLabel="Press & Media" mood="business"
    eyebrow="Cover the convention · Emporia, Kansas"
    title="Press & Media Credentials"
    intro="Help tell the story of Midwest Pixel Fest: the players, artists, creators and community coming together for our inaugural convention on October 16–17, 2027."
    actions={[{href:"/press/inquiry",label:"Send a press inquiry",variant:"primary"},{href:"#guidelines",label:"Read coverage guidelines",variant:"secondary"}]}
  >
    <nav aria-label="On this page" className="mb-12 flex flex-wrap gap-x-7 gap-y-3 border-y border-line py-5 text-sm font-semibold text-muted">{[["credentials","Credential status"],["eligibility","Who can inquire"],["guidelines","Coverage guidelines"],["resources","Media resources"],["questions","FAQs"]].map(([id,label])=><a key={id} href={"#"+id} className="inline-flex min-h-11 items-center hover:text-cyan">{label}<span aria-hidden="true" className="ml-2 text-cyan">↓</span></a>)}</nav>

    <section id="credentials" className="scroll-mt-28 border border-line bg-panel p-7 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">2027 media access</p><h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Inquiries open. Credential applications coming later.</h2>
      <p className="mt-5 max-w-3xl leading-relaxed text-muted">We welcome coverage introductions now. Formal credential applications, badge allocations, deadlines and pickup instructions will be announced here as event arrangements are finalized.</p>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted">Sending an inquiry does not issue a credential, grant complimentary admission or guarantee approval. Any credential offer will identify the named recipient, approved dates and permitted access in writing.</p>
      <div className="mt-7 grid gap-5 border-t border-line pt-6 sm:grid-cols-3">{[["Press inquiries","Open now"],["Credential applications","Not open yet"],["Application deadline","To be announced"]].map(([label,value])=><div key={label}><p className="text-sm text-muted">{label}</p><p className="mt-2 font-semibold text-cyan">{value}</p></div>)}</div>
    </section>

    <section id="eligibility" className="mt-16 scroll-mt-28"><p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Local voices. Regional reach.</p><h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Who can inquire?</h2><p className="mt-4 max-w-3xl leading-relaxed text-muted">Established outlets and emerging voices are welcome to introduce themselves. Tell us who you reach, what you plan to cover and where your work will be published.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">{categories.map(([title,text])=><article key={title} className="border border-line bg-panel p-7"><h3 className="font-display text-2xl uppercase text-paper">{title}</h3><p className="mt-4 leading-relaxed text-muted">{text}</p></article>)}</div>
    </section>

    <section className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Start the conversation</p><h2 className="mt-3 font-display text-3xl uppercase text-paper">What to include</h2><ul className="mt-6 list-disc space-y-3 pl-5 leading-relaxed text-muted"><li>Your name, outlet or channel, role and a reliable contact email.</li><li>Your publication, website, social channel or portfolio links.</li><li>Examples of relevant reporting, photography, videos or interviews.</li><li>A brief coverage plan, intended publication channels and any editorial deadline.</li><li>Your audience information, requested event days and each team member’s working role.</li><li>Any organizer interview request, equipment needs or access questions.</li></ul></div>
      <aside className="border-l-2 border-cyan bg-panel p-7"><h2 className="font-display text-2xl uppercase text-paper">How review will work</h2><p className="mt-4 leading-relaxed text-muted">Coverage relevance, the quality and activity of your work, your assignment and available event capacity will guide consideration. No fixed follower threshold is currently published.</p><p className="mt-4 leading-relaxed text-muted">Press credentials are for working coverage. A vendor, sponsor or guest affiliation does not automatically grant press status. Applications will be reviewed individually when the formal process opens.</p><Link href="/press/inquiry" className="mt-5 inline-flex min-h-11 items-center font-semibold text-cyan underline underline-offset-4">Introduce your outlet or coverage plan →</Link></aside>
    </section>

    <section id="guidelines" className="mt-16 scroll-mt-28 border-t border-line pt-12"><p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Working together on the floor</p><h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Coverage & access guidelines</h2>
      <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">{[
        ["Respect consent & personal space", "Ask before posed photos, interviews or close-up recording. Seek a parent or guardian’s permission for interviews or posed coverage involving minors. Respect anyone who declines and do not disrupt their visit."],
        ["Arrange guest interviews in advance", "Contact the event team with the guest name, outlet, format, proposed topic and deadline. Approval and scheduling are separate from credential review. Do not approach a signing line or private area expecting an interview."],
        ["Follow session photography rules", "Panel, performance and guest-area recording rules may vary. Ask staff before recording and follow guest or representative restrictions. Do not use flash or equipment where prohibited."],
        ["Keep the event accessible", "Leave aisles, exits, accessible routes and sightlines clear. Tripods, lighting, microphones and other equipment must not obstruct attendees or interrupt programming. Discuss larger setups with the team beforehand."],
        ["Use only approved access", "Respect queues, session capacity and staff directions. A press credential does not grant private-area access, priority seating, complimentary merchandise, autographs or paid photo sessions."],
        ["Report accurately & act professionally", "Identify yourself and your outlet when requesting interviews. Distinguish announced plans from confirmed details, follow our Code of Conduct, and do not harass, intimidate or ridicule attendees. Editorial coverage does not require a positive review."],
      ].map(([title,text])=><article key={title} className="border-t border-line pt-5"><h3 className="font-display text-xl uppercase text-paper">{title}</h3><p className="mt-3 leading-relaxed text-muted">{text}</p></article>)}</div>
      <p className="mt-7 text-sm leading-relaxed text-muted">Event and venue rules apply to media attendees. Credentials may be withdrawn for misuse or rule violations. Final credential terms will be published with the application.</p>
      <div className="mt-5 flex flex-wrap gap-6 text-sm font-semibold text-cyan"><Link href="/code-of-conduct" className="underline underline-offset-4">Code of Conduct</Link><Link href="/attendee-services" className="underline underline-offset-4">Accessibility information</Link><Link href="/guests/autographs" className="underline underline-offset-4">Guest autograph & photo information</Link></div>
    </section>

    <section id="resources" className="mt-16 scroll-mt-28 border-t border-line pt-12"><h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">Media resources & event facts</h2><div className="mt-7 grid gap-7 lg:grid-cols-2"><dl className="divide-y divide-line border-y border-line">{[["Event","Midwest Pixel Fest 2027"],["Dates","October 16–17, 2027"],["City","Emporia, Kansas"],["Selected venue","Webb Hall · ESU Memorial Union"],["Venue status","Reservation pending a signed agreement and deposit"]].map(([label,value])=><div key={label} className="grid gap-2 py-4 sm:grid-cols-[130px_1fr]"><dt className="text-sm text-muted">{label}</dt><dd className="text-paper">{value}</dd></div>)}</dl><div className="border border-line bg-panel p-7"><h3 className="font-display text-2xl uppercase text-paper">Press kit: coming soon</h3><p className="mt-4 leading-relaxed text-muted">Approved logo downloads, publicity images and a downloadable fact sheet will be added when available. For assets or a deadline-sensitive question now, send a press inquiry. Website atmosphere photos are not documentation of a past PixelFest.</p><div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold text-cyan"><Link href="/news" className="underline underline-offset-4">Official announcements</Link><Link href="/about" className="underline underline-offset-4">About the event</Link></div></div></div></section>

    <section id="questions" className="mt-16 scroll-mt-28 border-t border-line pt-12"><h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">Press & creator FAQs</h2><div className="mt-7 divide-y divide-line border-y border-line">{questions.map(([q,a])=><details key={q} className="group py-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-paper [&::-webkit-details-marker]:hidden">{q}<span aria-hidden="true" className="text-2xl text-cyan group-open:rotate-45">+</span></summary><p className="mt-3 max-w-4xl leading-relaxed text-muted">{a}</p></details>)}</div></section>
    <aside className="mt-14 flex flex-col gap-6 border border-line bg-panel p-7 sm:p-10 md:flex-row md:items-center md:justify-between"><div><h2 className="font-display text-2xl uppercase text-paper">Bring us your coverage idea.</h2><p className="mt-3 text-muted">Share your outlet, assignment or creator project with the event team.</p></div><Link href="/press/inquiry" className="inline-flex min-h-12 items-center justify-center bg-cyan px-6 py-3 font-display uppercase tracking-wide text-ink hover:bg-gold">Send a press inquiry</Link></aside>
  </InnerPage>;
}
