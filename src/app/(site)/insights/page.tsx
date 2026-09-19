import type { Metadata } from "next";
import { ArticleCard } from "@/components/site/article-card";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { getArticles } from "@/lib/cms";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Insights",
    description:
      "Notes from Veloria on readiness, diligence and building a company that survives a second meeting.",
    path: "/insights",
  });
}

export default async function InsightsPage() {
  const articles = await getArticles();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Veloria", path: "/" },
          { name: "Insights", path: "/insights" },
        ])}
      />
      <section className="page-hero">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Insights</p>
            <h1 className="page-hero-title font-display">
              Notes from the desk.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream/65">
              LinkedIn articles on readiness, diligence and building a company that survives a
              second meeting.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
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
