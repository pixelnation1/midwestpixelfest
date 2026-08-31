import { cn } from "@/lib/cn";

type ContentSectionProps = {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function ContentSection({
  id,
  title,
  children,
  className,
}: ContentSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-8 sm:py-10", className)}>
      <h2 className="font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">
        {title}
      </h2>
      <div className="mt-5 max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}
