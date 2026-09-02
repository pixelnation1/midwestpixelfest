import Link from "next/link";
import { StatusPill } from "@/components/admin/StatusPill";
import { formatAdminDateTime, money } from "@/lib/admin/time";
import { listVendorApplications } from "@/lib/persistence/vendors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  VENDOR_APPLICATION_STATUS_LABELS,
  VENDOR_REVIEW_FILTERS,
  type VendorReviewFilterId,
} from "@/lib/vendor-ops/status";
import { formatSpaceLabel } from "@/lib/vendor-ops/pricing";
import type { VendorSpaceId } from "@/lib/vendors";

export default async function VendorApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const params = await searchParams;
  const filter = (VENDOR_REVIEW_FILTERS.some((item) => item.id === params.filter)
    ? params.filter
    : "all") as VendorReviewFilterId;
  const q = params.q ?? "";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <p>Sign in again.</p>;

  let rows = [];
  try {
    rows = await listVendorApplications(supabase, { filter, q });
  } catch {
    return <p className="text-magenta">The organizer database is unavailable.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-wide">Vendor applications</h1>
      <form className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row">
        <select name="filter" defaultValue={filter} className="border border-line bg-ink px-3 py-2">
          {VENDOR_REVIEW_FILTERS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search business, contact, or reference"
          className="min-w-0 flex-1 border border-line bg-ink px-3 py-2"
        />
        <button type="submit" className="border border-cyan px-4 py-2 text-cyan">
          Filter
        </button>
      </form>
      {rows.length === 0 ? (
        <p className="mt-8 border border-line bg-panel p-6 text-muted">No vendor applications yet.</p>
      ) : (
        <>
          <div className="mt-6 hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="p-2">Reference</th>
                  <th className="p-2">Business / Artist</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Requested</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Submitted</th>
                  <th className="p-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-line">
                    <td className="p-2">
                      <Link href={`/admin/vendors/${row.reference}`} className="text-cyan underline-offset-2 hover:underline">
                        {row.reference}
                      </Link>
                    </td>
                    <td className="p-2">{row.business_name}</td>
                    <td className="p-2">{row.application_type}</td>
                    <td className="p-2">{row.primary_category}</td>
                    <td className="p-2">{formatSpaceLabel(row.requested_space as VendorSpaceId)}</td>
                    <td className="p-2">
                      <StatusPill status={row.status} label={VENDOR_APPLICATION_STATUS_LABELS[row.status]} />
                    </td>
                    <td className="p-2">{formatAdminDateTime(row.submitted_at)}</td>
                    <td className="p-2">
                      {row.vendor_offers
                        ? `${row.vendor_offers.invoice_status} · ${money(row.vendor_offers.total)}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-6 grid gap-4 lg:hidden">
            {rows.map((row) => (
              <li key={row.id} className="border border-line bg-panel p-5">
                <Link href={`/admin/vendors/${row.reference}`} className="font-display text-xl uppercase tracking-wide text-cyan">
                  {row.business_name}
                </Link>
                <p className="mt-1 text-sm text-muted">{row.reference}</p>
                <p className="mt-2 text-sm">
                  {row.application_type} · {row.primary_category}
                </p>
                <div className="mt-3">
                  <StatusPill status={row.status} label={VENDOR_APPLICATION_STATUS_LABELS[row.status]} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
