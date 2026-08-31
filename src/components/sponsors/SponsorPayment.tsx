import { SectionHeading } from "@/components/ui/SectionHeading";
import { sponsorshipPaymentMethods } from "@/lib/sponsorships";

export function SponsorPayment() {
  return (
    <section
      id="payment"
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="payment-heading"
    >
      <SectionHeading
        id="payment-heading"
        eyebrow="Payment"
        title="How approved sponsorships are paid"
        description="This is informational only. Do not send card or bank details through this website. Payment happens after a sponsorship is accepted."
        tone="gold"
      />
      <p className="mt-8 max-w-3xl text-muted">
        Website inquiry, then review, then acceptance, then sponsorship
        confirmation, then a Square invoice or another approved payment method,
        then payment, then marketing materials, then sponsorship benefits begin.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {sponsorshipPaymentMethods.map((method) => (
          <li key={method} className="border border-line bg-panel px-5 py-4 text-paper">
            {method}
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-3xl text-sm text-muted">
        This website does not collect card numbers, bank information, routing
        numbers, or ACH details.
      </p>
    </section>
  );
}
