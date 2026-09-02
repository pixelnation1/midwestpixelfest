import { cn } from "@/lib/cn";

const TONES: Record<string, string> = {
  submitted: "text-cyan border-cyan/40",
  under_review: "text-gold border-gold/40",
  approved: "text-lime border-lime/40",
  invoice_sent: "text-gold border-gold/40",
  payment_overdue: "text-magenta border-magenta/40",
  confirmed: "text-lime border-lime/40",
  waitlisted: "text-muted border-line",
  declined: "text-muted border-line",
  withdrawn: "text-muted border-line",
  cancelled: "text-magenta border-magenta/40",
  inquiry_received: "text-cyan border-cyan/40",
  contacted: "text-gold border-gold/40",
  negotiating: "text-gold border-gold/40",
  committed: "text-lime border-lime/40",
  invoice_created: "text-gold border-gold/40",
  paid: "text-lime border-lime/40",
  assets_needed: "text-magenta border-magenta/40",
  assets_received: "text-cyan border-cyan/40",
  active: "text-lime border-lime/40",
  completed: "text-muted border-line",
  new: "text-cyan border-cyan/40",
  converted: "text-lime border-lime/40",
  closed: "text-muted border-line",
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex border px-2 py-0.5 font-pixel text-[10px] uppercase tracking-[0.14em]",
        TONES[status] ?? "text-paper border-line",
      )}
    >
      {label}
    </span>
  );
}
