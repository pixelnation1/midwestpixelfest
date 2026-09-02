export const ADMIN_ROLES = ["owner", "admin", "staff"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(value: string): value is AdminRole {
  return (ADMIN_ROLES as readonly string[]).includes(value);
}

export function isOrganizerAuthorized(input: {
  userId: string | null;
  role: string | null;
  active: boolean | null;
}): boolean {
  return Boolean(input.userId && input.active && input.role && isAdminRole(input.role));
}
