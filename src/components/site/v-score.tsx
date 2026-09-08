"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CountUp } from "@/components/site/count-up";
import type { ScorePillar } from "@/lib/score-pillars";
import { scoreIcon } from "@/lib/visual";

export function VScore({
  value,
  caption,
  pillars,
}: {
  value: number;
  caption?: string;
  pillars: ScorePillar[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const current = active !== null ? pillars[active] : null;

  return (
    <div className="vscore">
      <div className="vscore-stage">
        <svg className="vscore-svg" viewBox="0 0 1000 1000" aria-hidden>
          <defs>
            <linearGradient id="vscore-gold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c4a574" />
              <stop offset="100%" stopColor="#6ef0a4" />
            </linearGradient>
            <filter id="vscore-glow">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="500" cy="500" r="168" fill="none" stroke="rgba(196,165,116,0.28)" strokeWidth="1" />
          <circle cx="500" cy="500" r="148" fill="none" stroke="rgba(110,240,164,0.12)" strokeWidth="1" />
          {pillars.map((_, i) => {
            const { x, y } = polar(i, pillars.length, 340);
            const on = active === i;
            return (
              <g key={i}>
                <line
                  x1="500"
                  y1="500"
                  x2={x}
                  y2={y}
                  stroke={on ? "rgba(196,165,116,0.55)" : "rgba(243,239,231,0.14)"}
                  strokeWidth={on ? 1.8 : 1}
                />
                {on ? (
                  <line
                    x1={x}
                    y1={y}
                    x2="500"
                    y2="500"
                    className="vscore-flow"
                    stroke="url(#vscore-gold)"
                    strokeWidth="2.4"
                    filter="url(#vscore-glow)"
                  />
                ) : null}
              </g>
            );
          })}
        </svg>

        <div className="vscore-hub">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold">V-Score</p>
          <p className="font-display mt-1 text-[64px] leading-none text-cream md:text-[78px]">
            <CountUp value={value} />
          </p>
          <p className="mt-2 text-[11px] tracking-[0.14em] text-[#c6cec9]">/ 100</p>
          {caption ? (
            <p className="mt-3 max-w-[160px] text-center text-[10px] leading-snug text-[#9aa39d]">
              {caption}
            </p>
          ) : null}
        </div>

        {pillars.map((item, i) => {
          const { x, y } = polar(i, pillars.length, 340);
          const Icon = scoreIcon(item.title);
          const on = active === i;
          return (
            <button
              key={item.title}
              type="button"
              data-cursor
              className={`vscore-node ${on ? "is-on" : ""}`}
              style={{ left: `${(x / 1000) * 100}%`, top: `${(y / 1000) * 100}%` }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(on ? null : i)}
            >
              <Icon className="icon-glyph" strokeWidth={1.2} />
              <span className="vscore-node-copy">
                <strong>{item.title}</strong>
                <em>{item.value}%</em>
              </span>
            </button>
          );
        })}
      </div>

      <div className="vscore-info">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="vscore-card"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-gold">
                {current.title} · {current.value}%
              </p>
              <p className="font-display mt-2 text-[22px] leading-snug text-cream">{current.body}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-[#b7c0ba]">{current.detail}</p>
            </motion.div>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[13px] text-[#9aa39d]"
            >
              Hover a pillar. Light travels into the V-Score — the composite of all six.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function polar(index: number, total: number, radius: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: 500 + radius * Math.cos(angle),
    y: 500 + radius * Math.sin(angle),
  };
}
