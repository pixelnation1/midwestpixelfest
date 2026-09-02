import { notFound } from "next/navigation";
import {
  addVendorNoteAction,
  confirmVendorPaymentAction,
  markVendorOverdueAction,
  recordVendorInvoiceAction,
  sendVendorEmailAction,
  setVendorDirectoryAction,
  vendorStatusAction,
} from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { StatusPill } from "@/components/admin/StatusPill";
import { VendorApprovalForm } from "@/components/admin/VendorApprovalForm";
import { Button } from "@/components/ui/Button";
import { formatAdminDate, formatAdminDateTime, money } from "@/lib/admin/time";
import { getVendorApplicationByReference } from "@/lib/persistence/vendors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSquareInvoiceSummary } from "@/lib/vendor-ops/invoice";
import { formatSpaceLabel } from "@/lib/vendor-ops/pricing";
import { VENDOR_APPLICATION_STATUS_LABELS } from "@/lib/vendor-ops/status";
import { applicationToRecord } from "@/lib/persistence/vendors";
import type { VendorSpaceId } from "@/lib/vendors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-panel p-5">
      <h2 className="font-display text-xl uppercase tracking-wide">{title}</h2>
      <div className="mt-3 space-y-1 text-sm text-muted">{children}</div>
    </section>
  );
}

