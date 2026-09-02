import { notFound } from "next/navigation";
import {
  addSponsorNoteAction,
  sendSponsorEmailAction,
  setSponsorDirectoryAction,
  sponsorStatusAction,
  updateFulfillmentAction,
  uploadSponsorLogoAction,
} from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { StatusPill } from "@/components/admin/StatusPill";
import { Button } from "@/components/ui/Button";
import { formatAdminDate, formatAdminDateTime, money } from "@/lib/admin/time";
import { getSponsorshipByReference, sponsorshipToRecord } from "@/lib/persistence/sponsors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSponsorSquareInvoiceSummary } from "@/lib/sponsor-ops/invoice";
import { SPONSOR_ASSET_STATUS_LABELS, SPONSORSHIP_STATUS_LABELS } from "@/lib/sponsor-ops/status";
import { sponsorshipPackages } from "@/lib/sponsorships";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-panel p-5">
      <h2 className="font-display text-xl uppercase tracking-wide">{title}</h2>
      <div className="mt-3 space-y-2 text-sm">{children}</div>
    </section>
  );
}

export default async function SponsorDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <p>Sign in again.</p>;
  let detail;
  try {
    detail = await getSponsorshipByReference(supabase, reference);
  } catch {
    return <p className="text-magenta">The organizer database is unavailable.</p>;
  }
  if (!detail) notFound();
  const record = sponsorshipToRecord(detail);
  const payload = (detail.sponsorship.inquiry_payload ?? {}) as Record<string, unknown>;
  let invoiceSummary: string | null = null;
  try {
    invoiceSummary = record.commitment ? buildSponsorSquareInvoiceSummary(record) : null;
  } catch {
    invoiceSummary = null;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-gold">{record.reference}</p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">{record.businessName}</h1>
        <div className="mt-3">
          <StatusPill status={record.status} label={SPONSORSHIP_STATUS_LABELS[record.status]} />
        </div>
      </div>

      <Section title="Business / contact">
        <p>{record.contactName} · {record.contactEmail}</p>
        <p className="text-muted">{record.contactPhone} · {record.businessAddress}</p>
        <p className="text-muted">{record.website}</p>
      </Section>

      <Section title="Original inquiry">
        <p>Level: {record.selectedLevel ?? "—"}</p>
        <p>Areas: {record.areasOfInterest.join(", ") || "—"}</p>
        <p>Proposed amount: {record.customAmountProposed ?? "—"}</p>
        <p>Comments: {String(payload.notes ?? detail.sponsorship.inquiry_comments ?? "—")}</p>
        <p className="text-xs text-muted">Received {formatAdminDateTime(record.inquiryReceivedAt)}</p>
      </Section>

      {record.commitment ? (
        <Section title="Commitment snapshot">
          <p>{record.commitment.packageName} · {money(record.commitment.agreedAmount)}</p>
          <p>Agreement: {record.commitment.agreementVersion}</p>
          <p>Due: {formatAdminDate(record.commitment.paymentDueAt)}</p>
          <p>Areas: {record.commitment.areasSponsored.join(", ") || "—"}</p>
          <p>
            Exclusivity:{" "}
            {record.commitment.exclusivity.granted
              ? record.commitment.exclusivity.category
              : "Not granted"}
          </p>
          <ul className="list-disc pl-5 text-muted">
            {record.commitment.includedBenefits.slice(0, 12).map((benefit) => (
              <li key={benefit.benefitId}>{benefit.label}</li>
            ))}
          </ul>
          {record.commitment.customBenefits.length > 0 ? (
            <p>Custom: {record.commitment.customBenefits.map((item) => item.label).join(", ")}</p>
          ) : null}
        </Section>
      ) : (
        <Section title="Create commitment">
          <ActionForm action={sponsorStatusAction}>
            <input type="hidden" name="reference" value={reference} />
            <input type="hidden" name="nextStatus" value="committed" />
            <label className="block">
              Package
              <select name="packageId" className="mt-1 w-full border border-line bg-ink px-3 py-2">
                {sponsorshipPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              Agreed amount
              <input name="agreedAmount" className="mt-1 w-full border border-line bg-ink px-3 py-2" />
            </label>
            <label className="block">
              Approved area
              <input name="approvedArea" className="mt-1 w-full border border-line bg-ink px-3 py-2" />
            </label>
            <label className="block">
              Payment due (YYYY-MM-DD)
              <input name="paymentDueAt" className="mt-1 w-full border border-line bg-ink px-3 py-2" />
            </label>
            <Button type="submit">Save commitment snapshot</Button>
          </ActionForm>
        </Section>
      )}

      <Section title="Payment">
        <p>Invoice: {record.invoice.status} · invoiced {money(record.amountInvoiced)} · paid {money(record.amountPaid)}</p>
        {invoiceSummary ? (
          <pre className="overflow-x-auto whitespace-pre-wrap border border-line bg-ink p-3 text-xs">{invoiceSummary}</pre>
        ) : null}
        <ActionForm action={sponsorStatusAction} className="mt-3">
          <input type="hidden" name="reference" value={reference} />
          <input type="hidden" name="nextStatus" value="invoice_sent" />
          <label className="block">
            Square Invoice ID
            <input name="squareInvoiceId" className="mt-1 w-full border border-line bg-ink px-3 py-2" />
          </label>
          <label className="block">
            Square Invoice URL
            <input name="squareInvoiceUrl" className="mt-1 w-full border border-line bg-ink px-3 py-2" />
          </label>
          <Button type="submit" variant="secondary">Record invoice sent</Button>
        </ActionForm>
        <ActionForm action={sponsorStatusAction} className="mt-3">
          <input type="hidden" name="reference" value={reference} />
          <input type="hidden" name="nextStatus" value="paid" />
          <label className="block">
            Amount received
            <input name="amountPaid" className="mt-1 w-full border border-line bg-ink px-3 py-2" />
          </label>
          <Button type="submit">Record payment</Button>
        </ActionForm>
      </Section>

      <Section title="Assets">
        <p>Status: {SPONSOR_ASSET_STATUS_LABELS[record.assets.status]}</p>
        <p>{record.assets.publicBusinessName} · {record.assets.website}</p>
        <p className="text-muted">{record.assets.publicDescription}</p>
        <ActionForm action={uploadSponsorLogoAction} className="mt-3">
          <input type="hidden" name="reference" value={reference} />
          <label className="block">
            Variant
            <select name="variant" className="mt-1 w-full border border-line bg-ink px-3 py-2">
              <option value="primary">Primary</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="monochrome">Monochrome</option>
            </select>
          </label>
          <input name="logo" type="file" accept=".png,.jpg,.jpeg,.svg,.pdf,image/png,image/jpeg,image/svg+xml,application/pdf" />
          <Button type="submit" variant="secondary">Upload logo</Button>
        </ActionForm>
      </Section>

      <Section title="Benefit fulfillment">
        {record.fulfillment.length === 0 ? <p className="text-muted">No committed benefits yet.</p> : null}
        {record.fulfillment.map((item) => (
          <ActionForm key={item.id} action={updateFulfillmentAction} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="reference" value={reference} />
            <input type="hidden" name="itemId" value={item.id} />
            <span className="min-w-40">{item.label}</span>
            <select name="status" defaultValue={item.status} className="border border-line bg-ink px-2 py-1">
              <option value="not_started">not started</option>
              <option value="planned">planned</option>
              <option value="completed">completed</option>
              <option value="not_applicable">not applicable</option>
            </select>
            <button type="submit" className="text-cyan underline-offset-2 hover:underline">Save</button>
          </ActionForm>
        ))}
      </Section>

      <Section title="Status actions">
        <ActionForm action={sponsorStatusAction}>
          <input type="hidden" name="reference" value={reference} />
          <label className="flex flex-wrap items-center gap-2">
            Move to
            <select name="nextStatus" className="border border-line bg-ink px-2 py-1">
              <option value="contacted">Contacted</option>
              <option value="negotiating">Negotiating</option>
              <option value="invoice_created">Invoice created</option>
              <option value="assets_needed">Assets requested</option>
              <option value="assets_received">Assets received</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button type="submit" variant="secondary">Update</Button>
          </label>
          <label className="mt-2 flex gap-2">
            <input type="checkbox" name="activationOverride" value="yes" />
            Activation override (requires reason)
          </label>
          <input name="overrideReason" placeholder="Override reason" className="w-full border border-line bg-ink px-3 py-2" />
        </ActionForm>
      </Section>

      <Section title="Emails">
        <ActionForm action={sendSponsorEmailAction}>
          <input type="hidden" name="reference" value={reference} />
          <label className="flex flex-wrap items-center gap-2">
            Send
            <select name="emailKind" className="border border-line bg-ink px-2 py-1">
              <option value="next_steps">Next steps</option>
              <option value="commitment_confirmation">Commitment confirmation</option>
              <option value="invoice_sent">Invoice notice</option>
              <option value="payment_received">Payment confirmation</option>
              <option value="asset_request">Request assets</option>
              <option value="asset_received">Assets received</option>
            </select>
            <Button type="submit">Send email</Button>
          </label>
        </ActionForm>
      </Section>

      <Section title="Internal notes">
        {detail.notes.length === 0 ? <p className="text-muted">No internal notes.</p> : null}
        {detail.notes.map((note) => (
          <div key={note.id} className="border border-line bg-ink p-3">
            <p>{note.note}</p>
            <p className="mt-1 text-xs text-muted">{formatAdminDateTime(note.created_at)}</p>
          </div>
        ))}
        <ActionForm action={addSponsorNoteAction}>
          <input type="hidden" name="reference" value={reference} />
          <textarea name="note" rows={3} className="w-full border border-line bg-ink px-3 py-2" />
          <Button type="submit" variant="secondary">Add note</Button>
        </ActionForm>
      </Section>

      <Section title="History">
        {detail.history.map((entry) => (
          <p key={entry.id}>
            {entry.from_status ?? "—"} → {entry.to_status} · {formatAdminDateTime(entry.created_at)}
          </p>
        ))}
      </Section>

      <Section title="Public directory">
        <p className="text-muted">
          Public pages only receive display name, level, approved logo, website, public description,
          public social URL, and sponsored area. Payment and contact records stay private.
        </p>
        <ActionForm action={setSponsorDirectoryAction} className="mt-3 space-y-2">
          <input type="hidden" name="reference" value={reference} />
          <label className="block">
            Public display name
            <input
              name="displayName"
              defaultValue={record.directory.displayName}
              className="mt-1 w-full border border-line bg-ink px-3 py-2"
            />
          </label>
          <label className="block">
            Website
            <input
              name="website"
              defaultValue={record.directory.website ?? ""}
              className="mt-1 w-full border border-line bg-ink px-3 py-2"
            />
          </label>
          <label className="block">
            Public description
            <textarea
              name="publicDescription"
              defaultValue={record.directory.publicDescription ?? ""}
              rows={3}
              className="mt-1 w-full border border-line bg-ink px-3 py-2"
            />
          </label>
          <label className="block">
            Public social URL
            <input
              name="publicSocialUrl"
              defaultValue={record.directory.publicSocialUrl ?? ""}
              className="mt-1 w-full border border-line bg-ink px-3 py-2"
            />
          </label>
          <label className="block">
            Sponsored area
            <input
              name="sponsoredArea"
              defaultValue={record.directory.sponsoredArea ?? ""}
              className="mt-1 w-full border border-line bg-ink px-3 py-2"
            />
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              name="publish"
              value="yes"
              defaultChecked={record.publicDirectoryEnabled}
            />
            Allow public directory listing after the sponsor is active
          </label>
          <Button type="submit" variant="secondary">Save directory settings</Button>
        </ActionForm>
      </Section>
    </div>
  );
}
