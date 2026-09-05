"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ScorePillar } from "@/lib/score-pillars";

export function ScoreMatrix({ items }: { items: ScorePillar[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="mt-[30px] border-t border-[#d2cbbb]">
      {items.map((item, i) => {
        const open = active === i;
        const openUp = i >= items.length - 2;

        return (
          <div
            key={item.title}
            className="score-row relative"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(open ? null : i)}
            tabIndex={0}
            data-cursor
            role="button"
            aria-expanded={open}
          >
            <div className="grid items-baseline gap-2 py-[17px] text-[13px] sm:grid-cols-[1fr_auto]">
              <strong className="text-[14px] text-ink">{item.title}</strong>
              <span className="font-display text-[20px] tracking-tight text-forest-900 sm:text-right">
                {item.value}%
              </span>
            </div>
            <div className="score-track">
              <span className="score-fill" style={{ width: `${item.value}%` }} />
            </div>

            <AnimatePresence>
              {open ? (
                <motion.aside
                  className={`score-float ${openUp ? "score-float-up" : "score-float-down"}`}
                  initial={{ opacity: 0, y: openUp ? 10 : -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: openUp ? 8 : -8, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gold">
                    {item.title} · {item.value}%
                  </p>
                  <p className="font-display mt-2 text-[22px] leading-snug text-ink">
                    {item.body}
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">{item.detail}</p>
                  <p className="mt-4 text-[11px] text-[#7a827c]">
                    Illustrative pillar score. The composite Veloria Score™ is the average of all six.
                  </p>
                </motion.aside>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
