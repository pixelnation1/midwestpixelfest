import type { Metadata } from "next";
import { TicketCta } from "@/components/cta/TicketCta";
import { EmailSignup } from "@/components/home/EmailSignup";
import { InnerPage } from "@/components/pages/InnerPage";
import { Badge } from "@/components/ui/Badge";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { site, ticketProducts } from "@/lib/site";
import { getTicketAction, isTicketSalesOpen } from "@/lib/tickets";

export const metadata: Metadata = createPageMetadata({
  title: "Tickets | Midwest Pixel Fest 2027",
  description:
    "Midwest Pixel Fest 2027 tickets for October 16–17 in Emporia, Kansas. Weekend $30, Saturday $20, Sunday $15, kids 12 and under free with a paid adult. Online checkout is being finalized.",
  path: "/tickets",
});

export default function TicketsPage() {
  const salesOpen = isTicketSalesOpen();
  const purchase = getTicketAction("purchase");

  return (
    <InnerPage
      path="/tickets"
      breadcrumbLabel="Tickets"
      eyebrow="Admission"
      title="Midwest Pixel Fest Tickets"
      intro={`${site.name} — ${site.dateLabel} in ${site.location}. ${site.venueLabel}.`}
      after={<EmailSignup />}
    >
      <div className="border border-gold/40 bg-panel p-6 sm:p-8">
        <Badge tone="gold">
          {salesOpen ? "On sale" : "Online checkout being finalized"}
        </Badge>
        <h2 className="mt-5 font-display text-3xl uppercase tracking-wide sm:text-4xl">
          {salesOpen ? "Buy tickets" : "Prices are set. Checkout is next."}
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          {salesOpen
            ? "Secure checkout opens in a new tab. Midwest Pixel Fest does not process card details on this website."
            : "Ticket types and prices below are the working public prices for Midwest Pixel Fest 2027. Online checkout is being finalized. Join the list so you hear when purchase goes live."}
        </p>
        <div className="mt-8">
          <TicketCta intent="purchase" size="lg" />
        </div>
      </div>

      <ContentSection title="Ticket types">
        <p>
          These badges are for Midwest Pixel Fest 2027, October 16–17, in
          Emporia, Kansas. Venue details are coming soon.
        </p>
      </ContentSection>

      <ul className="grid gap-4 sm:grid-cols-2">
        {ticketProducts.map((item) => (
          <li key={item.id} className="flex h-full flex-col border border-line bg-panel p-6 sm:p-8">
            <h2 className="font-display text-2xl uppercase tracking-wide">
              {item.name}
            </h2>
            <p className="mt-3 font-pixel text-lg uppercase tracking-[0.14em] text-gold">
              {item.priceLabel}
            </p>
            <p className="mt-3 flex-1 text-muted">{item.description}</p>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-2xl text-sm text-muted">
        Ticket availability and event capacity are subject to venue limits.
      </p>

      <div id="checkout" className="mt-10 border border-cyan/30 bg-panel p-6 sm:p-8">
        <p className="font-pixel text-[11px] uppercase tracking-[0.2em] text-cyan">
          Checkout
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide">
          {purchase.external ? "Buy tickets" : "Online checkout"}
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          {purchase.external
            ? "Checkout opens in a new tab."
            : "The public checkout link will live here. One site setting controls every Tickets button on the site."}
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
