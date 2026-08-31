import type { Metadata } from "next";
import { TicketCta } from "@/components/cta/TicketCta";
import { EmailSignup } from "@/components/home/EmailSignup";
import { InnerPage } from "@/components/pages/InnerPage";
import { Badge } from "@/components/ui/Badge";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { getTicketAction, isTicketSalesOpen } from "@/lib/tickets";

export const metadata: Metadata = createPageMetadata({
  title: "Tickets | Midwest Pixel Fest",
  description:
    "Midwest Pixel Fest tickets for the 2027 Emporia, Kansas convention. Sales are not live yet. Join the list to be notified when badge types and pricing are announced.",
  path: "/tickets",
});

const ticketCategories = [
  {
    name: "Weekend Pass",
    note: "A planned all-weekend option. Details coming soon.",
  },
  {
    name: "Saturday Pass",
    note: "A planned Saturday option. Details coming soon.",
  },
  {
    name: "Sunday Pass",
    note: "A planned Sunday option. Details coming soon.",
  },
  {
    name: "Youth / Family Options",
    note: "Family-friendly options are being considered. Details coming soon.",
  },
];

export default function TicketsPage() {
  const salesOpen = isTicketSalesOpen();
  const purchase = getTicketAction("purchase");

  return (
    <InnerPage
      path="/tickets"
      breadcrumbLabel="Tickets"
      eyebrow="Tickets coming soon"
      title="Midwest Pixel Fest Tickets"
      intro={`${site.name} is planned for ${site.year} in ${site.location}. Ticket types and pricing will be announced after final event details are confirmed. Join the update list to be notified first.`}
      after={<EmailSignup />}
    >
      <div className="border border-gold/40 bg-panel p-8">
        <Badge tone="gold">Tickets coming soon</Badge>
        <h2 className="mt-5 font-display text-4xl uppercase tracking-wide">
          {salesOpen ? "Tickets are on sale" : "Sales are not live yet"}
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          {salesOpen
            ? "Checkout opens in a new tab. Badge policies will be posted with the on-sale announcement."
            : "Nothing is for sale on this page yet. There is no waitlist fee and no account required to join updates."}
        </p>
        <div className="mt-8">
          <TicketCta intent="purchase" size="lg" />
        </div>
      </div>

      <ContentSection title="Planned ticket categories">
        <p>
          The categories below are placeholders so attendees can see the shape of
          a weekend badge mix. They are not a final product list, and none of
          them are guaranteed until sales are announced.
        </p>
      </ContentSection>

      <ul className="grid gap-4 sm:grid-cols-2">
        {ticketCategories.map((item) => (
          <li key={item.name} className="border border-line bg-panel p-6 sm:p-8">
            <h2 className="font-display text-2xl uppercase tracking-wide">
              {item.name}
            </h2>
            <p className="mt-3 font-pixel text-[11px] uppercase tracking-[0.18em] text-gold">
              Details coming soon
            </p>
            <p className="mt-3 text-muted">{item.note}</p>
          </li>
        ))}
      </ul>

      <div id="checkout" className="mt-10 border border-cyan/30 bg-panel p-8">
        <p className="font-pixel text-[11px] uppercase tracking-[0.2em] text-cyan">
          Checkout
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide">
          {purchase.external ? "Buy tickets" : "Ticket checkout"}
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          {purchase.external
            ? "Secure checkout opens in a new tab. Midwest Pixel Fest does not process card details on this website."
            : "When ticket sales open, this is where the public checkout link will live. One site setting controls every Get Tickets / Buy Tickets button."}
        </p>
        <div className="mt-8">
          <TicketCta intent="purchase" size="lg" />
        </div>
      </div>

      <RelatedLinks
        heading="Keep planning"
        links={[
          { href: "/gaming", label: "Explore Gaming" },
          { href: "/cosplay", label: "Cosplay" },
          { href: "/travel", label: "Travel" },
          { href: "/faq", label: "FAQ" },
          { href: "/news", label: "Latest News" },
          { href: "/contact", label: "Contact" },
        ]}
      />
    </InnerPage>
  );
}
