import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";

export type BreadcrumbItem = {
  name: string;
  path?: string;
};

type InnerPageProps = {
  eyebrow?: string;
  title: string;
  intro: string;
  path: string;
  breadcrumbLabel?: string;
  crumbs?: BreadcrumbItem[];
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
  crumbs,
  children,
  after,
  className,
}: InnerPageProps) {
  const crumbLabel = breadcrumbLabel ?? title;
  const breadcrumbs =
    crumbs ??
    [
      { name: "Home", path: "/" },
      { name: crumbLabel, path },
    ];

  return (
    <div className={className}>
      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((crumb) => ({
            name: crumb.name,
            path: crumb.path ?? path,
          })),
        )}
      />
      <header className="relative overflow-hidden border-b border-line hero-atmosphere">
        <div className="pointer-events-none absolute inset-0 pixel-grid opacity-70" />
        <Container className="relative py-16 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 font-pixel text-[11px] uppercase tracking-[0.2em] text-muted">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={`${crumb.name}-${index}`} className="flex items-center gap-2">
                    {index > 0 ? (
                      <span aria-hidden="true" className="text-magenta">
                        /
                      </span>
                    ) : null}
                    {isLast || !crumb.path ? (
                      <span className="text-cyan" aria-current={isLast ? "page" : undefined}>
                        {crumb.name}
                      </span>
                    ) : (
                      <Link href={crumb.path} className="transition-colors hover:text-cyan">
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
          {eyebrow ? <Badge tone="cyan">{eyebrow}</Badge> : null}
          <h1 className="mt-5 max-w-4xl break-words font-display text-[clamp(1.85rem,7vw,4.5rem)] uppercase leading-[0.9] tracking-wide text-paper">
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
