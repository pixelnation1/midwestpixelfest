import type { Metadata, Viewport } from "next";
import { Barlow, Oswald, Pixelify_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { googleSiteVerification } from "@/lib/seo";
import { site } from "@/lib/site";
import { buildSiteGraphJsonLd } from "@/lib/structured-data";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["500", "600", "700"],
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.defaultTitle,
    template: "%s | Midwest Pixel Fest",
  },
  description: site.description,
  applicationName: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: site.defaultTitle,
    description: site.description,
    url: site.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: site.defaultTitle,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  // Set GOOGLE_SITE_VERIFICATION in the environment to connect Search Console.
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#07060d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${barlow.variable} ${pixelify.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink font-sans text-paper">
        <SkipLink />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd data={buildSiteGraphJsonLd()} />
      </body>
    </html>
  );
}
