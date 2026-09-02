"use server";

import { getOrganizerSession } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/public-env";

export type AuthFormState = { status: "idle" | "error"; message: string };

export async function signInOrganizer(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!isSupabaseBrowserConfigured()) {
    return { status: "error", message: "Organizer sign-in is not connected yet." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Organizer sign-in is not connected yet." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { status: "error", message: "Sign-in failed. Check your email and password." };
  }

  const organizer = await getOrganizerSession();
  const next = String(formData.get("next") ?? "/admin");
  if (!organizer) {
    redirect("/admin/login?unauthorized=1");
  }
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutOrganizer(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
