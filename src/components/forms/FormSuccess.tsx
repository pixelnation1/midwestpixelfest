import { RelatedLinks } from "@/components/ui/RelatedLinks";

type FormSuccessProps = {
  title: string;
  message: string | null;
  note?: string | null;
  links?: Array<{ href: string; label: string }>;
};

const defaultLinks = [
  { href: "/gaming", label: "Explore Gaming" },
  { href: "/cosplay", label: "Cosplay" },
  { href: "/travel", label: "Travel" },
  { href: "/news", label: "Latest News" },
];

export function FormSuccess({
  title,
  message,
  note = "We'll share official details as Midwest Pixel Fest planning moves forward.",
  links = defaultLinks,
}: FormSuccessProps) {
  return (
    <div className="border border-cyan/40 bg-panel p-8" role="status">
      <p className="font-pixel text-[11px] uppercase tracking-[0.2em] text-gold">
        Thank you
      </p>
      <h2 className="mt-3 font-display text-3xl uppercase tracking-wide">{title}</h2>
      {message ? <p className="mt-4 max-w-2xl text-muted">{message}</p> : null}
      {note ? <p className="mt-4 max-w-2xl text-muted">{note}</p> : null}
      {links.length > 0 ? (
        <RelatedLinks heading="Next" links={links} />
      ) : null}
    </div>
  );
}
