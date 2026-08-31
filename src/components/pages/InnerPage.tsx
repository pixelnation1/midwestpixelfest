import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";

type InnerPageProps = {
  eyebrow?: string;
  title: string;
  intro: string;
  children: React.ReactNode;
  after?: React.ReactNode;
  className?: string;
};

export function InnerPage({
  eyebrow,
  title,
  intro,
  children,
  after,
  className,
}: InnerPageProps) {
  return (
    <div className={className}>
      <header className="relative overflow-hidden border-b border-line hero-atmosphere">
        <div className="pointer-events-none absolute inset-0 pixel-grid opacity-70" />
        <Container className="relative py-16 sm:py-20">
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
