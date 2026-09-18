import { Reveal } from "@/components/site/reveal";
import { CornerMarks } from "@/components/site/ornament";
import { Photo } from "@/components/site/photo";
import { IMAGES } from "@/lib/visual";

export default function FounderCirclePage() {
  return (
    <>
      <section className="relative min-h-[88svh] overflow-hidden bg-forest-950 text-cream">
        <Photo
          src={IMAGES.dinnerHero}
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070806] via-[#070806]/55 to-[#070806]/25" />
        <div className="container-v relative flex min-h-[88svh] flex-col justify-end pb-16 pt-28 sm:pb-20 sm:pt-36">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">By invitation</p>
            <h1 className="page-hero-title font-display max-w-3xl">
              A table. A night. The room decides the rest.
            </h1>
            <p className="mt-6 max-w-md text-lg text-cream/70">
              Veloria hosts a private dinner. Invitations are sent. There is nothing to join.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-[#f7f3eb]">
        <div className="container-v grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative overflow-hidden">
              <Photo src={IMAGES.dinnerTable} className="aspect-[4/5] w-full object-cover" />
              <CornerMarks />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow mb-5">The evening</p>
            <h2 className="font-display text-[clamp(1.85rem,6vw,3rem)] font-medium leading-[1.18]">
              Royal in manner. Quiet in purpose.
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-soft">
              Founders, promoters and counterparties. One night. Conversation only. Veloria
              extends the invitation — never an open list, never an application.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Photo src={IMAGES.dinnerRoom} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="relative min-h-[420px]">
          <Photo src={IMAGES.dinnerGlass} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#070806]/35" />
          <div className="relative flex h-full min-h-[320px] items-end p-6 text-cream sm:p-10 md:min-h-[420px] md:p-14">
            <p className="font-display max-w-sm text-[28px] leading-[1.25]">
              If you are meant to be in the room, you will hear from us.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
