import { SectionHeading } from "@/components/ui/SectionHeading";
import { vendorFaqs } from "@/lib/vendors";

export function VendorFaq() {
  return (
    <section
      id="vendor-faq"
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="vendor-faq-heading"
    >
      <SectionHeading
        id="vendor-faq-heading"
        eyebrow="Questions"
        title="Vendor FAQ"
        description="What we can confirm now, and what will be published with official applications."
        tone="cyan"
      />
      <div className="mt-10 divide-y divide-line border border-line bg-panel">
        {vendorFaqs.map((item) => (
          <details key={item.question} className="group p-6 open:bg-panel-2">
            <summary className="cursor-pointer list-none py-1 marker:text-magenta">
              <h3 className="inline min-h-11 font-display text-xl uppercase tracking-wide sm:text-2xl">
                {item.question}
              </h3>
            </summary>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
