import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Weapons & Props Policy | Midwest Pixel Fest 2027",
  description:
    "Midwest Pixel Fest 2027's preliminary cosplay weapons and prop safety rules: prohibited items, soft props, inspection, oversized costumes, and venue review.",
  path: "/weapons-policy",
});

const prohibited = [
  {
    title: "Real weapons and sharp objects",
    detail:
      "Firearms, ammunition, sharp knives, swords, axes, daggers, sharp points, metal blades, and other functional weapons are not allowed as costume props, including unloaded or sheathed weapons.",
  },
  {
    title: "Functional launchers and realistic replica guns",
    detail:
      "Airsoft, BB, pellet, paintball, cap and other projectile guns; bows, crossbows, slingshots and devices that launch anything are prohibited. Realistic-looking prop firearms should stay home. An orange tip alone does not make a prop acceptable.",
  },
  {
    title: "Explosives, pyrotechnics and chemicals",
    detail:
      "Fireworks, smoke devices, flash effects, fuels, pepper spray, mace, hazardous substances, and other explosive or chemical effects may not be brought as costume props.",
  },
  {
    title: "Heavy or dangerous materials",
    detail:
      "Metal, glass or heavy rigid prop blades, striking implements, hard clubs, and props with exposed spikes or sharp edges are not permitted. Items that could injure someone when bumped or dropped will be refused.",
  },
  {
    title: "Other unsafe effects",
    detail:
      "Working electric-shock devices, active laser pointers aimed at people, open flames, and anything that fires, sprays, discharges or creates a hazard to the crowd are prohibited.",
  },
];

const saferProps = [
  "Lightweight foam, EVA foam, fabric, cardboard and soft plastic props without sharpened edges or functioning mechanisms are generally the right direction.",
  "Keep long props close to your body, and avoid swinging, pointing, throwing, or posing with them in congested walkways.",
  "Oversized costumes, wings, stilts and large builds may require special approval or an assistant; do not assume there will be room for them.",
  "If your prop resembles a real weapon, has a hard core, or uses lights, sound or moving parts, ask us before traveling with it. Approval is not guaranteed.",
];

const checkSteps = [
  {
    label: "Before the event",
    detail:
      "Review this page again before traveling. Contact the organizer with pictures, dimensions and materials if you are uncertain about an accessory.",
  },
  {
    label: "At entry",
    detail:
      "Be prepared for a safety review and follow instructions from authorized event and venue staff. The exact check-in location, any tagging method, and screening procedures have not yet been confirmed.",
  },
  {
    label: "During the event",
    detail:
      "Carry costume props safely, never threaten or touch another attendee with them, and comply with any request to put an item away or leave it outside the venue.",
  },
];

