import Link from "next/link";

type RelatedLinksProps = {
  heading?: string;
  links: Array<{ href: string; label: string }>;
};

export function RelatedLinks({ heading = "Related pages", links }: RelatedLinksProps) {
  return (
    <nav aria-label={heading} className="mt-12">
      <h2 className="font-display text-xl uppercase tracking-wide">{heading}</h2>
      <ul className="mt-4 flex flex-wrap gap-3">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="border border-line px-3 py-2 font-display text-sm uppercase tracking-[0.14em] text-muted transition-colors hover:border-cyan hover:text-cyan"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
