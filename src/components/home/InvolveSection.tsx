import { TicketCta } from "@/components/cta/TicketCta";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isTicketSalesOpen } from "@/lib/tickets";

const paths = [
  {
    eyebrow: "Attendees",
    title: "Join the weekend",
    body: "Ticket types and prices are posted. Online checkout is being finalized. Join the list so you hear when purchase goes live.",
    primary: "tickets" as const,
    secondary: { href: "/#updates", label: "Join Updates", variant: "secondary" as const },
  },
  {
    eyebrow: "Vendors",
    title: "Sell on the floor",
    body: "Official applications are not open. Register interest so we can notify you when they are.",
    primary: { href: "/vendors/interest", label: "Vendor Interest" },
    secondary: { href: "/vendors", label: "Vendors", variant: "secondary" as const },
  },
  {
    eyebrow: "Sponsors",
    title: "Partner with the fest",
    body: "Packages are still in progress. An inquiry is not a sponsorship agreement.",
    primary: { href: "/sponsors/inquiry", label: "Sponsor Inquiry" },
    secondary: { href: "/sponsors", label: "Sponsors", variant: "secondary" as const },
  },
  {
    eyebrow: "Creators / Guests",
    title: "Appear at Midwest Pixel Fest",
    body: "For creators, streamers, artists, performers, and community talent. Submission is not a booking.",
    primary: { href: "/guests/inquiry", label: "Guest Inquiry" },
    secondary: { href: "/guests", label: "Guests", variant: "secondary" as const },
  },
  {
    eyebrow: "Volunteers",
    title: "Help run the show",
    body: "This is interest only — not a shift assignment. Selection is not guaranteed.",
    primary: { href: "/volunteer/interest", label: "Volunteer Interest" },
    secondary: { href: "/volunteer", label: "Volunteer", variant: "secondary" as const },
  },
];

export function InvolveSection() {
  const salesOpen = isTicketSalesOpen();

  return (
    <section className="border-b border-line py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Get involved"
          title="Pick a path."
          description="Attendees, vendors, sponsors, guests, and volunteers each have a dedicated next step."
          tone="cyan"
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paths.map((item) => (
            <li key={item.eyebrow} className="flex h-full flex-col border border-line bg-panel p-6 sm:p-8">
              <p className="font-pixel text-[11px] uppercase tracking-[0.2em] text-gold">
                {item.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-2xl uppercase tracking-wide">
                {item.title}
              </h2>
              <p className="mt-3 flex-1 text-muted">{item.body}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {item.primary === "tickets" ? (
                  <TicketCta intent={salesOpen ? "purchase" : "nav"} />
                ) : (
                  <Button href={item.primary.href}>{item.primary.label}</Button>
                )}
                <Button
                  href={item.secondary.href}
                  variant={item.secondary.variant}
                >
                  {item.secondary.label}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
