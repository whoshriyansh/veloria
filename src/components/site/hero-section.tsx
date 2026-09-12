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
        className="relative z-[1] mx-auto h-auto w-full max-w-[760px] bg-transparent object-contain lg:max-w-none"
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
    <section className="relative border-b border-ink/10 py-[84px] md:py-[108px]">
      <Ornament className="absolute -right-8 top-10 hidden h-40 w-40 lg:block" />
      <div className="container-v grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-[48px]">
        <div>
          <FadeIn>
            <p className="eyebrow mb-5">Veloria</p>
          </FadeIn>
          <SplitHeading
            text={headline}
            className="font-display text-[clamp(3.2rem,7.4vw,6.1rem)] font-medium leading-[1.18] tracking-[-0.03em] text-ink"
          />
          <FadeIn delay={0.06}>
            <p className="font-display mt-5 text-[26px] leading-[1.25] text-[#2e3833] md:text-[34px]">
              Structure. Strength. Readiness.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-6 max-w-[690px] text-[17px] leading-relaxed text-ink-soft">
              {subheadline}
            </p>
          </FadeIn>
          <FadeIn delay={0.14}>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Magnetic>
                <Link href={ctaHref} className="btn-lux btn-lux-fill">
                  {ctaLabel}
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/services" className="btn-lux btn-lux-ghost">
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
