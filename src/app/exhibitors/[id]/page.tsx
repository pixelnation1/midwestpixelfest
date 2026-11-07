import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getPublishedVendorById } from "@/lib/persistence/directory";
import { createPageMetadata } from "@/lib/seo";
import { parseAllowedHttpUrl } from "@/lib/safe-url";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const exhibitor = await getPublishedVendorById(id);
  if (!exhibitor) return createPageMetadata({
    title: "Exhibitor Not Found | Midwest Pixel Fest",
    description: "Browse approved exhibitors at Midwest Pixel Fest.",
    path: "/exhibitors",
    robots: { index: false, follow: true },
  });
  return createPageMetadata({
    title: exhibitor.displayName + " | Midwest Pixel Fest Exhibitors",
    description: exhibitor.shortDescription ||
      ("Meet " + exhibitor.displayName + " at the Midwest Pixel Fest marketplace in Emporia, Kansas."),
    path: "/exhibitors/" + id,
  });
}

export default async function ExhibitorProfilePage({ params }: Props) {
  const { id } = await params;
  const exhibitor = await getPublishedVendorById(id);
  if (!exhibitor) notFound();

  const logo = exhibitor.logo ? parseAllowedHttpUrl(exhibitor.logo)?.href : null;
  const website = exhibitor.website ? parseAllowedHttpUrl(exhibitor.website)?.href : null;
  const social = exhibitor.socialUrl ? parseAllowedHttpUrl(exhibitor.socialUrl)?.href : null;

  return <main className="min-h-[65vh]">
    <div className="relative border-b border-cyan/30 bg-[#0b1026]">
      <div className="pixel-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <Container className="relative py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap gap-2 font-pixel text-[11px] uppercase tracking-widest text-muted">
          <Link href="/" className="text-cyan hover:text-gold">Home</Link>
          <span aria-hidden="true" className="text-magenta">/</span>
          <Link href="/exhibitors" className="text-cyan hover:text-gold">Exhibitors</Link>
          <span aria-hidden="true" className="text-magenta">/</span>
          <span aria-current="page">{exhibitor.displayName}</span>
        </nav>
        <p className="font-pixel text-[11px] uppercase tracking-[.15em] text-gold">{exhibitor.exhibitorType}</p>
        <h1 className="mt-4 max-w-5xl break-words font-display text-[clamp(2.8rem,8vw,5.5rem)] uppercase leading-[.95] tracking-wide text-paper">
          {exhibitor.displayName}
        </h1>
        {exhibitor.category && <p className="mt-5 text-lg text-cyan">{exhibitor.category}</p>}
      </Container>
    </div>
    <Container className="grid gap-8 py-12 md:grid-cols-[minmax(250px,.8fr)_minmax(0,1.2fr)] sm:py-16">
      <div className="flex aspect-square min-h-[260px] items-center justify-center overflow-hidden border border-cyan/20 bg-[radial-gradient(circle_at_25%_25%,rgba(45,226,255,.15),transparent_50%),radial-gradient(circle_at_80%_75%,rgba(255,45,149,.2),transparent_55%)]">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={exhibitor.displayName + " approved logo"} className="h-full w-full object-contain p-8" />
        ) : (
          <span aria-hidden="true" className="font-display text-9xl text-cyan/60">
            {exhibitor.displayName.trim().charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Meet the exhibitor</p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">What you'll find</h2>
        <p className="mt-5 whitespace-pre-wrap break-words text-lg leading-relaxed text-muted">
          {exhibitor.shortDescription ||
            "Come meet this confirmed exhibitor at the Midwest Pixel Fest marketplace."}
        </p>

        <div className="mt-8 border border-line bg-panel p-5 sm:p-6">
          <p className="font-pixel text-[10px] uppercase tracking-widest text-gold">Where to find them</p>
          <h3 className="mt-3 font-display text-2xl uppercase text-paper">
            {exhibitor.boothLocation ? "Booth " + exhibitor.boothLocation : "Booth assignment coming soon"}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Booth locations and event arrangements are subject to the finalized venue floor plan.
            The exact location will be updated when assigned.
          </p>
        </div>

        {(website || social) && <div className="mt-7 flex flex-wrap gap-3">
          {website && <a href={website} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wide text-cyan hover:bg-cyan/10">
            Exhibitor website <span className="sr-only">(opens in new tab)</span>
          </a>}
          {social && <a href={social} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center border border-magenta px-5 py-3 font-display text-sm uppercase tracking-wide text-magenta hover:bg-magenta/10">
            Social profile <span className="sr-only">(opens in new tab)</span>
          </a>}
        </div>}

        <div className="mt-9 border-t border-line pt-6">
          <Link href="/exhibitors" className="inline-flex min-h-11 items-center font-display text-sm uppercase tracking-widest text-cyan hover:text-gold">
            ← Browse all exhibitors
          </Link>
        </div>
      </div>
    </Container>
  </main>;
}
