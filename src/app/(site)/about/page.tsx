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
      <section className="relative overflow-hidden bg-forest-950 px-6 pb-24 pt-28 text-cream md:pt-36">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Who we work with</p>
            <h1 className="font-display max-w-4xl text-5xl font-medium leading-[1.18] tracking-tight md:text-7xl">
              {page?.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-cream/65">{page?.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-[88px]">
        <div className="container-v">
          <Reveal>
            <div className="prose-veloria max-w-3xl font-serif text-xl leading-relaxed text-ink md:text-2xl">
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
          <h2 className="font-display text-3xl md:text-4xl">Ready to strengthen the foundation?</h2>
          <Link href="/contact" className="btn-lux btn-lux-fill">
            Speak with Veloria
          </Link>
        </div>
      </section>
    </>
  );
}
