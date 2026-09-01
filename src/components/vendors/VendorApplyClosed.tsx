import { EventCta } from "@/components/cta/EventCta";
import { InnerPage } from "@/components/pages/InnerPage";
import { Badge } from "@/components/ui/Badge";
import {
  artistAlleyApplicationsAreOpen,
  officialArtistApplyPath,
  officialVendorApplyPath,
  vendorHallApplicationsAreOpen,
} from "@/lib/vendors";

type VendorApplyClosedProps = {
  variant?: "all" | "vendor" | "artist";
};

const COPY = {
  all: {
    title: "Vendor Applications Are Not Open Yet",
    body: "Official Midwest Pixel Fest 2027 Vendor Hall and Artist Alley applications are being prepared.",
  },
  vendor: {
    title: "Vendor Hall Applications Are Not Open Yet",
    body: "Official Midwest Pixel Fest 2027 Vendor Hall applications are being prepared.",
  },
  artist: {
    title: "Artist Alley Applications Are Not Open Yet",
    body: "Official Midwest Pixel Fest 2027 Artist Alley applications are being prepared.",
  },
} as const;

export function VendorApplyClosed({ variant = "all" }: VendorApplyClosedProps) {
  const copy = COPY[variant];
  const otherOpen =
    variant === "vendor"
      ? artistAlleyApplicationsAreOpen()
      : variant === "artist"
        ? vendorHallApplicationsAreOpen()
        : false;

  return (
    <InnerPage
      path={
        variant === "vendor"
          ? officialVendorApplyPath
          : variant === "artist"
            ? officialArtistApplyPath
            : "/vendors/apply"
      }
      breadcrumbLabel="Apply"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Vendors", path: "/vendors" },
        { name: "Apply" },
      ]}
      eyebrow="Applications"
      title={copy.title}
      intro={copy.body}
      mood="business"
    >
      <section
        className="border border-gold/50 bg-panel p-6 sm:p-8"
        aria-labelledby="vendor-apply-closed-heading"
      >
        <Badge tone="gold">Not open yet</Badge>
        <h2
          id="vendor-apply-closed-heading"
          className="mt-5 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl"
        >
          {copy.title}
        </h2>
        <p className="mt-4 max-w-2xl text-muted">{copy.body}</p>
        <p className="mt-4 max-w-2xl text-muted">
          Register vendor interest to be notified when official applications
          launch. There is no application fee, and registering interest does not
          reserve a booth.
        </p>
        <div className="mt-8 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <EventCta
            href="/vendors/interest"
            label="Register Vendor Interest"
            className="w-full sm:w-auto"
          />
          {otherOpen ? (
            <EventCta
              href={
                variant === "vendor"
                  ? officialArtistApplyPath
                  : officialVendorApplyPath
              }
              label={
                variant === "vendor"
                  ? "Apply for Artist Alley"
                  : "Apply for Vendor Hall"
              }
              variant="secondary"
              className="w-full sm:w-auto"
            />
          ) : null}
          <EventCta
            href="/vendors"
            label="Return to Vendor Info"
            variant="secondary"
            className="w-full sm:w-auto"
          />
        </div>
      </section>
    </InnerPage>
  );
}
