import type { BenefitId } from "@/lib/sponsorships";
import type { SponsorFulfillmentItem, SponsorshipCommitmentSnapshot } from "@/lib/sponsor-ops/types";

const BENEFIT_TO_FULFILLMENT: Partial<Record<BenefitId, SponsorFulfillmentItem["id"]>> = {
  sponsor_page_recognition: "website_recognition",
  digital_sponsor_recognition: "digital_materials",
  collective_social_thank_you: "social_recognition",
  general_event_signage: "signage",
  dedicated_social_recognition: "dedicated_social_post",
  digital_event_materials: "digital_materials",
  promotional_item_giveaway: "giveaway_opportunity",
  event_area_activity_sponsorship: "sponsored_area_programming",
  on_site_brand_activation: "activation",
  sponsor_activation_space: "activation",
  premier_placement: "website_recognition",
};

const FULFILLMENT_LABELS: Record<SponsorFulfillmentItem["id"], string> = {
  website_recognition: "Website recognition",
  social_recognition: "Social recognition",
  signage: "Signage (venue details TBA)",
  digital_materials: "Digital materials",
  giveaway_opportunity: "Giveaway opportunity",
  activation: "Activation",
  sponsored_area_programming: "Sponsored area / programming",
  dedicated_social_post: "Dedicated social post",
  custom_other: "Custom benefit",
};

export function createFulfillmentChecklist(
  snapshot: SponsorshipCommitmentSnapshot,
): SponsorFulfillmentItem[] {
  const ids = new Set<SponsorFulfillmentItem["id"]>();
  for (const benefit of snapshot.includedBenefits) {
    if (benefit.status === "not_included") continue;
    const mapped = BENEFIT_TO_FULFILLMENT[benefit.benefitId];
    if (mapped) ids.add(mapped);
  }
  if (snapshot.customBenefits.length > 0) ids.add("custom_other");
  if (snapshot.areasSponsored.length > 0) ids.add("sponsored_area_programming");

  return [...ids].map((id) => ({
    id,
    label: FULFILLMENT_LABELS[id],
    status: "not_started",
  }));
}

export function setFulfillmentStatus(
  items: readonly SponsorFulfillmentItem[],
  id: SponsorFulfillmentItem["id"],
  status: SponsorFulfillmentItem["status"],
): SponsorFulfillmentItem[] {
  return items.map((item) => (item.id === id ? { ...item, status } : item));
}
