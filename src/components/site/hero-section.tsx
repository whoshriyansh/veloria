import Link from "next/link";
import { FadeIn } from "@/components/site/reveal";

export function HeroSection({
  headline,
  subheadline,
  ctaLabel,
  ctaHref,
  aboutPreview,
  logoText,
}: {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  aboutPreview: string;
  logoText: string;
}) {
  const words = headline.split(" ");
  const primary = words.slice(0, Math.max(1, words.length - 1)).join(" ");
  const accent = words[words.length - 1] ?? "";

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-forest-950 text-cream">
      <div className="aurora" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,20,16,0.55)_70%,rgba(6,20,16,0.92)_100%)]" />

      <div
        aria-hidden
        className="watermark absolute bottom-[-4%] left-1/2 w-[140%] -translate-x-1/2 text-center text-[22vw] leading-none md:text-[18vw]"
      >
        {logoText}
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-between px-6 pb-16 pt-36 md:pb-20 md:pt-44">
        <div className="max-w-4xl">
          <FadeIn delay={0.05}>
            <p className="eyebrow eyebrow-light mb-8">Legal Authority for Founders</p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1 className="font-display text-[clamp(3.4rem,11vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.03em]">
              <span className="block uppercase">{primary}</span>
              <span className="mt-1 block font-serif text-[0.92em] italic lowercase first-letter:uppercase md:ml-[12%] md:mt-2">
                {accent}
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.28}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/70 md:text-lg">
              {subheadline}
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={ctaHref}
                className="rounded-full bg-signal px-6 py-3.5 text-sm font-semibold text-forest-950 transition hover:brightness-105"
              >
                {ctaLabel}
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-cream/25 px-6 py-3.5 text-sm text-cream/85 transition hover:border-cream/50 hover:text-cream"
              >
                Meet eternal counsel
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.5} className="mt-16 max-w-sm md:mt-0">
          <p className="text-xs leading-relaxed text-cream/55 md:text-sm">{aboutPreview}</p>
        </FadeIn>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-4 bg-cream" />
    </section>
  );
}
