import Link from "next/link";
import { HeroSection } from "@/components/site/hero-section";
import { Reveal } from "@/components/site/reveal";
import { TrustMarquee } from "@/components/site/trust-marquee";
import { Magnetic } from "@/components/site/magnetic";
import { VScore } from "@/components/site/v-score";
import { Testimonials } from "@/components/site/testimonials";
import { IconCard } from "@/components/site/icon-card";
import { ArticleGrid } from "@/components/site/article-card";
import { Ornament } from "@/components/site/ornament";
import { getArticles, getPageBySlug, getServices, getSiteSettings } from "@/lib/cms";
import { mergeScorePillars } from "@/lib/score-pillars";
import { parseJsonArray } from "@/lib/utils";
import { Photo } from "@/components/site/photo";
import { IMAGES, approachIcon, audienceIcon, serviceIcon } from "@/lib/visual";

type Item = { title?: string; body?: string; mini?: string; value?: string | number; label?: string };
type Section = {
  type: string;
  label?: string;
  title?: string;
  body?: string;
  quote?: string;
  value?: string;
  caption?: string;
  items?: Item[] | string[];
};

export default async function HomePage() {
  const [settings, page, services, articles] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("home"),
    getServices(),
    getArticles(3),
  ]);

  const sections = parseJsonArray<Section>(page?.sections ?? "[]");
  const trust = sections.find((s) => s.type === "trust");
  const audiences = sections.find((s) => s.type === "audiences");
  const score = sections.find((s) => s.type === "score");
  const approach = sections.find((s) => s.type === "approach");
  const trustItems = (trust?.items ?? []) as string[];
  const audienceItems = (audiences?.items ?? []) as Item[];
  const scoreItems = mergeScorePillars((score?.items ?? []) as Item[]);
  const approachItems = (approach?.items ?? []) as Item[];
  const scoreValue = Number.parseInt(score?.value ?? "78", 10) || 78;

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

      <TrustMarquee items={trustItems} />

      <section id="who" className="relative py-[88px] md:py-[104px]">
        <Ornament className="absolute bottom-10 left-4 hidden h-28 w-28 lg:block" />
        <div className="container-v">
          <div className="mb-12 grid items-end gap-10 md:grid-cols-[1fr_.75fr] md:gap-[70px]">
            <Reveal>
              <h2 className="font-display text-[36px] font-medium leading-[1.18] text-ink md:text-[50px]">
                {audiences?.title ?? "Built for businesses beyond one stage or one industry."}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[15px] text-ink-soft">{audiences?.body}</p>
            </Reveal>
          </div>
          <Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {audienceItems.map((item, i) => (
              <IconCard
                key={item.title}
                variant="feature"
                icon={audienceIcon(item.title)}
                title={item.title ?? ""}
                body={item.body ?? ""}
                index={`0${i + 1}`}
              />
            ))}
          </div>
          </Reveal>
        </div>
      </section>

      <section id="services" className="bg-forest-950 py-[88px] text-cream md:py-[104px]">
        <div className="container-v">
          <div className="mb-14 grid items-end gap-10 md:grid-cols-[1fr_.75fr]">
            <Reveal>
              <h2 className="font-display text-[36px] font-medium leading-[1.18] md:text-[50px]">
                We strengthen the business behind the opportunity.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[15px] text-[#bac2bd]">
                The objective is not documentation for its own sake. It is to make the business more
                credible, defensible and ready for serious counterparties.
              </p>
            </Reveal>
          </div>
          <Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <IconCard
                key={service.id}
                href={`/services#${service.slug}`}
                variant="service"
                dark
                icon={serviceIcon(service.slug, service.title)}
                title={service.title}
                body={service.summary}
              />
            ))}
          </div>
          </Reveal>
          <Magnetic className="mt-10">
            <Link href="/services" className="btn-lux border border-cream/30 text-cream hover:bg-cream hover:text-forest-950">
              All services
            </Link>
          </Magnetic>
        </div>
      </section>

      <section id="score" className="bg-cream-deep py-[88px] md:py-[104px]">
        <div className="container-v">
          <Reveal className="mx-auto max-w-[720px] text-center">
            <p className="eyebrow mb-4">{score?.label ?? "A proprietary readiness framework"}</p>
            <h2 className="font-display text-[36px] font-medium leading-[1.18] md:text-[50px]">
              See your business the way a serious counterparty will.
            </h2>
            <p className="mx-auto mt-5 max-w-[620px] text-ink-soft">
              {score?.body}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <VScore
              value={scoreValue}
              caption={score?.caption ?? "Illustrative Business Readiness Index"}
              pillars={scoreItems}
            />
          </Reveal>
          <div className="mt-10 text-center">
            <Magnetic>
              <Link href="/legal-health-checkup" className="btn-lux btn-lux-fill">
                Take the Legal Health Checkup
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf6] py-[88px] md:py-[104px]">
        <div className="container-v">
          <div className="mb-12 grid items-end gap-10 md:grid-cols-[1fr_.75fr]">
            <Reveal>
              <h2 className="font-display text-[36px] font-medium leading-[1.18] md:text-[50px]">
                {approach?.title}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[15px] text-ink-soft">{approach?.body}</p>
            </Reveal>
          </div>
          <Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {approachItems.map((step) => (
              <IconCard
                key={step.title}
                variant="step"
                icon={approachIcon(step.title)}
                title={step.title ?? ""}
                body={step.body ?? ""}
                index={step.mini}
              />
            ))}
          </div>
          </Reveal>
        </div>
      </section>

      <ArticleGrid
        articles={articles}
        heading="Latest from Veloria."
        intro="Notes on readiness, diligence and building a company that can take a second meeting. Published on LinkedIn."
        viewAll
      />

      <Testimonials />

      <section id="circle" className="relative overflow-hidden bg-[#161512] py-[88px] text-cream md:py-[104px]">
        <Photo
          src={IMAGES.dinnerHero}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0a08] via-[#0b0a08]/80 to-[#0b0a08]/45" />
        <div className="container-v relative grid items-end gap-10 lg:grid-cols-[1.1fr_.7fr]">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-5">Founders Circle · Invitation only</p>
            <h2 className="font-display max-w-xl text-[40px] font-medium leading-[1.18] md:text-[56px]">
              An evening. Not a group.
            </h2>
            <p className="mt-5 max-w-md text-[15px] text-cream/70">
              A private dinner, thrown by Veloria. Invitations are extended. They are not requested.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Magnetic>
              <Link href="/founder-circle" className="btn-lux btn-lux-light">
                The evening
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="py-[88px] text-center md:py-[104px]">
        <div className="container-v">
          <Reveal>
            <p className="eyebrow mb-5">Veloria Advisory</p>
            <h2 className="font-display text-[44px] font-medium leading-[1.18] md:text-[64px]">
              Build before the opportunity arrives.
            </h2>
            <p className="mx-auto mt-5 max-w-[640px] text-ink-soft">
              Whether you are raising capital, entering a major transaction, expanding a business,
              taking on a project or simply professionalising the company, Veloria helps prepare the
              foundation first.
            </p>
            <Magnetic className="mt-8">
              <Link href="/contact" className="btn-lux btn-lux-fill">
                Speak with Veloria
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
