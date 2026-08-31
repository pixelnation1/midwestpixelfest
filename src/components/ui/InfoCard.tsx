import { cn } from "@/lib/cn";

type InfoCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function InfoCard({ title, children, className }: InfoCardProps) {
  return (
    <article className={cn("border border-line bg-panel p-6 sm:p-8", className)}>
      <h3 className="font-display text-2xl uppercase tracking-wide text-paper">
        {title}
      </h3>
      <div className="mt-3 space-y-3 text-muted">{children}</div>
    </article>
  );
}
