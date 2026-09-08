import { ArticleCard } from "@/components/site/article-card";
import { Reveal } from "@/components/site/reveal";
import { getArticles } from "@/lib/cms";

export default async function InsightsPage() {
  const articles = await getArticles();

  return (
    <>
      <section className="relative overflow-hidden bg-forest-950 px-6 pb-24 pt-28 text-cream md:pt-36">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Insights</p>
            <h1 className="font-display max-w-3xl text-5xl font-medium leading-[1.18] tracking-tight md:text-7xl">
              Notes from the desk.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream/65">
              LinkedIn articles on readiness, diligence and building a company that survives a
              second meeting.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-[88px]">
        <div className="container-v">
          {articles.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-ink-soft">Articles will appear here once published from the dashboard.</p>
          )}
        </div>
      </section>
    </>
  );
}
