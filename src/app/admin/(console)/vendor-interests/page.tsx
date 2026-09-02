import Link from "next/link";
import { updateInterestStatusAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { StatusPill } from "@/components/admin/StatusPill";
import { formatAdminDateTime } from "@/lib/admin/time";
import { listVendorInterests } from "@/lib/persistence/vendors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function VendorInterestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <p>Sign in again.</p>;

  let rows = [];
  try {
    rows = await listVendorInterests(supabase, q);
  } catch {
    return <p className="text-magenta">The organizer database is unavailable.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-wide">Vendor interests</h1>
      <p className="mt-2 text-muted">Interest registrations are not official applications.</p>
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
        <p className="mt-8 border border-line bg-panel p-6 text-muted">No vendor interests yet.</p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {rows.map((row) => (
            <li key={row.id} className="border border-line bg-panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-2xl uppercase tracking-wide">{row.business_name}</p>
                  <p className="text-sm text-muted">
                    {row.contact_name} · {row.email} · {row.reference}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {row.applicant_type} · {row.primary_category}
                  </p>
                  <p className="mt-2 text-sm">{row.description}</p>
                  <p className="mt-2 text-xs text-muted">{formatAdminDateTime(row.created_at)}</p>
                </div>
                <StatusPill status={row.status} label={row.status} />
              </div>
              <ActionForm action={updateInterestStatusAction} className="mt-4">
                <input type="hidden" name="id" value={row.id} />
                <label className="flex flex-wrap items-center gap-2 text-sm">
                  Status
                  <select name="status" defaultValue={row.status} className="border border-line bg-ink px-2 py-1">
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="converted">converted</option>
                    <option value="closed">closed</option>
                  </select>
                  <button type="submit" className="border border-cyan px-3 py-1 text-cyan">
                    Save
                  </button>
                </label>
              </ActionForm>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-sm">
        <Link href="/admin/vendors" className="text-cyan underline-offset-2 hover:underline">
          Official applications
        </Link>
      </p>
    </div>
  );
}
