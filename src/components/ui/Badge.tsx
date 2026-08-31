import { cn } from "@/lib/cn";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "magenta" | "cyan" | "gold" | "lime";
  className?: string;
};

const tones = {
  magenta: "text-magenta border-magenta/50 bg-magenta/10",
  cyan: "text-cyan border-cyan/50 bg-cyan/10",
  gold: "text-gold border-gold/50 bg-gold/10",
  lime: "text-lime border-lime/50 bg-lime/10",
};

export function Badge({ children, tone = "magenta", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 font-pixel text-[10px] uppercase tracking-[0.18em] sm:text-[11px]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
