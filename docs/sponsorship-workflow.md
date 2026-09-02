# Sponsorship operations

Midwest Pixel Fest 2027 sponsorship sales run:

Inquiry → contact → negotiation → commitment → invoice → payment → asset collection → active sponsor.

There is no public sponsorship checkout and no Square API integration. Inquiry submissions are not contracts and are not published as sponsors.

## Statuses

Internal values live in `src/lib/sponsor-ops/status.ts`. Labels are centralized there.

| Status | Meaning |
| --- | --- |
| `inquiry_received` | Website inquiry submitted |
| `contacted` | Organizer has started communication |
| `negotiating` | Package, custom opportunities, or terms under discussion |
| `committed` | Both parties agreed. Payment may still be outstanding |
| `invoice_created` | Square invoice prepared (manual) |
| `invoice_sent` | Payment request delivered |
| `paid` | Required payment recorded |
| `assets_needed` | Paid; marketing assets still outstanding |
| `assets_received` | Required materials received |
| `active` | Eligible for applicable public/event recognition |
| `completed` | After the event |
| `declined` / `withdrawn` / `cancelled` | Alternate endings. Withdrawn is unpaid; cancelled is after commitment/payment |

Inquiry is never auto-converted to `active`.

## Commitment snapshot

`createCommitmentSnapshot()` copies package name, amount, included benefits, approved custom benefits, excluded items, areas, exclusivity, payment due date, and agreement version (`2027-v1`). Later public package edits must not change an already-agreed snapshot.

Custom benefits require organizer approval. Category exclusivity is never automatic. If granted, record `exclusivityGranted`, category, and descriptions. Code does not block other sponsors.

Payment due date is per commitment (`paymentDueAt`). There is no universal sponsorship payment window.

## Square Invoice (manual)

After commitment, the organizer creates a Square Invoice off-site. `buildSponsorSquareInvoiceSummary()` produces copy-paste text. Track invoice id/url, dates, amounts, and invoice status separately from sponsorship status.

Partial payments can be recorded without advertising installment plans. Status becomes `paid` when the organizer records full payment (or amount paid meets the invoiced amount).

Do not expose Square identifiers on public pages.

## Asset collection

Collect public name, website, description (max 500 characters), social URLs, marketing contact, and preferred public URL. Optional brand-guidelines URL. Logo variants: primary (required when storage exists), plus optional light / dark / monochrome.

**Storage TODO:** no secure file store is connected. Do not fake uploads, base64-store logos, or commit sponsor files to git. Allowed types when storage exists: SVG, PNG, PDF; max 8 MB.

Raw descriptions are not auto-published. Organizer may edit for length, formatting, and clarity without materially changing meaning.

## Activation and directory

Normal path: paid + required assets received → organizer may set `active`. Organizer override is allowed with an internal reason.

Public listing also requires `publicDirectoryEnabled`. Public cards include display name, level, logo, website, public description, social URL, sponsored area, featured, sortOrder. Never public: private contacts, address, invoices, payment status, internal notes, negotiation details.

`confirmedSponsors` stays empty until real partners are published. No placeholder companies.

## Forms

| Form | Route | Public CTA? |
| --- | --- | --- |
| Inquiry | `/sponsors/inquiry` | Yes |
| Commitment | `/sponsors/commitment` | No. Closed until contracting entity is confirmed |
| Assets | `/sponsors/assets` | No. Closed until organizer-issued collection is enabled |

## Legal TODOs (do not invent terms)

1. **Contracting entity** — `sponsorshipContractingEntity` is `null` and `sponsorshipContractingEntityStatus` is `pending_legal_review`. Public site presents PixelNation as organizer/presenter. Earlier paperwork used “Midwest PixelFest LLC”. Do not silently pick one. Confirm with organizer/legal before opening the commitment form (`sponsorshipCommitmentOpen` stays `false` until then).
2. **Sponsorship cancellation / refund** — `sponsorshipRefundPolicyStatus: pending_review`. Do not copy the vendor booth refund schedule.
3. **Event cancellation / postponement / weather / force majeure / venue loss** — `sponsorshipEventCancellationPolicyStatus: pending_review`. Do not publish promises.

Commitment copy: the form confirms the agreed package subject to the final sponsorship agreement and event policies. It does not replace attorney-reviewed agreements.

## Persistence

No database in this project. Types, snapshots, workflow helpers, and email templates are ready for a later store. Do not use localStorage for sponsor PII or payment data. Do not add an unsecured admin dashboard.

## Emails

Sponsor lifecycle templates in `src/lib/sponsor-ops/emails.ts` send through the existing Resend helper (`sendSponsorLifecycleEmail` → `sendLifecycleEmail`). Inquiry notifications still go to `hello@midwestpixelfest.com` with validated Reply-To. From is never the submitter.

## Analytics

Non-PII events: `sponsor_inquiry_submit`, `sponsor_contacted`, `sponsor_committed`, `sponsor_invoice_sent`, `sponsor_payment_received`, `sponsor_assets_received`, `sponsor_activated`. Do not send names, emails, phones, addresses, invoice URLs, amounts, or internal notes.
