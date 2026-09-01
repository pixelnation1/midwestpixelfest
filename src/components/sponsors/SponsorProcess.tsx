import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  sponsorshipCommitmentFormUrl,
  sponsorshipProcessSteps,
} from "@/lib/sponsorships";
import { Button } from "@/components/ui/Button";

export function SponsorProcess() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="process-heading"
    >
      <SectionHeading
        id="process-heading"
        eyebrow="Process"
        title="How sponsorship works"
        description="The website form expresses interest. Clicking a sponsorship tier or submitting an inquiry does not create a contract. After an inquiry is approved, the organizer can send the formal Sponsorship Commitment Form."
        tone="cyan"
      />
      <ol className="mt-10 grid gap-4">
        {sponsorshipProcessSteps.map((item) => (
          <li
            key={item.step}
            className="grid gap-4 border border-line bg-panel p-6 sm:grid-cols-[auto_1fr] sm:items-start sm:p-8"
          >
            <p className="font-pixel text-[11px] uppercase tracking-[0.18em] text-gold">
              Step {item.step}
            </p>
            <div>
              <h3 className="font-display text-xl uppercase tracking-wide text-paper sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-muted">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
      {sponsorshipCommitmentFormUrl ? (
        <div className="mt-8">
          <Button
            href={sponsorshipCommitmentFormUrl}
            external={sponsorshipCommitmentFormUrl.startsWith("http")}
            variant="secondary"
          >
            Download Sponsorship Commitment Form
          </Button>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            New sponsors should still start with the inquiry form. The commitment
            form is the later paperwork after Midwest Pixel Fest accepts a
            partnership.
          </p>
        </div>
      ) : null}
    </section>
  );
}
