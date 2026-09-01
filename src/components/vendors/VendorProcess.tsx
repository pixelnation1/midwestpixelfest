import { SectionHeading } from "@/components/ui/SectionHeading";
import { vendorApplicationSteps } from "@/lib/vendors";

export function VendorProcess() {
  return (
    <section
      id="how-applications-work"
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="vendor-process-heading"
    >
      <SectionHeading
        id="vendor-process-heading"
        eyebrow="Process"
        title="How vendor applications will work"
        description="Vendor and Artist Alley applications are free to submit. Registering interest does not guarantee acceptance, reserve a booth, require payment, or create a contract. After applications open, an approved space is confirmed only after payment is received."
        tone="magenta"
      />
      <ol className="mt-10 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {vendorApplicationSteps.map((item) => (
          <li
            key={item.step}
            className="min-w-0 border border-line bg-panel p-6 sm:p-8"
          >
            <p className="font-pixel text-[11px] uppercase tracking-[0.18em] text-gold">
              {item.step}
            </p>
            <h3 className="mt-3 font-display text-xl uppercase tracking-wide text-paper sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
