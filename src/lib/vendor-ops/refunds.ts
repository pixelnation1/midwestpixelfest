import { formatVendorPrice, vendorRefundPolicy } from "@/lib/vendors";
import {
  chicagoCalendarDateFromInstant,
  formatCalendarDateLong,
  isOnOrBefore,
} from "@/lib/vendor-ops/dates";

export type RefundEstimate = {
  cancellationReceivedOn: string;
  percent: number;
  amountPaid: number;
  baseRefund: number;
  processingFeeLanguage: string;
  /** Organizer must decide and issue any refund. This does not initiate one. */
  automatic: false;
};

export function refundPercentForCalendarDate(cancellationReceivedOn: string): number {
  if (isOnOrBefore(cancellationReceivedOn, vendorRefundPolicy.tier1End)) {
    return vendorRefundPolicy.tier1Percent;
  }
  if (isOnOrBefore(cancellationReceivedOn, vendorRefundPolicy.tier2End)) {
    return vendorRefundPolicy.tier2Percent;
  }
  return vendorRefundPolicy.afterPercent;
}

export function estimateRefund(
  amountPaid: number,
  cancellationReceivedAt: Date | string,
): RefundEstimate {
  if (amountPaid < 0) {
    throw new Error("Amount paid cannot be negative.");
  }
  const cancellationReceivedOn =
    typeof cancellationReceivedAt === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(cancellationReceivedAt)
      ? cancellationReceivedAt
      : chicagoCalendarDateFromInstant(cancellationReceivedAt);
  const percent = refundPercentForCalendarDate(cancellationReceivedOn);
  const baseRefund = Math.round(((amountPaid * percent) / 100) * 100) / 100;

  return {
    cancellationReceivedOn,
    percent,
    amountPaid,
    baseRefund,
    processingFeeLanguage: vendorRefundPolicy.processingFeeLanguage,
    automatic: false,
  };
}

export function refundPolicySummary(): string {
  return [
    `Cancellations received through ${formatCalendarDateLong(vendorRefundPolicy.tier1End)} are eligible for a ${vendorRefundPolicy.tier1Percent}% refund.`,
    `Cancellations received ${formatCalendarDateLong(vendorRefundPolicy.tier2Start)} through ${formatCalendarDateLong(vendorRefundPolicy.tier2End)} are eligible for a ${vendorRefundPolicy.tier2Percent}% refund.`,
    `Cancellations received after ${formatCalendarDateLong(vendorRefundPolicy.tier2End)} are not eligible for a refund.`,
    vendorRefundPolicy.processingFeeLanguage,
  ].join(" ");
}

export function formatRefundEstimate(estimate: RefundEstimate): string {
  return `Base refund at ${estimate.percent}% of ${formatVendorPrice(estimate.amountPaid)} is ${formatVendorPrice(estimate.baseRefund)}. ${estimate.processingFeeLanguage}`;
}
