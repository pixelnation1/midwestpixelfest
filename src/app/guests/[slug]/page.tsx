import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { getAllGuests, getGuestBySlug } from "@/content/guests";
import { createPageMetadata } from "@/lib/seo";

type GuestPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuests().map((guest) => ({ slug: guest.slug }));
}

export async function generateMetadata({
  params,
}: GuestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guest = getGuestBySlug(slug);
  if (!guest) return {};

  return createPageMetadata({
    title: `${guest.name} | Midwest Pixel Fest Guests`,
    description: guest.bio,
    path: `/guests/${guest.slug}`,
  });
}

export default async function GuestProfilePage({ params }: GuestPageProps) {
  const { slug } = await params;
  const guest = getGuestBySlug(slug);

  if (!guest) {
    notFound();
  }

  return (
    <InnerPage
      path={`/guests/${guest.slug}`}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Guests", path: "/guests" },
        { name: guest.name },
      ]}
      eyebrow={guest.role}
      title={guest.name}
      intro={guest.bio}
    >
      <RelatedLinks
        links={[
          { href: "/guests", label: "All guests" },
          { href: "/schedule", label: "Schedule" },
          { href: "/tickets", label: "Tickets" },
        ]}
      />
    </InnerPage>
  );
}
