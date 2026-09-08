"use client";

import Link from "next/link";
import { useRef } from "react";
import { FadeIn } from "@/components/site/reveal";
import { SplitHeading } from "@/components/site/split-heading";
import { Magnetic } from "@/components/site/magnetic";
import { CornerMarks, Ornament } from "@/components/site/ornament";
import { Photo } from "@/components/site/photo";
import { IMAGES } from "@/lib/visual";

function HeroPanel({ preview }: { preview: string }) {
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
      className="hero-panel relative flex min-h-[360px] flex-col justify-end overflow-hidden border border-[#cec5b6] p-8 md:min-h-[500px] md:p-[42px]"
    >
      <Photo
        src={IMAGES.heroPanel}
        priority
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1812] via-[#1a1812]/40 to-transparent" />
      <CornerMarks className="text-cream/50" />
      <div ref={shineRef} className="hero-shine" aria-hidden />
      <p className="font-display relative z-[1] max-w-[440px] text-[28px] leading-[1.22] text-cream md:text-[34px]">
        {preview}
      </p>
      <p className="relative z-[1] mt-5 text-[11px] uppercase tracking-[0.14em] text-gold">
        Veloria · Business Readiness Advisory
      </p>
    </div>
  );
}

export function HeroSection({
  headline,
  subheadline,
  ctaLabel,
  ctaHref,
  aboutPreview,
}: {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  aboutPreview: string;
  logoText?: string;
}) {
  return (
    <section className="relative border-b border-ink/10 py-[84px] md:py-[108px]">
      <Ornament className="absolute -right-8 top-10 hidden h-40 w-40 lg:block" />
      <div className="container-v grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-[72px]">
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
          <HeroPanel preview={aboutPreview} />
        </FadeIn>
      </div>

      <a href="#who" className="scroll-cue" data-cursor>
        <span>Scroll</span>
        <span className="scroll-cue-line" />
      </a>
    </section>
  );
}
