import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo";
import { faqs } from "@/lib/site";
import { buildFaqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Midwest Pixel Fest FAQ | Tickets, Cosplay, Vendors & More",
  description:
    "Answers about Midwest Pixel Fest tickets, dates, cosplay, vendors, travel, and who is organizing the Emporia, Kansas convention.",
  path: "/faq",
});

const relatedPages = [
  { href: "/tickets", label: "Tickets" },
  { href: "/vendors", label: "Vendors" },
  { href: "/cosplay", label: "Cosplay" },
  { href: "/travel", label: "Travel" },
  { href: "/schedule", label: "Schedule" },
  { href: "/guests", label: "Guests" },
];

export default function FaqPage() {
  return (
    <InnerPage
      path="/faq"
      breadcrumbLabel="FAQ"
      eyebrow="Questions"
      title="FAQ"
      intro="Dates are still to be announced, but these are the questions we hear most. Check back as tickets, venue, and programming lock in."
    >
      <JsonLd data={buildFaqPageJsonLd()} />
      <div className="divide-y divide-line border border-line bg-panel">
        {faqs.map((item) => (
          <details key={item.question} className="group p-6 open:bg-panel-2">
            <summary className="cursor-pointer list-none marker:text-magenta">
              <h2 className="inline font-display text-2xl uppercase tracking-wide">
                {item.question}
              </h2>
            </summary>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
      <nav aria-label="Related pages" className="mt-12">
        <h2 className="font-display text-xl uppercase tracking-wide">Related pages</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {relatedPages.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="border border-line px-3 py-2 font-display text-sm uppercase tracking-[0.14em] text-muted transition-colors hover:border-cyan hover:text-cyan"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </InnerPage>
  );
}
