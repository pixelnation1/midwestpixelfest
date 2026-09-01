import type { Metadata } from "next";
import { TicketCta } from "@/components/cta/TicketCta";
import { EmailSignup } from "@/components/home/EmailSignup";
import { EventInfoPanel } from "@/components/retro/EventInfoPanel";
import { PassCard } from "@/components/retro/PassCard";
import { InnerPage } from "@/components/pages/InnerPage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { site, ticketProducts } from "@/lib/site";
import { isTicketSalesOpen } from "@/lib/tickets";

const salesOpen = isTicketSalesOpen();

export const metadata: Metadata = createPageMetadata({
  title: "Tickets | Midwest Pixel Fest 2027",
  description: salesOpen
    ? "Get Midwest Pixel Fest 2027 tickets for October 16–17 in Emporia, Kansas. Weekend $30, Saturday $20, Sunday $15, kids 12 and under free with a paid adult."
    : "Midwest Pixel Fest 2027 tickets for October 16–17 in Emporia, Kansas. Weekend $30, Saturday $20, Sunday $15, kids 12 and under free with a paid adult. Online checkout is being finalized.",
  path: "/tickets",
});

export default function TicketsPage() {
  return (
    <InnerPage
      path="/tickets"
      breadcrumbLabel="Tickets"
      eyebrow="Admission"
      title="Midwest Pixel Fest Tickets"
      intro={`${site.dateLongLabel}. ${site.venueLabel}.`}
      after={<EmailSignup />}
    >
      <EventInfoPanel className="mb-8" compact />

      <div className="border border-gold/40 bg-panel p-6 sm:p-8">
        <Badge tone="gold">
          {salesOpen ? "On sale" : "Online checkout being finalized"}
        </Badge>
        <h2 className="mt-5 font-display text-3xl uppercase tracking-wide sm:text-4xl">
          {salesOpen ? "Get tickets" : "Prices are posted. Checkout is next."}
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          {salesOpen
            ? "Weekend, Saturday, Sunday, and kids prices are below. Checkout opens in a new tab on Ticketleap. Midwest Pixel Fest does not process card details on this website."
            : "Weekend, Saturday, Sunday, and kids prices for Midwest Pixel Fest 2027 are below. Online checkout is being finalized. Join the list to hear when purchase goes live."}
        </p>
        <div className="mt-8">
          {salesOpen ? (
            <TicketCta intent="purchase" size="lg" source="tickets_page" />
          ) : (
            <Button href="#updates" size="lg">
              Join the List
            </Button>
          )}
        </div>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {ticketProducts.map((item) => (
          <li key={item.id} className={item.id === "weekend" ? "sm:col-span-2 lg:col-span-1" : undefined}>
            <PassCard
              name={item.name}
              priceLabel={item.priceLabel}
              description={item.description}
              featured={item.id === "weekend"}
            />
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-2xl text-sm text-muted">
        Ticketleap service and transaction fees may apply at checkout.
      </p>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Ticket availability and event capacity are subject to venue limits.
      </p>

      <RelatedLinks
        heading="Keep planning"
        links={[
          { href: "/faq", label: "FAQ" },
          { href: "/travel", label: "Travel" },
          { href: "/gaming", label: "Gaming" },
          { href: "/cosplay", label: "Cosplay" },
          { href: "/news", label: "Latest News" },
          { href: "/contact", label: "Contact" },
        ]}
      />
    </InnerPage>
  );
}
