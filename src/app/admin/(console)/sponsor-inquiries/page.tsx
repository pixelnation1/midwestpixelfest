import Link from "next/link";
import { StatusPill } from "@/components/admin/StatusPill";
import { formatAdminDateTime } from "@/lib/admin/time";
import { listSponsorships } from "@/lib/persistence/sponsors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SPONSORSHIP_STATUS_LABELS } from "@/lib/sponsor-ops/status";

export default async function SponsorInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <p>Sign in again.</p>;
  let rows = [];
  try {
    rows = await listSponsorships(supabase, { filter: "inquiry", q });
  } catch {
    return <p className="text-magenta">The organizer database is unavailable.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-wide">Sponsor inquiries</h1>
      <p className="mt-2 text-muted">
        Inquiries, contacted, and negotiating records. An inquiry is not a commitment.
      </p>
      <form className="mt-6 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search business, contact, or reference"
          className="w-full max-w-md border border-line bg-ink px-3 py-2"
        />
        <button type="submit" className="border border-cyan px-4 py-2 text-cyan">
          Search
        </button>
      </form>
      {rows.length === 0 ? (
        <p className="mt-8 border border-line bg-panel p-6 text-muted">No sponsorship inquiries yet.</p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {rows.map((row) => (
            <li key={row.id} className="border border-line bg-panel p-5">
              <Link href={`/admin/sponsors/${row.reference}`} className="font-display text-2xl uppercase tracking-wide text-cyan">
                {row.business_name}
              </Link>
              <p className="text-sm text-muted">
                {row.reference} · {row.contact_name} · {row.selected_level ?? "Level TBD"}
              </p>
              <div className="mt-3">
                <StatusPill status={row.status} label={SPONSORSHIP_STATUS_LABELS[row.status]} />
              </div>
              <p className="mt-2 text-xs text-muted">{formatAdminDateTime(row.inquiry_received_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
