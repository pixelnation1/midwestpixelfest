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
    "FAQ for Midwest Pixel Fest 2027 in Emporia, Kansas: October 16–17 dates, ticket prices, family policy, gaming, cosplay, vendors, sponsors, volunteers, hotels, and accessibility.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <InnerPage
      path="/faq"
      breadcrumbLabel="FAQ"
      eyebrow="Questions"
      title="FAQ"
      intro="Our planned venue is Webb Hall at Emporia State University. The reservation is pending final agreement, while ticket prices and event dates are already published. Find the current answers here."
      after={<EmailSignup />}
    >
      <JsonLd data={buildFaqPageJsonLd()} />
      <div className="divide-y divide-line border border-line bg-panel">
        {faqs.map((item) => (
          <details key={item.question} className="group p-6 open:bg-panel-2">
            <summary className="cursor-pointer list-none py-1 marker:text-magenta">
              <h2 className="inline min-h-11 font-display text-xl uppercase tracking-wide sm:text-2xl">
                {item.question}
              </h2>
            </summary>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
      <RelatedLinks
        links={[
          { href: "/info", label: "Attendee Information" },
          { href: "/first-timers-guide", label: "First-Timer's Guide" },
          { href: "/attendee-services", label: "Attendee Services & Accessibility" },
          { href: "/weapons-policy", label: "Weapons & Props Policy" },
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
