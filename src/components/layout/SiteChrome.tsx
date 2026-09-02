"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@/components/seo/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildSiteGraphJsonLd } from "@/lib/structured-data";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <div className="flex min-h-full flex-col bg-ink">{children}</div>;
  }

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <JsonLd data={buildSiteGraphJsonLd()} />
      <Analytics />
    </>
  );
}
