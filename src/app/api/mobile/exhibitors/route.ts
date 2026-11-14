import { listPublishedVendors } from "@/lib/persistence/directory";

export const dynamic = "force-dynamic";

export async function GET() {
  const vendors = await listPublishedVendors();
  return Response.json(vendors.map(vendor => ({
    id: vendor.id,
    name: vendor.displayName,
    category: vendor.category,
    description: vendor.shortDescription,
  })));
}
