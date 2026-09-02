import "server-only";

import { redirect } from "next/navigation";
import {
  isAdminRole,
  isOrganizerAuthorized,
  type AdminRole,
} from "@/lib/admin/authorization";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/public-env";

export type { AdminRole };
export { isAdminRole, isOrganizerAuthorized };

export type OrganizerSession = {
  userId: string;
  email: string | null;
  role: AdminRole;
  displayName: string;
};

export async function getOrganizerSession(): Promise<OrganizerSession | null> {
  if (!isSupabaseBrowserConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("admin_users")
    .select("role, display_name, active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data || !isOrganizerAuthorized({ userId: user.id, role: data.role, active: data.active })) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    role: data.role,
    displayName: data.display_name || user.email || "Organizer",
  };
}

export async function requireOrganizer(): Promise<OrganizerSession> {
  if (!isSupabaseBrowserConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const session = await getOrganizerSession();
  if (!session) redirect("/admin/login?unauthorized=1");
  return session;
}
