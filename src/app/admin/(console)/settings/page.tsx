import { getOrganizerSession } from "@/lib/admin/auth";
import {
  sponsorshipContractingEntity,
  sponsorshipContractingEntityStatus,
  sponsorshipEventCancellationPolicyStatus,
  sponsorshipRefundPolicyStatus,
} from "@/lib/sponsorships";
import { vendorApplicationsOpen, artistApplicationsOpen } from "@/lib/vendors";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/public-env";
import { isSupabasePersistenceConfigured } from "@/lib/supabase/env";
import { isResendConfigured } from "@/lib/forms/mail-config";

export default async function SettingsPage() {
  const organizer = await getOrganizerSession();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wide">Settings</h1>
        <p className="mt-2 text-muted">Operational flags and legal TODOs. This page does not collect secrets.</p>
      </div>
      <section className="border border-line bg-panel p-5">
        <h2 className="font-display text-xl uppercase tracking-wide">Signed-in organizer</h2>
        <p className="mt-3 text-sm">{organizer?.displayName} · {organizer?.role}</p>
        <p className="text-sm text-muted">{organizer?.email}</p>
      </section>
      <section className="border border-line bg-panel p-5">
        <h2 className="font-display text-xl uppercase tracking-wide">Connections</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          <li>Supabase URL/anon: {isSupabaseBrowserConfigured() ? "configured" : "missing"}</li>
          <li>Persistence (service role): {isSupabasePersistenceConfigured() ? "configured" : "missing"}</li>
          <li>Resend: {isResendConfigured() ? "configured" : "missing"}</li>
        </ul>
      </section>
      <section className="border border-line bg-panel p-5">
        <h2 className="font-display text-xl uppercase tracking-wide">Public application flags</h2>
        <p className="mt-3 text-sm">Vendor Hall applications: {vendorApplicationsOpen ? "open" : "closed"}</p>
        <p className="text-sm">Artist Alley applications: {artistApplicationsOpen ? "open" : "closed"}</p>
      </section>
      <section className="border border-gold/40 bg-panel p-5">
        <h2 className="font-display text-xl uppercase tracking-wide text-gold">Legal TODOs</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>
            Contracting entity: {sponsorshipContractingEntity ?? "not confirmed"} ({sponsorshipContractingEntityStatus.replaceAll("_", " ")})
          </li>
          <li>Sponsorship cancellation/refund: {sponsorshipRefundPolicyStatus.replaceAll("_", " ")}</li>
          <li>Event cancellation / force majeure: {sponsorshipEventCancellationPolicyStatus.replaceAll("_", " ")}</li>
        </ul>
        <p className="mt-4 text-sm text-muted">
          Add organizers in the database after creating a Supabase Auth user. There is no public
          admin signup.
        </p>
      </section>
    </div>
  );
}
