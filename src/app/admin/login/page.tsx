import { LoginForm } from "@/components/admin/LoginForm";
import { signOutOrganizer } from "@/app/actions/admin-auth";
import { createPageMetadata } from "@/lib/seo";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/public-env";

export const metadata = createPageMetadata({
  title: "Organizer sign in",
  description: "Midwest Pixel Fest organizer sign-in.",
  path: "/admin/login",
  robots: { index: false, follow: false },
});

type LoginPageProps = {
  searchParams: Promise<{ next?: string; unauthorized?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next?.startsWith("/admin") ? params.next : "/admin";
  const unauthorized = params.unauthorized === "1";
  const configured = isSupabaseBrowserConfigured();

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-gold">Organizer</p>
      <h1 className="mt-3 font-display text-4xl uppercase tracking-wide">Sign in</h1>
      <p className="mt-3 text-muted">
        This area is for Midwest Pixel Fest organizers. There is no public account signup.
      </p>
      {!configured ? (
        <p className="mt-6 border border-gold/40 bg-panel p-4 text-sm text-gold">
          Supabase is not connected. Add the project URL and anon key before organizer sign-in will
          work.
        </p>
      ) : (
        <div className="mt-8 border border-line bg-panel p-6">
          <LoginForm next={next} unauthorized={unauthorized} />
        </div>
      )}
      {unauthorized ? (
        <form action={signOutOrganizer} className="mt-4">
          <button type="submit" className="text-sm text-magenta underline-offset-2 hover:underline">
            Sign out of this account
          </button>
        </form>
      ) : null}
    </div>
  );
}
