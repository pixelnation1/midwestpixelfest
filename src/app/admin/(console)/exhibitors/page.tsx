import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatAdminDateTime } from "@/lib/admin/time";

export const dynamic = "force-dynamic";

type VendorRow = {
  id: string;
  reference: string;
  business_name: string;
  application_type: string;
  primary_category: string;
  status: string;
  submitted_at: string;
};
type ListingRow = {
  application_id: string;
  id: string;
  published: boolean;
  display_name: string;
  booth_location: string | null;
  featured: boolean;
};

export default async function AdminExhibitorsPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <p className="text-magenta">Sign in again.</p>;

  const [applications, directory] = await Promise.all([
    supabase.from("vendor_applications")
      .select("id,reference,business_name,application_type,primary_category,status,submitted_at")
      .eq("status", "confirmed")
      .order("submitted_at", { ascending: false })
      .limit(300),
    supabase.from("public_vendor_listings")
      .select("application_id,id,published,display_name,booth_location,featured")
      .limit(300),
  ]);

  if (applications.error || directory.error) {
    return <p role="alert" className="text-magenta">
      The exhibitor database is temporarily unavailable.
    </p>;
  }

  const rows = (applications.data ?? []) as VendorRow[];
  const listingByApp = new Map(
    ((directory.data ?? []) as ListingRow[]).map(item => [item.application_id, item]),
  );
  const published = rows.filter(row => listingByApp.get(row.id)?.published).length;

  return <div className="space-y-8">
    <div>
      <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Organizer / Marketplace</p>
      <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-paper">Exhibitor Directory</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
        Build public profiles only for confirmed exhibitors. Click a confirmed
        vendor to edit their display name, category, description, links, logo,
        featured position, booth assignment and publication status.
      </p>
    </div>
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        ["Confirmed vendors", String(rows.length)],
        ["Public profiles", String(published)],
        ["Not yet listed", String(rows.length - published)],
      ].map(([label, count]) => <div key={label} className="border border-line bg-panel p-5">
        <p className="font-pixel text-[10px] uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-3 font-display text-4xl text-cyan">{count}</p>
      </div>)}
    </div>
    <div className="flex flex-wrap gap-3">
      <Link href="/admin/vendors?filter=confirmed" className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan">
        View confirmed applications
      </Link>
      <Link href="/exhibitors" target="_blank" rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center border border-paper/30 px-5 py-3 font-display text-sm uppercase tracking-wider text-paper">
        View public directory ↗
      </Link>
    </div>
    <div className="space-y-3">
      {rows.map(row => {
        const publicListing = listingByApp.get(row.id);
        return <article key={row.id} className="flex flex-col gap-4 border border-line bg-panel p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-pixel text-[10px] text-gold">{row.reference}</p>
            <h2 className="mt-2 font-display text-2xl uppercase text-paper">{row.business_name}</h2>
            <p className="mt-2 text-sm text-muted">{row.application_type} · {row.primary_category}</p>
            <p className="mt-2 text-xs text-muted">Applied {formatAdminDateTime(row.submitted_at)}</p>
            <p className="mt-2 text-sm">
              <span className={publicListing?.published ? "text-lime" : "text-gold"}>
                {publicListing?.published ? "Published" : "Not published"}
              </span>
              {publicListing?.booth_location ? " · Booth " + publicListing.booth_location : " · Booth pending"}
              {publicListing?.featured ? " · Featured" : ""}
            </p>
          </div>
          <Link href={"/admin/vendors/" + row.reference}
            className="inline-flex min-h-11 shrink-0 items-center justify-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan hover:bg-cyan/10">
            Edit public profile →
          </Link>
        </article>;
      })}
      {rows.length===0 && <div className="border border-line bg-panel p-8 text-center">
        <h2 className="font-display text-2xl uppercase text-paper">No confirmed exhibitors yet</h2>
        <p className="mt-3 text-muted">
          Review vendor applications first. Confirmed vendors will appear here
          before you opt to publish their approved public profiles.
        </p>
        <Link href="/admin/vendors" className="mt-5 inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase text-cyan">
          Review vendor applications
        </Link>
      </div>}
    </div>
  </div>;
}
