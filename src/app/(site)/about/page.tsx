import { Reveal } from "@/components/site/reveal";
import { getPageBySlug } from "@/lib/cms";
import { parseJsonArray } from "@/lib/utils";
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
            <h1 className="font-display max-w-4xl text-5xl font-medium tracking-tight md:text-7xl">
              {page?.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-cream/65">{page?.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-[88px]">
        <div className="container-v grid gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal>
            <div className="prose-veloria font-serif text-xl leading-relaxed text-ink md:text-2xl">
              {page?.content}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="border-t border-ink/12">
              {audiences.map((item) => (
                <div key={item.title} className="audience-row border-b border-ink/12 py-6">
                  <h3 className="font-display text-2xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{item.body}</p>
                </div>
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
