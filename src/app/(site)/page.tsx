import Link from "next/link";
import { HeroSection } from "@/components/site/hero-section";
import { Reveal } from "@/components/site/reveal";
import { TrustMarquee } from "@/components/site/trust-marquee";
import { CountUp } from "@/components/site/count-up";
import { Magnetic } from "@/components/site/magnetic";
import { ScoreMatrix } from "@/components/site/score-matrix";
import { Testimonials } from "@/components/site/testimonials";
import { getClients, getPageBySlug, getServices, getSiteSettings } from "@/lib/cms";
import { mergeScorePillars } from "@/lib/score-pillars";
import { parseJsonArray } from "@/lib/utils";

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
  const [settings, page, services, clients] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("home"),
    getServices(),
    getClients(),
  ]);

  const sections = parseJsonArray<Section>(page?.sections ?? "[]");
  const trust = sections.find((s) => s.type === "trust");
  const audiences = sections.find((s) => s.type === "audiences");
  const score = sections.find((s) => s.type === "score");
  const approach = sections.find((s) => s.type === "approach");
  const circle = sections.find((s) => s.type === "circle");
  const trustItems = (trust?.items ?? []) as string[];
  const audienceItems = (audiences?.items ?? []) as Item[];
  const scoreItems = mergeScorePillars((score?.items ?? []) as Item[]);
  const approachItems = (approach?.items ?? []) as Item[];
  const scoreTitle = score?.title ?? "See your business the way a serious counterparty will.";

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

      <section id="who" className="py-[88px] md:py-[104px]">
        <div className="container-v">
          <div className="mb-14 grid items-end gap-10 md:grid-cols-[1fr_.75fr] md:gap-[70px]">
            <Reveal>
              <h2 className="font-display text-[36px] font-medium leading-[1.06] text-ink md:text-[50px]">
                {audiences?.title ?? "Built for businesses beyond one stage or one industry."}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[15px] text-ink-soft">{audiences?.body}</p>
            </Reveal>
          </div>
          <div className="border-t border-ink/12">
            {audienceItems.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <div
                  data-cursor
                  className="audience-row grid gap-4 border-b border-ink/12 py-7 md:grid-cols-[.85fr_1.6fr] md:gap-[50px]"
                >
                  <h3 className="font-display text-[26px] font-medium md:text-[28px]">{item.title}</h3>
                  <p className="max-w-[720px] text-[14px] text-ink-soft">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-forest-950 py-[88px] text-cream md:py-[104px]">
        <div className="container-v">
          <div className="mb-14 grid items-end gap-10 md:grid-cols-[1fr_.75fr]">
            <Reveal>
              <h2 className="font-display text-[36px] font-medium leading-[1.06] md:text-[50px]">
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
          <div className="grid gap-[60px] lg:grid-cols-2">
            <Reveal>
              <div className="border-t border-white/15 pt-[30px]">
                <p className="eyebrow eyebrow-light mb-4">Core Advisory</p>
                <h3 className="font-display text-[32px] font-medium leading-[1.08] md:text-[40px]">
                  Business Readiness & Transaction Advisory
                </h3>
                <p className="mt-[18px] max-w-[520px] text-[#bcc4bf]">
                  We review businesses through the lens of an investor, institutional counterparty or
                  sophisticated buyer, identify weaknesses early and help strengthen what matters
                  before the opportunity arrives.
                </p>
                <Magnetic className="mt-8">
                  <Link href="/services" className="btn-lux border border-cream/30 text-cream hover:bg-cream hover:text-forest-950">
                    All services
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
            <div className="border-t border-white/15">
              {services.map((service, i) => (
                <Reveal key={service.id} delay={i * 0.04}>
                  <Link
                    href={`/services#${service.slug}`}
                    className="service-item group block border-b border-white/15 py-[22px]"
                  >
                    <strong className="block text-[14px] font-medium group-hover:text-signal">
                      {service.title}
                    </strong>
                    <span className="mt-1.5 block text-[13px] text-[#b7c0ba]">{service.summary}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="score" className="bg-cream-deep py-[88px] md:py-[104px]">
        <div className="container-v grid items-start gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-[78px]">
          <Reveal>
            <div className="score-card flex min-h-[355px] flex-col justify-between bg-forest-950 p-[38px] text-cream">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gold">The Veloria Score™</p>
              <p className="font-display text-[88px] leading-[0.85] md:text-[116px]">
                <CountUp value={Number.parseInt(score?.value ?? "78", 10) || 78} />
                <small className="ml-2 font-sans text-[13px] text-[#c6cec9]">/ 100</small>
              </p>
              <p className="text-[13px] text-[#c5cdc8]">{score?.caption}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative overflow-visible">
            <p className="eyebrow mb-4">{score?.label}</p>
            <h2 className="font-display text-[36px] font-medium leading-[1.07] md:text-[50px]">
              {scoreTitle.includes("the way a serious counterparty will") ? (
                <>
                  See your business{" "}
                  <span className="mark-signal">the way a serious counterparty will.</span>
                </>
              ) : (
                scoreTitle
              )}
            </h2>
            <p className="mt-[18px] max-w-[650px] text-ink-soft">{score?.body}</p>
            <ScoreMatrix items={scoreItems} />
            <p className="mt-3 text-[11px] text-ink-soft">
              Composite {score?.value ?? "78"} — the average of the six pillar scores.
            </p>
            <Magnetic className="mt-8">
              <Link href="/legal-health-checkup" className="btn-lux btn-lux-fill">
                Take the Legal Health Checkup
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#fbfaf6] py-[88px] md:py-[104px]">
        <div className="container-v">
          <div className="mb-14 grid items-end gap-10 md:grid-cols-[1fr_.75fr]">
            <Reveal>
              <h2 className="font-display text-[36px] font-medium leading-[1.06] md:text-[50px]">
                {approach?.title}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[15px] text-ink-soft">{approach?.body}</p>
            </Reveal>
          </div>
          <div className="grid border-t border-ink/12 sm:grid-cols-2 lg:grid-cols-4">
            {approachItems.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <div className="approach-step min-h-[230px] border-b border-ink/12 px-6 py-7 lg:border-b-0 lg:border-r lg:last:border-r-0">
                  <p className="mb-11 text-[10px] uppercase tracking-[0.15em] text-gold">
                    {step.mini}
                  </p>
                  <h3 className="font-display text-[28px] font-medium">{step.title}</h3>
                  <p className="mt-3 text-[13px] text-ink-soft">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="clients" className="bg-white py-[88px] md:py-[104px]">
        <div className="container-v">
          <div className="mb-9 flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <Reveal>
              <h2 className="font-display text-[40px] font-medium md:text-[48px]">
                Companies on board.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-[460px] text-[14px] text-ink-soft">
                Businesses and organisations working with Veloria. Logos and names are managed from
                the admin dashboard.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 border border-ink/12 sm:grid-cols-3 lg:grid-cols-5">
            {(clients.length ? clients : [{ id: "p", name: "Your company", logoUrl: "" }]).map(
              (client) => (
                <div
                  key={client.id}
                  className="logo-cell flex min-h-[130px] items-center justify-center border-ink/12 bg-[#fcfbf8] p-3.5 text-center font-display text-[20px] text-[#6c746f] max-lg:border-b lg:border-r lg:last:border-r-0"
                >
                  {client.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={client.logoUrl} alt={client.name} className="max-h-10 max-w-[140px] object-contain" />
                  ) : (
                    client.name
                  )}
                </div>
              ),
            )}
          </div>
          <p className="mt-3.5 text-[11px] text-ink-soft">
            Client identities are published only where permission has been given.
          </p>
        </div>
      </section>

      <Testimonials />

      <section id="circle" className="bg-[#232c28] py-[88px] text-cream md:py-[104px]">
        <div className="container-v grid items-center gap-12 lg:grid-cols-2 lg:gap-[72px]">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-5">Veloria Founders Circle · Invitation only</p>
            <h2 className="font-display text-[40px] font-medium leading-[1.05] md:text-[52px]">
              This is not a networking group.
            </h2>
            <p className="my-[18px] max-w-xl text-[#bdc5c0]">
              A closed table for founders, promoters and investors who treat readiness as leverage.
              Convened with intention. Extended after a conversation — never after a form.
            </p>
            <Magnetic>
              <Link href="/founder-circle" className="btn-lux btn-lux-light">
                Explore the Circle
              </Link>
            </Magnetic>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="border-l border-gold pl-8 font-display text-[26px] leading-[1.35] md:text-[29px]">
              “{circle?.quote ?? "Build the company before you build the pitch."}”
            </p>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="py-[88px] text-center md:py-[104px]">
        <div className="container-v">
          <Reveal>
            <p className="eyebrow mb-5">Veloria Advisory</p>
            <h2 className="font-display text-[44px] font-medium leading-[1.04] md:text-[64px]">
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
