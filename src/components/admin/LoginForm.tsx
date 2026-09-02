"use client";

import { useActionState } from "react";
import { signInOrganizer, type AuthFormState } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/Button";

export function LoginForm({ next, unauthorized }: { next: string; unauthorized: boolean }) {
  const [state, action, pending] = useActionState(signInOrganizer, {
    status: "idle",
    message: "",
  } satisfies AuthFormState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {unauthorized ? (
        <p className="text-sm text-magenta" role="alert">
          This account is signed in but is not an active organizer. Sign out and use an authorized
          account.
        </p>
      ) : null}
      {state.status === "error" ? (
        <p className="text-sm text-magenta" role="alert">
          {state.message}
        </p>
      ) : null}
      <label className="block text-sm">
        Email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-1 w-full border border-line bg-ink px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full border border-line bg-ink px-3 py-2"
        />
      </label>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
