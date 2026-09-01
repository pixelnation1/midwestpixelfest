import { cn } from "@/lib/cn";

type PixelDividerProps = {
  className?: string;
};

export function PixelDivider({ className }: PixelDividerProps) {
  return (
    <div
      className={cn("flex items-end justify-center gap-1 py-2", className)}
      aria-hidden="true"
    >
      <span className="h-2 w-2 bg-magenta" />
      <span className="h-3 w-2 bg-cyan" />
      <span className="h-2 w-2 bg-gold" />
      <span className="h-4 w-2 bg-magenta" />
      <span className="h-2 w-2 bg-lime" />
      <span className="h-3 w-2 bg-cyan" />
      <span className="h-2 w-2 bg-gold" />
      <span className="hidden h-4 w-2 bg-magenta sm:block" />
      <span className="hidden h-2 w-2 bg-cyan sm:block" />
      <span className="hidden h-3 w-2 bg-lime sm:block" />
    </div>
  );
}
