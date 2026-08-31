import type { Metadata } from "next";
import { InnerPage } from "@/components/pages/InnerPage";
import { faqs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ${site.name} in ${site.location}.`,
};

export default function FaqPage() {
  return (
    <InnerPage
      eyebrow="Questions"
      title="FAQ"
      intro="Dates are still to be announced, but these are the questions we hear most. Check back as tickets, venue, and programming lock in."
    >
      <div className="divide-y divide-line border border-line bg-panel">
        {faqs.map((item) => (
          <details key={item.question} className="group p-6 open:bg-panel-2">
            <summary className="cursor-pointer font-display text-2xl uppercase tracking-wide marker:text-magenta">
              {item.question}
            </summary>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </InnerPage>
  );
}
