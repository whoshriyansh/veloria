import Link from "next/link";
import { HeroSection } from "@/components/site/hero-section";
import { Reveal } from "@/components/site/reveal";
import { getPageBySlug, getServices, getSiteSettings } from "@/lib/cms";
import { parseJsonArray } from "@/lib/utils";

type StatItem = { value: string; label: string };
type SplitSection = {
  type: string;
  label?: string;
  title?: string;
  body?: string;
  items?: StatItem[];
};

export default async function HomePage() {
  const [settings, page, services] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("home"),
    getServices(),
  ]);

  const sections = parseJsonArray<SplitSection>(page?.sections ?? "[]");
  const stats = sections.find((s) => s.type === "stats");
  const split = sections.find((s) => s.type === "split");

  return (
    <>
      <HeroSection
        headline={settings.heroHeadline}
        subheadline={settings.heroSubheadline}
        ctaLabel={settings.heroCtaLabel}
        ctaHref={settings.heroCtaHref}
        aboutPreview={settings.aboutPreview}
        logoText={settings.logoText}
      />

      <section className="relative overflow-hidden bg-cream px-6 py-24 md:py-32">
        <div className="aurora-soft bottom-[-20%] right-[-10%] opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow mb-6">{stats?.label ?? "VELORIA AT A GLANCE"}</p>
            <p className="font-serif max-w-3xl text-2xl leading-relaxed text-ink md:text-3xl">
              {page?.content}
            </p>
          </Reveal>

          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(stats?.items ?? []).map((item, i) => (
              <Reveal key={item.value} delay={i * 0.08}>
                <div className="h-full rounded-[1.5rem] bg-[#f8f5ef] p-6 md:p-7">
                  <p className="font-display text-5xl tracking-tight text-moss md:text-6xl">
                    {item.value}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {split ? (
        <section className="border-t border-ink/8 bg-cream px-6 py-24 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <Reveal>
              <p className="eyebrow mb-4">{split.label}</p>
              <h2 className="font-display text-4xl tracking-tight text-ink md:text-5xl">
                {split.title}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-base leading-relaxed text-ink-soft md:text-lg">{split.body}</p>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="bg-forest-900 px-6 py-24 text-cream md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow eyebrow-light mb-4">Capabilities</p>
                <h2 className="font-display text-4xl tracking-tight md:text-5xl">
                  Ways we make you raise-ready
                </h2>
              </div>
              <Link
                href="/services"
                className="text-sm tracking-[0.14em] text-cream/60 transition hover:text-cream"
              >
                VIEW ALL SERVICES →
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-[1.75rem] bg-cream/10 md:grid-cols-2">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.06}>
                <Link
                  href={`/services#${service.slug}`}
                  className="group block bg-forest-950/60 p-8 transition hover:bg-forest-800/80 md:p-10"
                >
                  <p className="text-xs tracking-[0.2em] text-signal/70">0{i + 1}</p>
                  <h3 className="font-display mt-4 text-3xl tracking-tight transition group-hover:text-signal">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/60">
                    {service.summary}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-cream px-6 py-28">
        <div className="aurora-soft left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="font-display watermark absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[28vw] text-forest-900/[0.04] md:text-[12rem]">
              Veloria
            </p>
            <p className="eyebrow mb-5">Next step</p>
            <h2 className="font-display text-4xl tracking-tight text-ink md:text-6xl">
              Know your readiness in fifteen questions.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-ink-soft">
              Free Legal Health Checkup. No price tags. No pitch decks required — just honest answers
              and a call from counsel who know what investors ask.
            </p>
            <Link
              href="/legal-health-checkup"
              className="mt-10 inline-flex rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-forest-950"
            >
              Start Legal Health Checkup
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
