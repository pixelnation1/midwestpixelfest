import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Cta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
};

type CtaStripProps = {
  title?: string;
  children?: React.ReactNode;
  actions: Cta[];
  className?: string;
};

export function CtaStrip({ title, children, actions, className }: CtaStripProps) {
  return (
    <div className={cn("border border-line bg-panel p-6 sm:p-8", className)}>
      {title ? (
        <h2 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
          {title}
        </h2>
      ) : null}
      {children ? (
        <div className={cn("max-w-2xl text-muted", title ? "mt-3" : undefined)}>{children}</div>
      ) : null}
      <div className={cn("flex flex-wrap gap-4", Boolean(title || children) && "mt-6")}>
        {actions.map((action) => (
          <Button key={action.href + action.label} href={action.href} variant={action.variant}>
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
