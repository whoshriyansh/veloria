import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo } from "@/components/site/photo";
import type { CmsArticle } from "@/lib/cms";

export function ArticleCard({
  article,
  featured = false,
}: {
  article: CmsArticle;
  featured?: boolean;
}) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor
      className={`article-card group ${featured ? "article-card-featured" : ""}`}
    >
      <div className="article-card-media">
        {article.imageUrl ? (
          <Photo src={article.imageUrl} />
        ) : (
          <div className="flex h-full items-center justify-center bg-forest-900 text-gold">
            {article.heading || "Insight"}
          </div>
        )}
      </div>
      <div className="article-card-body">
        <p className="eyebrow mb-2">{article.heading || "LinkedIn"}</p>
        <h3 className="font-display text-[22px] font-medium leading-snug md:text-[26px]">
          {article.title}
        </h3>
        <span className="mt-4 inline-flex items-center gap-1 text-[12px] tracking-wide text-moss transition group-hover:text-forest-900">
          Read on LinkedIn <ArrowUpRight size={14} />
        </span>
      </div>
    </a>
  );
}

export function ArticleGrid({
  articles,
  heading,
  intro,
  viewAll,
}: {
  articles: CmsArticle[];
  heading: string;
  intro?: string;
  viewAll?: boolean;
}) {
  if (!articles.length) return null;

  return (
    <section id="insights" className="bg-white py-[88px] md:py-[104px]">
      <div className="container-v">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">From the desk</p>
            <h2 className="font-display text-[36px] font-medium leading-[1.18] md:text-[48px]">
              {heading}
            </h2>
            {intro ? <p className="mt-3 max-w-[460px] text-[14px] text-ink-soft">{intro}</p> : null}
          </div>
          {viewAll ? (
            <Link href="/insights" className="btn-lux btn-lux-ghost">
              View all
            </Link>
          ) : null}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
