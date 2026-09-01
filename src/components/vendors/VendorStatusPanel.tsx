import { EventCta } from "@/components/cta/EventCta";
import { Badge } from "@/components/ui/Badge";
import {
  getVendorPrimaryCta,
  vendorApplicationsAreOpen,
} from "@/lib/vendors";

export function VendorStatusPanel() {
  const cta = getVendorPrimaryCta();
  const open = vendorApplicationsAreOpen();

  return (
    <section
      id="vendor-status"
      className="scroll-mt-24 border border-gold/50 bg-panel p-6 sm:p-8"
      aria-labelledby="vendor-status-heading"
    >
      <Badge tone="gold">Vendor application status</Badge>
      <p
        id="vendor-status-heading"
        className="mt-5 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl"
      >
        {open ? "Applications open" : "Not open yet"}
      </p>
      <p className="mt-4 max-w-2xl text-muted">
        {open
          ? "Official vendor and Artist Alley applications for Midwest Pixel Fest 2027 are available."
          : "Applications for Midwest Pixel Fest 2027 are being prepared. Register your interest now to be notified when applications open."}
      </p>
      <div className="mt-6">
        <EventCta
          href={cta.href}
          label={cta.label}
          className="w-full sm:w-auto"
          external={cta.external}
        />
      </div>
    </section>
  );
}
