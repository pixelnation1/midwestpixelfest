import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type EmailSignupProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function EmailSignup({
  eyebrow = "Stay in the loop",
  title = "Don't miss the next announcement",
  description = "Dates, guests, tickets, and applications will hit this list first. No spam — just the drops that matter.",
}: EmailSignupProps) {
  return (
    <section id="updates" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,45,149,0.16),transparent_60%)]" />
      <Container className="relative">
        <div className="border border-magenta/40 bg-panel px-6 py-12 sm:px-12">
          <SectionHeading
            align="center"
            eyebrow={eyebrow}
            title={title}
            description={description}
            tone="magenta"
          />
          <div className="mx-auto mt-10 max-w-xl">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
