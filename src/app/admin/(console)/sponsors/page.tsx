import Link from "next/link";
import { StatusPill } from "@/components/admin/StatusPill";
import { formatAdminDateTime, money } from "@/lib/admin/time";
import { listSponsorships } from "@/lib/persistence/sponsors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  SPONSOR_REVIEW_FILTERS,
  SPONSORSHIP_STATUS_LABELS,
  type SponsorReviewFilterId,
} from "@/lib/sponsor-ops/status";

export default async function SponsorsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const params = await searchParams;
  const filter = (SPONSOR_REVIEW_FILTERS.some((item) => item.id === params.filter)
    ? params.filter
    : "all") as SponsorReviewFilterId;
  const q = params.q ?? "";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <p>Sign in again.</p>;
  let rows = [];
  try {
    rows = await listSponsorships(supabase, { filter, q });
  } catch {
    return <p className="text-magenta">The organizer database is unavailable.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-wide">Sponsors</h1>
      <form className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row">
        <select name="filter" defaultValue={filter} className="border border-line bg-ink px-3 py-2">
          {SPONSOR_REVIEW_FILTERS.map((item) => (
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
        <p className="mt-8 border border-line bg-panel p-6 text-muted">No sponsorship inquiries yet.</p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {rows.map((row) => (
            <li key={row.id} className="border border-line bg-panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/admin/sponsors/${row.reference}`} className="font-display text-2xl uppercase tracking-wide text-cyan">
                    {row.business_name}
                  </Link>
                  <p className="text-sm text-muted">
                    {row.reference} · {row.contact_name} · {row.selected_level ?? "Level TBD"}
                    {Array.isArray(row.areas_of_interest) && row.areas_of_interest.length
                      ? ` · ${row.areas_of_interest.join(", ")}`
                      : ""}
                  </p>
                  <p className="mt-1 text-sm">
                    {money(row.amount_committed)} · invoice {row.invoice_status} · assets{" "}
                    {row.sponsor_assets?.status ?? "not_requested"}
                  </p>
                  <p className="mt-1 text-xs text-muted">{formatAdminDateTime(row.inquiry_received_at)}</p>
                </div>
                <StatusPill status={row.status} label={SPONSORSHIP_STATUS_LABELS[row.status]} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
