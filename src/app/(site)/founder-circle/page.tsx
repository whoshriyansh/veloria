import { Reveal } from "@/components/site/reveal";
import { getPageBySlug } from "@/lib/cms";
import Link from "next/link";

export default async function FounderCirclePage() {
  const page = await getPageBySlug("founder-circle");

  return (
    <>
      <section className="relative min-h-[60svh] overflow-hidden bg-forest-950 px-6 pb-24 pt-28 text-cream md:pt-36">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Veloria Founders Circle</p>
            <h1 className="font-display max-w-4xl text-5xl font-medium tracking-tight md:text-7xl">
              {page?.title ?? "A network around stronger businesses."}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-cream/65">{page?.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-[88px]">
        <div className="container-v grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <Reveal>
            <div className="prose-veloria font-serif text-xl leading-relaxed md:text-2xl">
              {page?.content}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bg-forest-900 p-8 text-cream">
              <p className="eyebrow eyebrow-light mb-4">Apply</p>
              <h2 className="font-display text-3xl">Build the company before you build the pitch.</h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/65">
                Tell us your stage and what diligence still keeps you up at night. We review every
                application personally.
              </p>
              <Link
                href="/contact"
                className="btn-lux mt-8 bg-signal font-semibold text-forest-950"
              >
                Explore the Circle
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
