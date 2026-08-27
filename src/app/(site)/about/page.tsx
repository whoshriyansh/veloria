import { Reveal } from "@/components/site/reveal";
import { getPageBySlug } from "@/lib/cms";
import { parseJsonArray } from "@/lib/utils";
import Link from "next/link";

type Principle = { title: string; body: string };

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  const sections = parseJsonArray<{ type: string; items?: Principle[] }>(
    page?.sections ?? "[]",
  );
  const principles = sections.find((s) => s.type === "principles")?.items ?? [];

  return (
    <>
      <section className="relative overflow-hidden bg-forest-950 px-6 pb-24 pt-40 text-cream md:pb-28 md:pt-48">
        <div className="aurora" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">About Veloria</p>
            <h1 className="font-display max-w-4xl text-5xl tracking-tight md:text-7xl">
              {page?.title ?? "Eternal Legal Counsel"}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-cream/65">
              {page?.subtitle}
            </p>
          </Reveal>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-3 bg-cream" />
      </section>

      <section className="bg-cream px-6 py-24 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_0.85fr]">
          <Reveal>
            <div className="prose-veloria font-serif text-xl leading-relaxed text-ink md:text-2xl">
              {page?.content}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-4">
              {principles.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-ink/8 bg-white/40 p-6"
                >
                  <h3 className="font-display text-2xl text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink/8 bg-cream px-6 py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            Ready for eternal counsel?
          </h2>
          <Link
            href="/contact"
            className="rounded-full bg-forest-900 px-6 py-3 text-sm font-medium text-cream"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  );
}