export default function WeaponsPolicyPage() {
  return (
    <InnerPage
      path="/weapons-policy"
      breadcrumbLabel="Weapons & Props Policy"
      mood="business"
      eyebrow="Cosplay safely · Midwest Pixel Fest 2027"
      title="Weapons & Props Policy"
      intro="Build something memorable. Carry it safely. Review our costume-prop guidelines before bringing your cosplay to the convention."
      actions={[{href:"#prop-guide",label:"Check your prop",variant:"primary"},{href:"/contact",label:"Ask about your build",variant:"secondary"}]}
    >
      <nav aria-label="On this page" className="mb-10 flex flex-wrap gap-x-7 gap-y-3 border-y border-line py-5 text-sm font-semibold text-muted">
        {[["prop-guide","Quick prop guide"],["leave-at-home","Prohibited props"],["safe-props","Materials & builds"],["how-checking-works","Inspection"],["vendors","Vendor purchases"],["questions","FAQs"]].map(([id,label]) => <a key={id} href={"#"+id} className="inline-flex min-h-11 items-center hover:text-cyan">{label}<span aria-hidden="true" className="ml-2 text-cyan">↓</span></a>)}
      </nav>
      <div className="mb-10 border-l-4 border-gold bg-panel px-5 py-6 sm:px-7">
        <p className="font-pixel text-[11px] uppercase tracking-[.16em] text-gold">
          Preliminary policy — venue review pending
        </p>
        <p className="mt-3 leading-relaxed text-paper">
          Webb Hall at Emporia State University is our selected venue, but the venue agreement is not yet signed.
          This is the organizer&apos;s preliminary safety policy, <strong>not a finalized or ESU-approved screening procedure</strong>.
          The final policy may become more restrictive to comply with the venue, applicable law and event security requirements.
          We will publish updates before the convention.
        </p>
      </div>

      <section id="prop-guide" className="mb-14 scroll-mt-28">
        <h2 className="font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Check your build before you travel.</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted">These preliminary guidelines apply to costume props. Materials, weight, edges, mechanisms and how an item is carried all matter. A photo or online discussion is not final admission approval.</p>
        <div className="mt-7 overflow-x-auto border border-line"><table className="w-full min-w-[540px] text-left text-sm leading-relaxed"><caption className="sr-only">Preliminary costume prop guidance</caption><thead className="bg-panel text-paper"><tr><th scope="col" className="px-5 py-4">Prop type</th><th scope="col" className="px-5 py-4">Planning guidance</th><th scope="col" className="px-5 py-4">What to know</th></tr></thead><tbody className="divide-y divide-line">{[
          ["Lightweight foam or fabric", "Generally suitable for review", "No sharp edges, exposed cores or hazardous mechanisms."],
          ["3D-printed or rigid plastic builds", "Ask before bringing", "Not automatically approved: brittle points, weight and hard edges can create hazards."],
          ["Fantasy blasters & lightsabers", "Ask before bringing", "Must be visibly fictional, lightweight and non-firing. Realistic firearm replicas are not acceptable costume props."],
          ["Realistic replica guns / projectile devices", "Do not bring as props", "An orange tip or removing ammunition does not make these acceptable."],
          ["Metal blades / heavy striking props", "Do not bring as props", "Includes blunt metal costume blades and sheathed real weapons."],
          ["Large wings, staffs or oversized costumes", "Contact us first", "Size, visibility and safe movement through crowds need review."],
        ].map(([type,status,note]) => <tr key={type}><th scope="row" className="px-5 py-5 font-semibold text-paper">{type}</th><td className="px-5 py-5 text-gold">{status}</td><td className="max-w-xl px-5 py-5 text-muted">{note}</td></tr>)}</tbody></table></div>
      </section>

      <section className="mb-12" aria-labelledby="safety-first">
        <h2 id="safety-first" className="font-display text-3xl uppercase tracking-wide text-paper">
          Safety comes first
        </h2>
        <p className="mt-4 max-w-4xl leading-relaxed text-muted">
          Midwest Pixel Fest welcomes cosplayers of every experience level. For the safety of families, guests, artists and
          attendees, functional weapons and dangerous accessories are not part of the event. A costume prop must be safe to
          carry through a busy convention, not just safe to display in a photo.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Event staff may decline any prop that presents a safety concern, even if it is not specifically named here.
          An item&apos;s legality outside the convention does not guarantee admission inside the event.
          Mobility aids and assistive equipment are not costume weapons; anyone with an accessibility concern can
          <Link href="/contact" className="ml-1 text-cyan underline underline-offset-4">contact our team</Link>.
        </p>
      </section>

      <section id="leave-at-home" className="mb-12 scroll-mt-28" aria-labelledby="prohibited-heading">
        <p className="font-pixel text-[11px] uppercase tracking-[.16em] text-magenta">Not permitted as costume props</p>
        <h2 id="prohibited-heading" className="mt-2 font-display text-3xl uppercase tracking-wide text-paper">
          Leave these items at home
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {prohibited.map((item) => (
            <article key={item.title} className="border border-magenta/30 bg-panel p-5 sm:p-6">
              <h3 className="font-display text-xl uppercase tracking-wide text-paper">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="safe-props" className="mb-12 scroll-mt-28 border border-cyan/30 bg-ink-2 p-6 sm:p-8" aria-labelledby="safe-props-heading">
        <p className="font-pixel text-[11px] uppercase tracking-[.16em] text-cyan">Plan your costume</p>
        <h2 id="safe-props-heading" className="mt-2 font-display text-3xl uppercase tracking-wide text-paper">
          Safer cosplay props
        </h2>
        <ul className="mt-5 space-y-4">
          {saferProps.map((item) => (
            <li key={item} className="flex items-start gap-3 leading-relaxed text-paper/90">
              <span aria-hidden="true" className="mt-1 text-cyan">◆</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          These are planning guidelines, not advance approval of any item. Final venue and event rules control admission.
        </p>
      </section>

      <section id="how-checking-works" className="mb-12 scroll-mt-28" aria-labelledby="inspection-heading">
        <h2 id="inspection-heading" className="font-display text-3xl uppercase tracking-wide text-paper">
          How prop review will work
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {checkSteps.map((item, index) => (
            <li key={item.label} className="border border-line bg-panel p-5">
              <span className="font-pixel text-lg text-gold">0{index + 1}</span>
              <h3 className="mt-3 font-display text-xl uppercase text-paper">{item.label}</h3>
              <p className="mt-3 leading-relaxed text-muted">{item.detail}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          No prop-check station, daily tagging process, storage service, or screening technology has been announced.
          Please do not assume we can store prohibited items at the venue.
        </p>
      </section>

      <section id="vendors" className="mb-12 scroll-mt-28 border-t border-line pt-10">
        <h2 className="font-display text-3xl uppercase tracking-wide text-paper">Vendors & prop purchases</h2>
        <p className="mt-4 max-w-4xl leading-relaxed text-muted">Vendors must disclose prop merchandise in their application and obtain approval before displaying or selling it. A vendor’s acceptance does not approve every item they bring, and buying an item at the event does not grant permission to carry it on the floor.</p>
        <p className="mt-4 max-w-4xl leading-relaxed text-muted">Weapons, restricted replicas and functional launchers are not approved merchandise under this preliminary costume-prop policy. Secure packaging and any collection or removal procedure must be agreed with the event and venue team before sales begin. No weapons storage, item-check service or automatic purchase exception is promised.</p>
        <Link href="/vendors/policies" className="mt-4 inline-flex min-h-11 items-center font-semibold text-cyan underline underline-offset-4">Vendor policies →</Link>
      </section>

      <section className="mb-12" aria-labelledby="respect">
        <h2 id="respect" className="font-display text-3xl uppercase tracking-wide text-paper">
          Respect everyone on the floor
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          Cosplay is for creativity and community. Do not point props at anyone without their clear consent, block entrances,
          stage mock fights in crowded areas, or touch another person&apos;s costume or props without permission.
          Intimidation, harassment and hateful conduct are not welcome.
          Follow any instructions given by authorized staff.
        </p>
      </section>

      <section id="questions" className="mb-12 scroll-mt-28 border-t border-line pt-10">
        <h2 className="font-display text-3xl uppercase tracking-wide text-paper">Prop questions</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">{[
          ["Can I bring an airsoft gun if it is unloaded?", "No. Airsoft, BB, pellet, paintball and similar devices are not acceptable costume props, even if unloaded. Bring a lightweight, non-firing fantasy prop instead and request guidance if unsure."],
          ["Does an orange tip guarantee approval?", "No. An orange tip is not permission to bring a realistic firearm replica. Shape, materials, mechanisms and the potential to alarm or injure others all matter."],
          ["Are 3D-printed props allowed?", "Some builds may be suitable for review. There is no blanket approval for 3D printing or resin. Send the dimensions, approximate weight, materials, any internal core and photos through the contact process. Avoid sharp, brittle or heavy parts."],
          ["What if my prop is refused?", "Follow authorized staff directions and do not bring the item onto the event floor. We have not announced storage or a check-in service for refused items. Never leave an item unattended or ask another attendee to hide it."],
          ["Will props need a tag or daily inspection?", "Inspection locations, tagging methods and any repeat inspection requirements will be published after venue and security review. Be prepared to present your item when requested; no specific process is confirmed yet."],
          ["Do these rules apply to mobility aids?", "Mobility aids and assistive equipment are not costume weapons. Contact the team about access needs; do not modify an essential aid into a hazardous prop."],
          ["What if I see threatening behavior?", "Move away and notify event or venue staff. Do not confront the person, attempt to disarm them or handle an unattended suspicious item. For an immediate emergency, call 911."],
        ].map(([q,a]) => <details key={q} className="group py-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-paper [&::-webkit-details-marker]:hidden">{q}<span aria-hidden="true" className="text-2xl text-cyan group-open:rotate-45">+</span></summary><p className="mt-3 max-w-4xl leading-relaxed text-muted">{a}</p></details>)}</div>
      </section>

      <aside className="mb-12 border-l-2 border-gold bg-panel p-6">
        <h2 className="font-display text-xl uppercase text-paper">University policy & final event arrangements</h2>
        <p className="mt-3 leading-relaxed text-muted">This page addresses costume props and does not replace university policy or determine legal carry permissions. ESU’s official weapons policy applies independently. Final event screening, vendor restrictions and any exceptions require coordination with the venue and authorized security team.</p>
        <a href="https://www.emporia.edu/university-policy-manual/table-of-contents/campus-and-facilities/weapons-possession/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center font-semibold text-cyan underline underline-offset-4">Read ESU’s official weapons policy ↗<span className="sr-only"> (opens in a new tab)</span></a>
      </aside>

      <div className="border border-line bg-panel p-6 sm:p-8">
        <h2 className="font-display text-2xl uppercase tracking-wide">Not sure about your build?</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Reach out before attending and tell us what the item is made of, its approximate dimensions and weight, any internal support materials, and whether it moves,
          lights up or makes noise. We can discuss likely concerns, but final admission depends on the approved event policy.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex min-h-11 items-center bg-magenta px-5 py-3 font-display text-sm uppercase tracking-widest text-ink">Ask about a prop</Link>
          <Link href="/cosplay" className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-widest text-cyan">Cosplay info</Link>
          <Link href="/first-timers-guide" className="inline-flex min-h-11 items-center border border-line px-5 py-3 font-display text-sm uppercase tracking-widest text-paper">First-timer&apos;s guide</Link>
          <Link href="/code-of-conduct" className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-widest text-cyan">Code of Conduct</Link>
        </div>
      </div>
    </InnerPage>
  );
}
