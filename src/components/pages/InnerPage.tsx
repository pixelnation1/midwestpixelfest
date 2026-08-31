import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";

type InnerPageProps = {
  eyebrow?: string;
  title: string;
  intro: string;
  path: string;
  breadcrumbLabel?: string;
  children: React.ReactNode;
  after?: React.ReactNode;
  className?: string;
};

export function InnerPage({
  eyebrow,
  title,
  intro,
  path,
  breadcrumbLabel,
  children,
  after,
  className,
}: InnerPageProps) {
  const crumbLabel = breadcrumbLabel ?? title;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: crumbLabel, path },
  ];

  return (
    <div className={className}>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <header className="relative overflow-hidden border-b border-line hero-atmosphere">
        <div className="pointer-events-none absolute inset-0 pixel-grid opacity-70" />
        <Container className="relative py-16 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 font-pixel text-[10px] uppercase tracking-[0.2em] text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-cyan">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-magenta">
                /
              </li>
              <li className="text-cyan" aria-current="page">
                {crumbLabel}
              </li>
            </ol>
          </nav>
          {eyebrow ? <Badge tone="cyan">{eyebrow}</Badge> : null}
          <h1 className="mt-5 max-w-4xl font-display text-5xl uppercase leading-[0.9] tracking-wide text-paper sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>
        </Container>
      </header>
      <Container className="py-12 sm:py-16">{children}</Container>
      {after}
    </div>
  );
}
