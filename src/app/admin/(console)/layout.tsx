import { AdminShell } from "@/components/admin/AdminShell";
import { requireOrganizer } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizer = await requireOrganizer();
  return <AdminShell organizer={organizer}>{children}</AdminShell>;
}
