import Link from "next/link";
import { formatAdminDate, money } from "@/lib/admin/time";
import { listSponsorships } from "@/lib/persistence/sponsors";
import { listVendorApplications } from "@/lib/persistence/vendors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatSpaceLabel } from "@/lib/vendor-ops/pricing";
import type { VendorSpaceId } from "@/lib/vendors";

export default async function PaymentsPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <p>Sign in again.</p>;

  let vendors = [];
  let sponsors = [];
  try {
    vendors = await listVendorApplications(supabase, { filter: "awaiting_payment" });
    const overdue = await listVendorApplications(supabase, { filter: "overdue" });
    vendors = [...vendors, ...overdue];
    sponsors = await listSponsorships(supabase, { filter: "awaiting_payment" });
  } catch {
    return <p className="text-magenta">The organizer database is unavailable.</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wide">Payments / Offers</h1>
        <p className="mt-2 text-muted">
          Square Invoices are recorded manually. This website does not collect cards.
        </p>
      </div>
      <section>
        <h2 className="font-display text-2xl uppercase tracking-wide">Vendor offers</h2>
        {vendors.length === 0 ? (
          <p className="mt-4 border border-line bg-panel p-5 text-muted">No vendor offers awaiting payment.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {vendors.map((row) => (
              <li key={row.id} className="border border-line bg-panel p-4">
                <Link href={`/admin/vendors/${row.reference}`} className="text-cyan underline-offset-2 hover:underline">
                  {row.business_name}
                </Link>
                <p className="text-sm text-muted">
                  {row.reference} · {row.vendor_offers ? formatSpaceLabel(row.vendor_offers.offered_space as VendorSpaceId) : "—"} ·{" "}
                  {money(row.vendor_offers?.total)} · due {formatAdminDate(row.vendor_offers?.payment_due_at ?? null)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="font-display text-2xl uppercase tracking-wide">Sponsorship invoices</h2>
        {sponsors.length === 0 ? (
          <p className="mt-4 border border-line bg-panel p-5 text-muted">No sponsorship invoices awaiting payment.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {sponsors.map((row) => (
              <li key={row.id} className="border border-line bg-panel p-4">
                <Link href={`/admin/sponsors/${row.reference}`} className="text-cyan underline-offset-2 hover:underline">
                  {row.business_name}
                </Link>
                <p className="text-sm text-muted">
                  {row.reference} · {money(row.amount_committed)} · {row.invoice_status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
