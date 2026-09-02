import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { OrganizerSession } from "@/lib/admin/auth";

export async function recordOrganizerAudit(input: {
  action: string;
  entityType: string;
  entityId?: string | null;
  entityReference?: string | null;
  actor: OrganizerSession;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const { error } = await supabase.from("organizer_audit_log").insert({
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    entity_reference: input.entityReference ?? null,
    actor_user_id: input.actor.userId,
  });
  if (error) {
    console.error("organizer_audit_failed", { action: input.action, entityType: input.entityType });
  }
}
