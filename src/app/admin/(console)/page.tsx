import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { countSponsorStatuses } from "@/lib/persistence/sponsors";
import { countVendorInterests, countVendorStatuses } from "@/lib/persistence/vendors";

function Card({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link href={href} className="border border-line bg-panel p-5 hover:border-cyan">
      <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 font-display text-4xl text-paper">{value}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <p className="text-magenta">Your session expired. Sign in again.</p>;
  }

  let vendorCounts: Record<string, number> = {};
  let sponsorCounts: Record<string, number> = {};
  let interestCount = 0;
  try {
    [vendorCounts, sponsorCounts, interestCount] = await Promise.all([
      countVendorStatuses(supabase),
      countSponsorStatuses(supabase),
      countVendorInterests(supabase),
    ]);
  } catch {
    return (
      <p className="text-magenta">
        The organizer database is unavailable. Try again in a few minutes.
      </p>
    );
  }

  const awaitingVendor =
    (vendorCounts.approved ?? 0) + (vendorCounts.invoice_sent ?? 0);
  const awaitingSponsor =
    (sponsorCounts.invoice_created ?? 0) + (sponsorCounts.invoice_sent ?? 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wide">Dashboard</h1>
        <p className="mt-2 text-muted">Live counts from the organizer database. Empty pipelines show zero.</p>
      </div>
      <section>
        <h2 className="font-display text-2xl uppercase tracking-wide">Vendor pipeline</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card label="Vendor interests" value={interestCount} href="/admin/vendor-interests" />
          <Card label="New applications" value={vendorCounts.submitted ?? 0} href="/admin/vendors?filter=new" />
          <Card label="Under review" value={vendorCounts.under_review ?? 0} href="/admin/vendors?filter=under_review" />
          <Card label="Approved" value={vendorCounts.approved ?? 0} href="/admin/vendors?filter=approved" />
          <Card label="Awaiting payment" value={awaitingVendor} href="/admin/vendors?filter=awaiting_payment" />
          <Card label="Confirmed" value={vendorCounts.confirmed ?? 0} href="/admin/vendors?filter=confirmed" />
          <Card label="Waitlisted" value={vendorCounts.waitlisted ?? 0} href="/admin/vendors?filter=waitlisted" />
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl uppercase tracking-wide">Sponsor pipeline</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card label="New inquiries" value={sponsorCounts.inquiry_received ?? 0} href="/admin/sponsor-inquiries" />
          <Card label="Contacted" value={sponsorCounts.contacted ?? 0} href="/admin/sponsors?filter=contacted" />
          <Card label="Negotiating" value={sponsorCounts.negotiating ?? 0} href="/admin/sponsors?filter=negotiating" />
          <Card label="Committed" value={sponsorCounts.committed ?? 0} href="/admin/sponsors?filter=committed" />
          <Card label="Awaiting payment" value={awaitingSponsor} href="/admin/sponsors?filter=awaiting_payment" />
          <Card label="Paid" value={sponsorCounts.paid ?? 0} href="/admin/sponsors?filter=paid" />
          <Card label="Assets needed" value={sponsorCounts.assets_needed ?? 0} href="/admin/sponsors?filter=assets_needed" />
          <Card label="Active" value={sponsorCounts.active ?? 0} href="/admin/sponsors?filter=active" />
        </div>
      </section>
    </div>
  );
}
