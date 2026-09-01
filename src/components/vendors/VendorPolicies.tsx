import Link from "next/link";
import { ContentSection } from "@/components/ui/ContentSection";
import { site } from "@/lib/site";
import {
  formatVendorCalendarDate,
  foundingVendorDeadlineLabel,
  vendorPaymentWindowDays,
  vendorPoliciesPath,
  vendorRefundPolicy,
} from "@/lib/vendors";

export function VendorPoliciesContent() {
  const windowDays = vendorPaymentWindowDays;
  const founding = foundingVendorDeadlineLabel();
  const tier1End = formatVendorCalendarDate(vendorRefundPolicy.tier1End);
  const tier2Start = formatVendorCalendarDate(vendorRefundPolicy.tier2Start);
  const tier2End = formatVendorCalendarDate(vendorRefundPolicy.tier2End);

  return (
    <>
      <ContentSection title="Applications">
        <p>
          Vendor Hall and Artist Alley applications are free to submit.
          Submitting an application does not guarantee acceptance, reserve a
          booth, or require payment.
        </p>
        <p>
          Midwest Pixel Fest reviews applications for event fit, available
          space, merchandise mix, and overall vendor-floor balance. An applicant
          may be offered a different space than the one requested.
        </p>
      </ContentSection>

      <ContentSection title="Approval, invoices, and confirmation">
        <p>
          Applied means an application was submitted. Approved means Midwest
          Pixel Fest offered a space. Confirmed means the required payment has
          been received.
        </p>
        <p>
          If approved, you will receive an acceptance offer and a Square invoice
          or payment request. Payment is due within {windowDays} calendar days
          of the offer unless Midwest Pixel Fest provides a written extension.
          Your space is not confirmed until payment is received.
        </p>
        <p>
          There is no public self-service booth checkout, and this website does
          not collect card numbers, bank information, or tax IDs.
        </p>
      </ContentSection>

      <ContentSection title="Founding Vendor pricing">
        <p>
          Founding Vendor Rate is an introductory pricing tier planned through{" "}
          {founding}, subject to availability. If an acceptance offer is issued
          while Founding Vendor pricing is active, that offer keeps the Founding
          rate through its payment window even if the Founding deadline passes
          before payment is due.
        </p>
        <p>
          If an offer expires and a later offer is issued after Founding Vendor
          pricing has ended, the later offer uses the pricing in effect at that
          time. Founding Vendor Rate is not permanent status, exclusive rights,
          special placement, a marketing package, or a guaranteed renewal.
        </p>
      </ContentSection>

      <ContentSection title="Cancellation and refunds for paid spaces">
        <p>
          Refund eligibility is based on the date Midwest Pixel Fest receives
          the cancellation request, using {vendorRefundPolicy.timezone} calendar
          dates.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Through {tier1End}: eligible for a {vendorRefundPolicy.tier1Percent}%
            refund
          </li>
          <li>
            {tier2Start} through {tier2End}: eligible for a{" "}
            {vendorRefundPolicy.tier2Percent}% refund
          </li>
          <li>After {tier2End}: no refund</li>
        </ul>
        <p>{vendorRefundPolicy.processingFeeLanguage}</p>
        <p>
          To request cancellation, contact Midwest Pixel Fest. There is no
          anonymous self-service cancellation form. Knowing an application
          reference number is not enough to cancel a booth.
        </p>
      </ContentSection>

      <ContentSection title="Event cancellation or postponement">
        <p>
          An event-cancellation, postponement, weather, venue-loss, or force
          majeure refund policy has not been published. That item remains under
          organizer and legal review and is not a contractual promise on this
          page.
        </p>
      </ContentSection>

      <ContentSection title="Booth sharing, tax, and operations">
        <p>
          Booth sharing requires approval. Approved vendors may not silently
          sublet space.
        </p>
        <p>
          Vendors are responsible for complying with applicable Kansas and local
          tax, licensing, permit, and business requirements. Midwest Pixel Fest
          does not provide individualized tax or legal advice.
        </p>
        <p>
          Final venue, load-in, setup, furniture, electricity, insurance, and
          floor-plan information will be provided later. {site.location} is
          confirmed; the venue is TBA.
        </p>
      </ContentSection>

      <ContentSection title="Still pending">
        <p>These items are not final on this page:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Event cancellation / postponement refund policy</li>
          <li>Venue name, load-in hours, and electrical pricing</li>
          <li>The full vendor agreement (this page is not the vendor contract)</li>
        </ul>
        <p>
          Official applications are not open yet.{" "}
          <Link href="/vendors/interest" className="text-cyan underline-offset-2 hover:underline">
            Register vendor interest
          </Link>{" "}
          to be notified, or return to{" "}
          <Link href="/vendors" className="text-cyan underline-offset-2 hover:underline">
            vendor information
          </Link>
          .
        </p>
      </ContentSection>
    </>
  );
}

export function VendorPoliciesSummary() {
  return (
    <section
      id="vendor-policies"
      className="scroll-mt-24 border border-line bg-panel p-6 sm:p-8"
      aria-labelledby="vendor-policies-heading"
    >
      <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-gold">
        Policies
      </p>
      <h2
        id="vendor-policies-heading"
        className="mt-4 font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl"
      >
        Vendor policies at a glance
      </h2>
      <ul className="mt-4 max-w-3xl space-y-2 text-muted">
        <li>Applications are free. Approval is required.</li>
        <li>
          Payment is due within {vendorPaymentWindowDays} calendar days of
          acceptance. Space is not confirmed until payment is received.
        </li>
        <li>
          Founding Vendor offers keep their locked rate through the payment
          window.
        </li>
        <li>
          Paid-space refunds follow the published cancellation schedule. Booth
          sharing requires approval.
        </li>
      </ul>
      <p className="mt-5">
        <Link
          href={vendorPoliciesPath}
          className="font-display text-sm uppercase tracking-wide text-cyan underline-offset-4 hover:underline"
        >
          Read vendor policies
        </Link>
      </p>
    </section>
  );
}
