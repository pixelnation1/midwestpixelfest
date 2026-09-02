import { AdminNav } from "@/components/admin/AdminNav";
import type { OrganizerSession } from "@/lib/admin/auth";

export function AdminShell({
  organizer,
  children,
}: {
  organizer: OrganizerSession;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <AdminNav displayName={organizer.displayName} role={organizer.role} />
      <div className="min-w-0 flex-1">
        <main id="admin-main" className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
