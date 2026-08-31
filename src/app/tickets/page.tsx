import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { EmailSignup } from "@/components/home/EmailSignup";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Tickets | Midwest Pixel Fest",
  description:
    "Midwest Pixel Fest badges are not on sale yet. Join the list for the on-sale window, pricing, and badge types for the Emporia, Kansas convention.",
  path: "/tickets",
});

export default function TicketsPage() {
  return (
    <InnerPage
      path="/tickets"
      breadcrumbLabel="Tickets"
      eyebrow="Badges"
      title="Get tickets"
      intro={`${site.dateLabel}. Weekend badges, day badges, and special access options will be posted here when sales open. Nothing is for sale yet.`}
      after={<EmailSignup />}
    >
      <div className="border border-line bg-panel p-8">
        <Badge tone="gold">On sale later</Badge>
        <h2 className="mt-5 font-display text-4xl uppercase tracking-wide">
          Tickets are not on sale yet
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Join the list so you get the on-sale window, pricing, and badge types
          as soon as they are public. There is no waitlist fee and no account
          required.
        </p>
      </div>
    </InnerPage>
  );
}
