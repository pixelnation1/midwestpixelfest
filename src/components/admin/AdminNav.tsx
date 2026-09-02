"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutOrganizer } from "@/app/actions/admin-auth";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/vendor-interests", label: "Vendor Interests" },
  { href: "/admin/vendors", label: "Vendor Applications" },
  { href: "/admin/sponsors", label: "Sponsors" },
  { href: "/admin/sponsor-inquiries", label: "Sponsor Inquiries" },
  { href: "/admin/payments", label: "Payments / Offers" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav({
  displayName,
  role,
}: {
  displayName: string;
  role: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-line bg-ink-2 lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="px-5 py-5">
        <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-gold">Organizer</p>
        <p className="mt-2 font-display text-xl uppercase tracking-wide text-paper">MPF 2027</p>
        <p className="mt-3 text-sm text-muted">{displayName}</p>
        <p className="text-xs uppercase tracking-wide text-cyan">{role}</p>
      </div>
      <nav aria-label="Organizer" className="px-3 pb-4">
        <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
          {NAV.map((item) => {
            const current =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-sm uppercase tracking-wide",
                    current ? "bg-panel text-cyan" : "text-muted hover:text-paper",
                  )}
                  aria-current={current ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-line px-5 py-4">
        <form action={signOutOrganizer}>
          <button type="submit" className="text-sm text-magenta underline-offset-2 hover:underline">
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
