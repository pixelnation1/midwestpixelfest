import type { Metadata } from "next";
import { EmailSignup } from "@/components/home/EmailSignup";
import { InnerPage } from "@/components/pages/InnerPage";
import { NewsCard } from "@/components/news/NewsCard";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { getAllNews } from "@/content/news";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "News | Midwest Pixel Fest",
  description:
    "Official Midwest Pixel Fest news and announcements for the Emporia, Kansas convention — dates, vendors, guests, and planning updates.",
  path: "/news",
});

export default function NewsPage() {
  const articles = getAllNews();

  return (
    <InnerPage
      path="/news"
      breadcrumbLabel="News"
      eyebrow="Updates"
      title="News"
      intro="This is the permanent home for Midwest Pixel Fest announcements. If it matters — dates, applications, guests, travel — it will be posted here."
      after={<EmailSignup />}
    >
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <li key={article.slug}>
            <NewsCard article={article} />
          </li>
        ))}
      </ul>
      <RelatedLinks
        links={[
          { href: "/about", label: "About" },
          { href: "/faq", label: "FAQ" },
          { href: "/schedule", label: "Schedule" },
          { href: "/tickets", label: "Tickets" },
        ]}
      />
    </InnerPage>
  );
}
