import type { Metadata } from "next";
import { EmailSignup } from "@/components/home/EmailSignup";
import { InnerPage } from "@/components/pages/InnerPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { faqs } from "@/lib/site";
import { buildFaqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Midwest Pixel Fest FAQ | Tickets, Cosplay, Vendors & More",
  description:
    "FAQ for Midwest Pixel Fest in Emporia, Kansas: dates, tickets, family policy, tournaments, TCGs, cosplay, vendors, sponsors, volunteers, hotels, parking, and accessibility.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <InnerPage
      path="/faq"
      breadcrumbLabel="FAQ"
      eyebrow="Questions"
      title="FAQ"
      intro="Dates, venue, and a lot of policy are still to be announced. These are the questions we hear most — answered with what we can actually stand behind today."
      after={<EmailSignup />}
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
      <RelatedLinks
        links={[
          { href: "/tickets", label: "Tickets" },
          { href: "/vendors", label: "Vendors" },
          { href: "/cosplay", label: "Cosplay" },
          { href: "/travel", label: "Travel" },
          { href: "/volunteer", label: "Volunteer" },
          { href: "/sponsors", label: "Sponsors" },
          { href: "/about", label: "About" },
          { href: "/news", label: "News" },
        ]}
      />
    </InnerPage>
  );
}
