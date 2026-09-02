import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Organizer",
  description: "Midwest Pixel Fest organizer tools.",
  path: "/admin",
  robots: { index: false, follow: false },
});

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