function Line({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === "") return null;
  return (
    <p>
      <span className="text-paper">{label}:</span> {value}
    </p>
  );
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <p>Sign in again.</p>;
  let detail;
  try {
    detail = await getVendorApplicationByReference(supabase, reference);
  } catch {
    return <p className="text-magenta">The organizer database is unavailable.</p>;
  }
  if (!detail) notFound();

  const app = detail.application;
  const merch = (app.merchandise ?? {}) as Record<string, unknown>;
  const display = (app.display_setup ?? {}) as Record<string, unknown>;
  const compliance = (app.compliance ?? {}) as Record<string, unknown>;
  const staff = (app.staff ?? {}) as Record<string, unknown>;
  const sharing = (app.booth_sharing ?? {}) as Record<string, unknown>;
  const acks = (app.acknowledgments ?? {}) as Record<string, unknown>;
  const signature = (app.signature ?? {}) as Record<string, unknown>;
  const record = applicationToRecord(app, detail.offer, detail.history);
  const invoiceSummary = record.offer ? buildSquareInvoiceSummary(record.offer) : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-gold">{record.reference}</p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">{String(app.business_name)}</h1>
        <div className="mt-3">
          <StatusPill status={record.status} label={VENDOR_APPLICATION_STATUS_LABELS[record.status]} />
        </div>
      </div>

      <Section title="Contact">
        <Line label="Name" value={String(app.contact_name)} />
        <Line label="Email" value={String(app.email)} />
        <Line label="Phone" value={String(app.phone)} />
        <Line label="Website" value={app.website as string} />
        <Line label="Social" value={[app.social_primary, app.social_additional].filter(Boolean).join(" · ")} />
      </Section>
      <Section title="Business">
        <Line label="Type" value={String(app.application_type)} />
        <Line label="Category" value={String(app.primary_category)} />
        <Line label="Address" value={[app.street, app.city, app.state, app.zip, app.country].filter(Boolean).join(", ")} />
        <Line label="Description" value={String(merch.businessDescription ?? "")} />
        <Line label="Years active" value={String(merch.yearsActive ?? "")} />
      </Section>
      <Section title="Merchandise">
        <Line label="What they sell" value={String(merch.whatYouSell ?? "")} />
        <Line label="Inventory" value={Array.isArray(merch.inventoryTypes) ? merch.inventoryTypes.join(", ") : ""} />
        <Line label="Original mix" value={String(merch.mixOriginal ?? "")} />
        <Line label="Licensed mix" value={String(merch.mixLicensed ?? "")} />
        <Line label="Mystery" value={String(merch.mysteryMerchandise ?? "")} />
        <Line label="AI-generated" value={String(compliance.aiGenerated ?? "")} />
      </Section>
      <Section title="Space request">
        <Line label="Requested" value={formatSpaceLabel(String(app.requested_space) as VendorSpaceId)} />
        <Line label="Extra badges" value={String(app.extra_badges)} />
        <Line label="Extra tables" value={String(app.extra_tables)} />
        <Line label="Electricity" value={app.electricity_requested ? "Yes" : "No"} />
        <Line label="Additional space" value={String(display.additionalSpaceDetails ?? display.additionalSpace ?? "")} />
      </Section>
      <Section title="Booth setup">
        <Line label="Tall displays" value={String(display.tallDisplays ?? "")} />
        <Line label="Elements" value={Array.isArray(display.displayElements) ? display.displayElements.join(", ") : ""} />
        <Line label="Notes" value={String(display.boothSetupNotes ?? "")} />
      </Section>
      <Section title="Compliance">
        <Line label="Food/beverage" value={String(compliance.sellsFood ?? "")} />
        <Line label="Insurance" value={String(compliance.insuranceStatus ?? "")} />
        <Line label="Hours" value={String(compliance.hoursCommitment ?? "")} />
        <Line label="Tax ack" value={compliance.taxAcknowledgment ? "Yes" : "No"} />
      </Section>
      <Section title="Booth sharing">
        <Line label="Sharing" value={String(sharing.boothSharing ?? "")} />
        <Line label="Other business" value={String(sharing.shareBusinessName ?? "")} />
        <Line label="Other contact" value={String(sharing.shareContactName ?? "")} />
        <Line label="Other email" value={String(sharing.shareEmail ?? "")} />
      </Section>
      <Section title="Staff">
        <Line label="Primary rep" value={String(staff.primaryRepName ?? "")} />
        <Line label="Additional" value={String(staff.additionalRepNames ?? "")} />
      </Section>
      <Section title="Acknowledgments">
        {Object.entries(acks).map(([key, value]) => (
          <Line key={key} label={key} value={value ? "Yes" : "No"} />
        ))}
      </Section>
      <Section title="Signature metadata">
        <Line label="Signed as" value={String(signature.signature ?? "")} />
        <Line label="Date" value={String(signature.signatureDate ?? "")} />
        <Line label="Business on signature" value={String(signature.signatureBusinessName ?? "")} />
        <Line label="Submitted" value={formatAdminDateTime(String(app.submitted_at))} />
      </Section>

      {(record.status === "under_review" || record.status === "waitlisted") && (
        <VendorApprovalForm
          reference={reference}
          requestedSpace={String(app.requested_space)}
          extraBadges={Number(app.extra_badges ?? 0)}
          extraTables={Number(app.extra_tables ?? 0)}
          electricityRequested={Boolean(app.electricity_requested)}
        />
      )}

      {record.offer ? (
        <Section title="Offer / invoice">
          <Line label="Offered space" value={formatSpaceLabel(record.offer.offeredSpace)} />
          <Line label="Tier" value={record.offer.snapshot.pricingTier} />
          <Line label="Total" value={money(record.offer.snapshot.total)} />
          <Line label="Due" value={formatAdminDate(record.offer.paymentDueOn)} />
          <Line label="Invoice" value={record.offer.invoice.status} />
          {invoiceSummary ? (
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap border border-line bg-ink p-3 text-xs text-paper">
              {invoiceSummary}
            </pre>
          ) : null}
          <ActionForm action={recordVendorInvoiceAction} className="mt-4 space-y-2">
            <input type="hidden" name="reference" value={reference} />
            <label className="block">
              Square Invoice ID
              <input name="squareInvoiceId" className="mt-1 w-full border border-line bg-ink px-3 py-2" />
            </label>
            <label className="block">
              Square Invoice URL
              <input name="squareInvoiceUrl" className="mt-1 w-full border border-line bg-ink px-3 py-2" />
            </label>
            <Button type="submit" variant="secondary">
              Record invoice sent
            </Button>
          </ActionForm>
          <ActionForm action={confirmVendorPaymentAction} className="mt-4 space-y-2">
            <input type="hidden" name="reference" value={reference} />
            <p>
              Confirm payment for {String(app.business_name)} · {formatSpaceLabel(record.offer.offeredSpace)} ·
              expected {money(record.offer.snapshot.total)}
            </p>
            <label className="block">
              Amount received
              <input
                name="amountPaid"
                defaultValue={record.offer.snapshot.total}
                className="mt-1 w-full border border-line bg-ink px-3 py-2"
              />
            </label>
            <label className="block">
              Internal payment reference
              <input name="paymentReference" className="mt-1 w-full border border-line bg-ink px-3 py-2" />
            </label>
            <label className="flex gap-2">
              <input type="checkbox" name="confirm" value="yes" />
              I confirm this payment should mark the vendor confirmed.
            </label>
            <Button type="submit">Record payment received</Button>
          </ActionForm>
          <ActionForm action={markVendorOverdueAction} className="mt-3">
            <input type="hidden" name="reference" value={reference} />
            <Button type="submit" variant="ghost">
              Mark payment overdue
            </Button>
          </ActionForm>
        </Section>
      ) : null}

      <Section title="Status">
        <ActionForm action={vendorStatusAction}>
          <input type="hidden" name="reference" value={reference} />
          <label className="flex flex-wrap items-center gap-2">
            Move to
            <select name="nextStatus" className="border border-line bg-ink px-2 py-1">
              <option value="under_review">Under Review</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="declined">Declined</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button type="submit" variant="secondary">
              Update status
            </Button>
          </label>
          <p className="text-xs">Status changes do not send email.</p>
        </ActionForm>
      </Section>

      <Section title="Emails">
        <ActionForm action={sendVendorEmailAction}>
          <input type="hidden" name="reference" value={reference} />
          <label className="flex flex-wrap items-center gap-2">
            Send
            <select name="emailKind" className="border border-line bg-ink px-2 py-1">
              <option value="approval">Approval</option>
              <option value="waitlist">Waitlist update</option>
              <option value="decline">Decline</option>
              <option value="payment_reminder">Payment reminder</option>
              <option value="payment_overdue">Payment overdue</option>
              <option value="payment_confirmation">Payment confirmation</option>
            </select>
            <Button type="submit">Send email</Button>
          </label>
        </ActionForm>
      </Section>

      <Section title="Internal notes">
        <ul className="space-y-2">
          {detail.notes.length === 0 ? <li>No internal notes.</li> : null}
          {detail.notes.map((note) => (
            <li key={note.id} className="border border-line bg-ink p-3">
              <p>{note.body}</p>
              <p className="mt-1 text-xs">{formatAdminDateTime(note.createdAt)}</p>
            </li>
          ))}
        </ul>
        <ActionForm action={addVendorNoteAction} className="mt-3">
          <input type="hidden" name="reference" value={reference} />
          <textarea name="note" rows={3} className="w-full border border-line bg-ink px-3 py-2" />
          <Button type="submit" variant="secondary">
            Add note
          </Button>
        </ActionForm>
      </Section>

      <Section title="History">
        <ol className="space-y-2">
          {detail.history.map((entry) => (
            <li key={entry.id}>
              {entry.from_status ?? "—"} → {entry.to_status} · {formatAdminDateTime(entry.created_at)}
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Public directory">
        <p className="text-muted">
          Only confirmed vendors can appear publicly. Private contact and payment fields are never
          copied to the directory.
        </p>
        <ActionForm action={setVendorDirectoryAction} className="mt-3 space-y-2">
          <input type="hidden" name="reference" value={reference} />
          <label className="block">
            Display name
            <input
              name="displayName"
              defaultValue={record.directory.displayName}
              className="mt-1 w-full border border-line bg-ink px-3 py-2"
            />
          </label>
          <label className="block">
            Category
            <input
              name="category"
              defaultValue={record.directory.category}
              className="mt-1 w-full border border-line bg-ink px-3 py-2"
            />
          </label>
          <label className="block">
            Short description
            <textarea
              name="shortDescription"
              defaultValue={record.directory.shortDescription}
              rows={3}
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
            Public social URL
            <input
              name="socialUrl"
              defaultValue={record.directory.socialUrl ?? ""}
              className="mt-1 w-full border border-line bg-ink px-3 py-2"
            />
          </label>
          <label className="flex gap-2">
            <input type="checkbox" name="publish" value="yes" defaultChecked={record.directory.publishInDirectory} />
            Publish in public vendor directory
          </label>
          <Button type="submit" variant="secondary">
            Save directory settings
          </Button>
        </ActionForm>
      </Section>
    </div>
  );
}
