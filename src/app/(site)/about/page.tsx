import { Reveal } from "@/components/site/reveal";
import { IconCard } from "@/components/site/icon-card";
import { getPageBySlug } from "@/lib/cms";
import { parseJsonArray } from "@/lib/utils";
import { audienceIcon } from "@/lib/visual";
import Link from "next/link";

type Audience = { title: string; body: string };

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  const sections = parseJsonArray<{ type: string; items?: Audience[] }>(page?.sections ?? "[]");
  const audiences = sections.find((s) => s.type === "audiences")?.items ?? [];

  return (
    <>
      <section className="page-hero">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Who we work with</p>
            <h1 className="page-hero-title font-display">
              {page?.title}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] text-cream/65 sm:mt-6 sm:text-lg">{page?.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-v">
          <Reveal>
            <div className="prose-veloria max-w-3xl font-serif text-[1.05rem] leading-relaxed text-ink sm:text-xl md:text-2xl">
              {page?.content}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {audiences.map((item, i) => (
                <IconCard
                  key={item.title}
                  variant="feature"
                  icon={audienceIcon(item.title)}
                  title={item.title}
                  body={item.body}
                  index={`0${i + 1}`}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink/10 py-16">
        <div className="container-v flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="font-display text-[clamp(1.75rem,5.5vw,2.5rem)] md:text-4xl">Ready to strengthen the foundation?</h2>
          <Link href="/contact" className="btn-lux btn-lux-fill">
            Speak with Veloria
          </Link>
        </div>
      </section>
    </>
  );
}
