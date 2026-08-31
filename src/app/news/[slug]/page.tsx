import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmailSignup } from "@/components/home/EmailSignup";
import { InnerPage } from "@/components/pages/InnerPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import {
  formatNewsDate,
  getAllNews,
  getNewsBySlug,
} from "@/content/news";
import { createPageMetadata } from "@/lib/seo";
import { buildArticleJsonLd } from "@/lib/structured-data";

type NewsArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllNews().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    return {};
  }

  return createPageMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/news/${article.slug}`,
    ogType: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <InnerPage
      path={`/news/${article.slug}`}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "News", path: "/news" },
        { name: article.title },
      ]}
      eyebrow={article.category}
      title={article.title}
      intro={article.excerpt}
      after={
        <EmailSignup
          eyebrow="Updates"
          title="Get the next announcement"
          description="Dates, applications, and guest news will hit this list first."
        />
      }
    >
      <JsonLd
        data={buildArticleJsonLd({
          title: article.title,
          excerpt: article.excerpt,
          slug: article.slug,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
        })}
      />
      <p className="mb-10 font-pixel text-[11px] uppercase tracking-[0.2em] text-gold">
        <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
        <span aria-hidden="true"> · </span>
        {article.category}
      </p>
      <div className="max-w-3xl space-y-10">
        {article.body.map((section) => (
          <section key={section.heading ?? section.paragraphs[0]}>
            {section.heading ? (
              <h2 className="font-display text-3xl uppercase tracking-wide text-paper">
                {section.heading}
              </h2>
            ) : null}
            <div className={section.heading ? "mt-4 space-y-4" : "space-y-4"}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-12">
        <Button href="/news" variant="secondary">
          Back to News
        </Button>
      </div>
      <RelatedLinks links={article.related} />
    </InnerPage>
  );
}
