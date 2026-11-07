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
      eyebrow="Info / Convention safety"
      title="Weapons & Props Policy"
      intro="Bring the creativity. Leave the danger behind. These are our preliminary cosplay prop safety expectations for Midwest Pixel Fest 2027."
    >
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

      <section className="mb-12" aria-labelledby="leave-at-home">
        <p className="font-pixel text-[11px] uppercase tracking-[.16em] text-magenta">Not permitted as costume props</p>
        <h2 id="leave-at-home" className="mt-2 font-display text-3xl uppercase tracking-wide text-paper">
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

      <section className="mb-12 border border-cyan/30 bg-ink-2 p-6 sm:p-8" aria-labelledby="safe-props">
        <p className="font-pixel text-[11px] uppercase tracking-[.16em] text-cyan">Plan your costume</p>
        <h2 id="safe-props" className="mt-2 font-display text-3xl uppercase tracking-wide text-paper">
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

      <section className="mb-12" aria-labelledby="how-checking-works">
        <h2 id="how-checking-works" className="font-display text-3xl uppercase tracking-wide text-paper">
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

      <div className="border border-line bg-panel p-6 sm:p-8">
        <h2 className="font-display text-2xl uppercase tracking-wide">Not sure about your build?</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Reach out before attending and tell us what the item is made of, its approximate dimensions, and whether it moves,
          lights up or makes noise. We can discuss likely concerns, but final admission depends on the approved event policy.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex min-h-11 items-center bg-magenta px-5 py-3 font-display text-sm uppercase tracking-widest text-ink">Ask about a prop</Link>
          <Link href="/cosplay" className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-widest text-cyan">Cosplay info</Link>
          <Link href="/first-timers-guide" className="inline-flex min-h-11 items-center border border-line px-5 py-3 font-display text-sm uppercase tracking-widest text-paper">First-timer&apos;s guide</Link>
        </div>
      </div>
    </InnerPage>
  );
}
