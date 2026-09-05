import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { Magnetic } from "@/components/site/magnetic";
import { getPageBySlug } from "@/lib/cms";
import { CIRCLE_CITIES, CIRCLE_GATHERINGS, CIRCLE_STANDARDS } from "@/lib/founder-circle";

export default async function FounderCirclePage() {
  const page = await getPageBySlug("founder-circle");

  return (
    <>
      <section className="relative min-h-[72svh] overflow-hidden bg-forest-950 px-6 pb-24 pt-28 text-cream md:pt-36">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Veloria Founders Circle</p>
            <h1 className="font-display max-w-4xl text-5xl font-medium tracking-tight md:text-7xl">
              This is not a{" "}
              <em className="font-serif font-normal italic text-signal">networking group.</em>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-cream/65">
              {page?.subtitle ??
                "A closed table for founders, promoters and investors who treat readiness as leverage. Convened with intention. Extended by invitation."}
            </p>
            <Magnetic className="mt-10">
              <Link href="/contact?intent=circle" className="btn-lux btn-lux-light">
                Request consideration
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      <section className="py-[88px] md:py-[104px]">
        <div className="container-v grid items-end gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-5">The philosophy</p>
            <h2 className="font-display text-[36px] font-medium leading-[1.06] md:text-[50px]">
              A closed circle. Chosen for the weight of what they are building.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="space-y-5 text-[16px] leading-relaxed text-ink-soft">
              <p>
                The Veloria Founders Circle is a private table. Every member is chosen for the
                texture of their thinking, the seriousness of the business, and the quality of their
                presence — not for a title on a card.
              </p>
              <p>
                No pitches. No elevator lines. No theatre. What happens instead is rarer:
                conversation that moves, problems that get named early, and relationships that do
                not require a transaction to begin.
              </p>
              <p className="font-display text-[22px] leading-snug text-ink">
                This is how serious companies used to find each other. Before the world taught
                operators to be useful before they were ready.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-[#fbfaf6] py-[88px] md:py-[104px]">
        <div className="container-v">
          <Reveal>
            <p className="eyebrow mb-5">The standard</p>
            <h2 className="mb-14 font-display text-[36px] font-medium leading-[1.06] md:text-[50px]">
              What the room requires of you.
            </h2>
          </Reveal>
          <div className="border-t border-ink/12">
            {CIRCLE_STANDARDS.map((item, i) => (
              <Reveal key={item.n} delay={i * 0.04}>
                <div
                  data-cursor
                  className="audience-row grid gap-4 border-b border-ink/12 py-8 md:grid-cols-[.28fr_.28fr_1fr] md:gap-10"
                >
                  <p className="text-[12px] tracking-[0.18em] text-gold">{item.n}</p>
                  <h3 className="font-display text-[26px] font-medium">{item.title}</h3>
                  <p className="max-w-[640px] text-[14px] text-ink-soft">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[88px] md:py-[104px]">
        <div className="container-v">
          <div className="mb-14 grid items-end gap-8 md:grid-cols-[1fr_.7fr]">
            <Reveal>
              <p className="eyebrow mb-5">How we gather</p>
              <h2 className="font-display text-[36px] font-medium leading-[1.06] md:text-[50px]">
                Four ways the Circle sits.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[15px] text-ink-soft">
                Membership is not a newsletter. It is a working room — dinners, clinics, reviews and
                briefings — convened when the table is worth sitting at.
              </p>
            </Reveal>
          </div>
          <div className="grid border-t border-ink/12 sm:grid-cols-2 lg:grid-cols-4">
            {CIRCLE_GATHERINGS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="approach-step min-h-[260px] border-b border-ink/12 px-6 py-8 lg:border-b-0 lg:border-r lg:last:border-r-0">
                  <p className="mb-10 text-[10px] uppercase tracking-[0.15em] text-gold">
                    {item.mini}
                  </p>
                  <h3 className="font-display text-[26px] font-medium">{item.title}</h3>
                  <p className="mt-3 text-[13px] text-ink-soft">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest-950 py-[88px] text-cream md:py-[104px]">
        <div className="container-v">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-5">Where we sit</p>
            <h2 className="mb-12 font-display text-[36px] font-medium leading-[1.06] md:text-[50px]">
              Six rooms. One table.
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 border border-white/12 sm:grid-cols-3">
            {CIRCLE_CITIES.map((item) => (
              <div
                key={item.city}
                className="flex min-h-[140px] flex-col justify-between border-white/12 p-6 max-sm:border-b sm:border-r sm:[&:nth-child(3n)]:border-r-0"
              >
                <p className="font-display text-[28px]">{item.city}</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-gold">{item.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[88px] md:py-[104px]">
        <div className="container-v grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5">Consideration</p>
            <h2 className="font-display text-[40px] font-medium leading-[1.05] md:text-[56px]">
              Requesting a seat is not the same as receiving one.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              Submitting signals interest only. It does not constitute membership. Those selected
              are contacted directly. We read every note.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bg-forest-900 p-8 text-cream md:p-10">
              <p className="eyebrow eyebrow-light mb-4">Apply</p>
              <h3 className="font-display text-3xl leading-tight">
                Build the company before you build the pitch.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-cream/65">
                Tell us your stage, the transaction or raise ahead, and what diligence still keeps
                you up at night. We review every application personally.
              </p>
              <Magnetic className="mt-8">
                <Link href="/contact?intent=circle" className="btn-lux bg-signal font-semibold text-forest-950">
                  Request consideration
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
