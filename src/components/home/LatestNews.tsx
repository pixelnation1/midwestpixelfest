import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { NewsCard } from "@/components/news/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLatestNews } from "@/content/news";

export function LatestNews() {
  const articles = getLatestNews(3);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-line bg-ink-2 py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Updates"
            title="Latest news"
            description="Announcements live here first — dates, applications, guests, and everything else that should not vanish into a social post."
            tone="gold"
          />
          <Button href="/news" variant="secondary">
            Read All News
          </Button>
        </div>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <NewsCard article={article} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
