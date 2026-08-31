import type { Metadata, Viewport } from "next";
import { Barlow, Oswald, Pixelify_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { site } from "@/lib/site";
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
  title: {
    default: "Midwest Pixel Fest | Gaming, Cosplay & Pop Culture Convention",
    template: "%s | Midwest Pixel Fest",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Midwest Pixel Fest",
    "Emporia Kansas convention",
    "gaming convention",
    "cosplay",
    "collectibles",
    "PixelNation",
  ],
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
      </body>
    </html>
  );
}
