import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatNewsDate, type NewsArticle } from "@/content/news";

type NewsCardProps = {
  article: NewsArticle;
};

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="flex h-full flex-col border border-line bg-panel p-6 transition-colors hover:border-cyan">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="cyan">{article.category}</Badge>
        <time
          dateTime={article.publishedAt}
          className="font-pixel text-[10px] uppercase tracking-[0.18em] text-gold"
        >
          {formatNewsDate(article.publishedAt)}
        </time>
      </div>
      <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-paper">
        <Link href={`/news/${article.slug}`} className="transition-colors hover:text-magenta">
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-muted">{article.excerpt}</p>
      <Link
        href={`/news/${article.slug}`}
        className="mt-6 font-display text-sm uppercase tracking-[0.2em] text-cyan hover:text-magenta"
      >
        Read more ▸
      </Link>
    </article>
  );
}
