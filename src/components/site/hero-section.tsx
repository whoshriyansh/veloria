"use client";

import Link from "next/link";
import { useRef } from "react";
import { FadeIn } from "@/components/site/reveal";
import { SplitHeading } from "@/components/site/split-heading";
import { Magnetic } from "@/components/site/magnetic";
import { Ornament } from "@/components/site/ornament";
import { IMAGES } from "@/lib/visual";

function HeroPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    const shine = shineRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "none";
    el.style.transform = `perspective(1100px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    if (shine) {
      shine.style.opacity = "1";
      shine.style.left = `${e.clientX - r.left}px`;
      shine.style.top = `${e.clientY - r.top}px`;
    }
  };

  const onLeave = () => {
    const el = panelRef.current;
    if (el) {
      el.style.transition = "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = "perspective(1100px) rotateY(0deg) rotateX(0deg)";
    }
    if (shineRef.current) shineRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={panelRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor
      className="hero-panel relative bg-transparent"
    >
      <div ref={shineRef} className="hero-shine" aria-hidden />
      <img
        src={IMAGES.heroPanel}
        alt="Veloria three-dimensional structure"
        width={810}
        height={635}
        className="relative z-[1] mx-auto h-auto max-h-[240px] w-full max-w-[760px] bg-transparent object-contain sm:max-h-[340px] lg:max-h-none lg:max-w-none"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}

export function HeroSection({
  headline,
  subheadline,
  ctaLabel,
  ctaHref,
}: {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  logoText?: string;
}) {
  return (
    <section className="relative border-b border-ink/10 py-12 sm:py-16 md:py-[88px] lg:py-[108px]">
      <Ornament className="absolute -right-8 top-10 hidden h-40 w-40 lg:block" />
      <div className="container-v grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-[48px]">
        <div>
          <FadeIn>
            <p className="eyebrow mb-4 sm:mb-5">Veloria</p>
          </FadeIn>
          <SplitHeading
            text={headline}
            className="font-display text-[clamp(2.15rem,8.4vw,6.1rem)] font-medium leading-[1.14] tracking-[-0.03em] text-ink"
          />
          <FadeIn delay={0.06}>
            <p className="font-display mt-4 text-[22px] leading-[1.25] text-[#2e3833] sm:mt-5 sm:text-[26px] md:text-[34px]">
              Structure. Strength. Readiness.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-4 max-w-[690px] text-[15px] leading-relaxed text-ink-soft sm:mt-6 sm:text-[17px]">
              {subheadline}
            </p>
          </FadeIn>
          <FadeIn delay={0.14}>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3.5">
              <Magnetic className="w-full sm:w-auto">
                <Link
                  href={ctaHref}
                  className="btn-lux btn-lux-fill w-full sm:w-auto"
                >
                  {ctaLabel}
                </Link>
              </Magnetic>
              <Magnetic className="w-full sm:w-auto">
                <Link
                  href="/services"
                  className="btn-lux btn-lux-ghost w-full sm:w-auto"
                >
                  Explore Veloria
                </Link>
              </Magnetic>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.08}>
          <HeroPanel />
        </FadeIn>
      </div>

      <a href="#who" className="scroll-cue" data-cursor>
        <span>Scroll</span>
        <span className="scroll-cue-line" />
      </a>
    </section>
  );
}
