import { cn } from "@/lib/cn";

type CRTPanelProps = {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
  label?: string;
};

export function CRTPanel({
  children,
  className,
  screenClassName,
  label,
}: CRTPanelProps) {
  return (
    <div className={cn("crt-bezel bg-[#1a1524] p-3 sm:p-4", className)}>
      <div
        className={cn(
          "crt-screen relative overflow-hidden px-4 py-6 sm:px-6 sm:py-8",
          screenClassName,
        )}
      >
        <div className="crt-scanlines absolute inset-0" aria-hidden="true" />
        <div className="relative z-[1]">{children}</div>
      </div>
      {label ? (
        <p className="mt-3 text-center font-pixel text-[10px] uppercase tracking-[0.22em] text-muted">
          {label}
        </p>
      ) : null}
    </div>
  );
}
