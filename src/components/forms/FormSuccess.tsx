import { RelatedLinks } from "@/components/ui/RelatedLinks";

type FormSuccessProps = {
  title: string;
  message: string | null;
};

export function FormSuccess({ title, message }: FormSuccessProps) {
  return (
    <div className="border border-cyan/40 bg-panel p-8" role="status">
      <p className="font-pixel text-[11px] uppercase tracking-[0.2em] text-gold">
        Thank you
      </p>
      <h2 className="mt-3 font-display text-3xl uppercase tracking-wide">{title}</h2>
      {message ? <p className="mt-4 max-w-2xl text-muted">{message}</p> : null}
      <p className="mt-4 max-w-2xl text-muted">
        We&apos;ll share official details as Midwest Pixel Fest planning moves
        forward.
      </p>
      <RelatedLinks
        heading="Meanwhile"
        links={[
          { href: "/gaming", label: "Explore Gaming" },
          { href: "/cosplay", label: "Cosplay" },
          { href: "/travel", label: "Travel" },
          { href: "/news", label: "Latest News" },
        ]}
      />
    </div>
  );
}
