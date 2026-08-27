import { Reveal } from "@/components/site/reveal";
import { getPageBySlug } from "@/lib/cms";
import Link from "next/link";

export default async function FounderCirclePage() {
  const page = await getPageBySlug("founder-circle");

  return (
    <>
      <section className="relative min-h-[70svh] overflow-hidden bg-forest-950 px-6 pb-24 pt-40 text-cream md:pt-48">
        <div className="aurora" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(110,240,164,0.18),transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Invitation only</p>
            <h1 className="font-display max-w-4xl text-5xl tracking-tight md:text-7xl">
              {page?.title ?? "Founder Circle"}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-cream/65">{page?.subtitle}</p>
          </Reveal>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-3 bg-cream" />
      </section>

      <section className="relative overflow-hidden bg-cream px-6 py-24 md:py-28">
        <div className="aurora-soft right-[-15%] top-10 opacity-45" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <div className="prose-veloria font-serif text-xl leading-relaxed text-ink md:text-2xl">
              {page?.content}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[1.75rem] bg-forest-900 p-8 text-cream">
              <p className="eyebrow eyebrow-light mb-4">Apply</p>
              <h2 className="font-display text-3xl tracking-tight">
                Built for operators who treat legal as leverage.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/65">
                Tell us your stage, last raise, and what diligence still keeps you up at night. We
                review every application personally.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex rounded-full bg-signal px-5 py-3 text-sm font-semibold text-forest-950"
              >
                Request an invitation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
