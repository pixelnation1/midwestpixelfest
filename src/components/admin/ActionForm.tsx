"use client";

import { useActionState } from "react";
import type { AdminActionState } from "@/app/actions/admin";

export function ActionForm({
  action,
  children,
  className,
}: {
  action: (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {
    status: "idle",
    message: "",
  } satisfies AdminActionState);

  return (
    <form action={formAction} className={className}>
      {state.status === "error" ? (
        <p className="mb-3 text-sm text-magenta" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" ? (
        <p className="mb-3 text-sm text-lime" role="status">
          {state.message}
        </p>
      ) : null}
      <fieldset disabled={pending} className="min-w-0 space-y-3">
        {children}
      </fieldset>
    </form>
  );
}
