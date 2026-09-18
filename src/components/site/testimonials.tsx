"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/testimonials";
import { Reveal } from "@/components/site/reveal";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = TESTIMONIALS[index];

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section id="voices" className="section-y bg-cream-deep">
      <div className="container-v">
        <div className="mb-14 grid items-end gap-8 md:grid-cols-[1fr_.7fr]">
          <Reveal>
            <p className="eyebrow mb-4">In the room</p>
            <h2 className="font-display text-[clamp(1.85rem,6vw,3.15rem)] font-medium leading-[1.06]">
              What operators say when the conversation is honest.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[15px] text-ink-soft">
              Shared with permission. Names and sectors are published; company identities stay
              private unless the client has asked us to name them.
            </p>
          </Reveal>
        </div>

        <div
          className="testimonial-stage grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:gap-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative min-h-[280px] overflow-hidden border border-[#d2cbbb] bg-[#fbfaf6] p-5 sm:min-h-[340px] sm:p-8 md:min-h-[400px] md:p-12">
            <span className="font-display pointer-events-none absolute -top-4 left-6 text-[80px] leading-none text-gold/25 sm:text-[120px]">
              “
            </span>
            <AnimatePresence mode="wait">
              <motion.figure
                key={active.id}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full min-h-[240px] flex-col justify-between md:min-h-[360px]"
              >
                <blockquote className="font-display text-[clamp(1.15rem,4.2vw,1.75rem)] leading-[1.35] text-ink">
                  {active.quote}
                </blockquote>
                <figcaption className="mt-10 border-t border-ink/10 pt-5">
                  <p className="font-display text-[22px] text-ink">{active.name}</p>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-[#6d7570]">
                    {active.role} · {active.context}
                  </p>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-ink/8">
              <span
                key={`${active.id}-bar`}
                className={`testimonial-bar ${paused ? "testimonial-bar-paused" : ""}`}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(i)}
                data-cursor
                className={`group flex w-full items-baseline justify-between border-b border-ink/10 py-4 text-left transition-colors ${
                  i === index ? "text-ink" : "text-[#7a827c] hover:text-ink"
                }`}
              >
                <span>
                  <span className="block font-display text-[20px]">{item.name}</span>
                  <span className="mt-0.5 block text-[11px] uppercase tracking-[0.12em]">
                    {item.context}
                  </span>
                </span>
                <span className="text-[10px] tracking-[0.16em] text-gold">
                  {i === index ? "Now" : `0${i + 1}`}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
