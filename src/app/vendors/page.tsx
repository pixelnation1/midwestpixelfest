import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmailSignup } from "@/components/home/EmailSignup";
import { InnerPage } from "@/components/pages/InnerPage";

export const metadata: Metadata = {
  title: "Vendors",
  description:
    "Vendor and artist applications for Midwest Pixel Fest in Emporia, Kansas.",
};

export default function VendorsPage() {
  return (
    <InnerPage
      eyebrow="Sell at the fest"
      title="Vendors & artists"
      intro="Applications are not open yet. When they are, this page is the official place to apply for vendor hall and artist alley space."
      after={<EmailSignup />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <article className="border border-line bg-panel p-8">
          <Badge tone="gold">Coming soon</Badge>
          <h2 className="mt-5 font-display text-3xl uppercase tracking-wide">
            Vendor application
          </h2>
          <p className="mt-4 text-muted">
            Built for shops, collectible sellers, game retailers, and specialty
            booths. Rates, booth sizes, and load-in details will be included
            when the form opens.
          </p>
          <p className="mt-6 font-display text-sm uppercase tracking-[0.16em] text-muted">
            Application not yet available
          </p>
        </article>
        <article id="artists" className="border border-line bg-panel p-8">
          <Badge tone="gold">Coming soon</Badge>
          <h2 className="mt-5 font-display text-3xl uppercase tracking-wide">
            Artist application
          </h2>
          <p className="mt-4 text-muted">
            Artist alley is for original work: prints, zines, crafts, and
            commissions. Table maps and display rules will post with the
            application.
          </p>
          <p className="mt-6 font-display text-sm uppercase tracking-[0.16em] text-muted">
            Application not yet available
          </p>
        </article>
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
        <Button href="/sponsors" variant="secondary">
          Looking to sponsor?
        </Button>
      </div>
    </InnerPage>
  );
}
