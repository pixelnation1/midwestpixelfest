"use client";

import { useMemo, useState } from "react";
import { approveVendorAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { Button } from "@/components/ui/Button";
import { formatAdminDate, money } from "@/lib/admin/time";
import { createPriceSnapshot } from "@/lib/vendor-ops/pricing";
import type { VendorPricingTier } from "@/lib/vendor-ops/status";
import type { VendorSpaceId } from "@/lib/vendors";
import { vendorSpaces } from "@/lib/vendors";

export function VendorApprovalForm({
  reference,
  requestedSpace,
  extraBadges,
  extraTables,
  electricityRequested,
}: {
  reference: string;
  requestedSpace: string;
  extraBadges: number;
  extraTables: number;
  electricityRequested: boolean;
}) {
  const [offeredSpace, setOfferedSpace] = useState(requestedSpace);
  const [pricingTier, setPricingTier] = useState<VendorPricingTier>("regular");
  const [badges, setBadges] = useState(extraBadges);
  const [tables, setTables] = useState(extraTables);
  const [customBase, setCustomBase] = useState("");
  const [paymentDueOn, setPaymentDueOn] = useState("");
  const [confirm, setConfirm] = useState(false);

  const snapshot = useMemo(() => {
    try {
      return createPriceSnapshot({
        offeredSpace: offeredSpace as VendorSpaceId,
        extraBadges: badges,
        extraTables: tables,
        electricityRequested,
        offerIssuedAt: new Date(),
        pricingTier,
        customBasePrice: customBase ? Number(customBase) : undefined,
      });
    } catch {
      return null;
    }
  }, [offeredSpace, badges, tables, electricityRequested, pricingTier, customBase]);

  return (
    <ActionForm action={approveVendorAction} className="border border-line bg-panel p-5">
      <input type="hidden" name="reference" value={reference} />
      <h3 className="font-display text-xl uppercase tracking-wide">Approval offer</h3>
      <p className="text-sm text-muted">
        Requested space: {requestedSpace}. Offered space is chosen by the organizer and is not
        automatic.
      </p>
      <label className="block text-sm">
        Offered space
        <select
          name="offeredSpace"
          className="mt-1 w-full border border-line bg-ink px-3 py-2"
          value={offeredSpace}
          onChange={(event) => setOfferedSpace(event.target.value)}
        >
          {vendorSpaces.map((space) => (
            <option key={space.id} value={space.id}>
              {space.name}
              {space.dimensions ? ` (${space.dimensions})` : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Pricing tier
        <select
          name="pricingTier"
          className="mt-1 w-full border border-line bg-ink px-3 py-2"
          value={pricingTier}
          onChange={(event) => setPricingTier(event.target.value as VendorPricingTier)}
        >
          <option value="founding">Founding Vendor Rate</option>
          <option value="regular">Regular</option>
          <option value="custom">Custom</option>
        </select>
      </label>
      {pricingTier === "custom" ? (
        <label className="block text-sm">
          Custom base price
          <input
            name="customBasePrice"
            className="mt-1 w-full border border-line bg-ink px-3 py-2"
            value={customBase}
            onChange={(event) => setCustomBase(event.target.value)}
          />
        </label>
      ) : null}
      <label className="block text-sm">
        Extra badges
        <input
          name="extraBadges"
          type="number"
          min={0}
          className="mt-1 w-full border border-line bg-ink px-3 py-2"
          value={badges}
          onChange={(event) => setBadges(Number(event.target.value))}
        />
      </label>
      <label className="block text-sm">
        Extra tables
        <input
          name="extraTables"
          type="number"
          min={0}
          className="mt-1 w-full border border-line bg-ink px-3 py-2"
          value={tables}
          onChange={(event) => setTables(Number(event.target.value))}
        />
      </label>
      <label className="block text-sm">
        Internal custom-pricing note
        <textarea name="customNote" className="mt-1 w-full border border-line bg-ink px-3 py-2" rows={2} />
      </label>
      <label className="block text-sm">
        Payment due date
        <input
          name="paymentDueOn"
          type="date"
          className="mt-1 w-full border border-line bg-ink px-3 py-2"
          value={paymentDueOn}
          onChange={(event) => setPaymentDueOn(event.target.value)}
        />
      </label>
      <p className="text-xs text-muted">Leave blank to use the standard payment window from the price snapshot.</p>
      {snapshot ? (
        <div className="border border-gold/40 bg-ink p-4 text-sm">
          <p className="font-display uppercase tracking-wide text-gold">Offer preview</p>
          <ul className="mt-2 space-y-1 text-muted">
            <li>Requested: {requestedSpace}</li>
            <li>Offered: {snapshot.spaceName}</li>
            <li>Tier: {snapshot.pricingTier}</li>
            <li>Base: {money(snapshot.basePrice)}</li>
            <li>Add-ons: {snapshot.addOns.length ? snapshot.addOns.map((item) => `${item.name} ${money(item.lineTotal)}`).join(", ") : "none"}</li>
            <li>Total: {money(snapshot.total)}</li>
            <li>Payment due: {formatAdminDate(paymentDueOn || snapshot.paymentDueOn)}</li>
          </ul>
        </div>
      ) : (
        <p className="text-sm text-magenta">Complete the offer fields to preview pricing.</p>
      )}
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="confirm"
          value="yes"
          checked={confirm}
          onChange={(event) => setConfirm(event.target.checked)}
        />
        I confirm this offer and understand it locks the price snapshot.
      </label>
      <Button type="submit" disabled={!confirm || !snapshot}>
        Save approval offer
      </Button>
    </ActionForm>
  );
}
