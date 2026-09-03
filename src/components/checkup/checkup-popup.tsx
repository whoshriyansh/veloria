"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const STORAGE_KEY = "veloria_checkup_popup_seen";

export function CheckupPopup({
  enabled,
  delayMs,
  title,
  body,
  cta,
}: {
  enabled: boolean;
  delayMs: number;
  title: string;
  body: string;
  cta: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = window.setTimeout(() => setOpen(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [enabled, delayMs]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-forest-950/55 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkup-popup-title"
            className="relative w-full max-w-lg overflow-hidden bg-cream p-7 shadow-2xl md:p-9"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="aurora-soft -left-20 -top-24 opacity-70" />
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 rounded-full border border-ink/10 p-2 text-ink-soft hover:text-ink"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>

            <p className="eyebrow mb-4 relative">The Veloria Score™</p>
            <h2
              id="checkup-popup-title"
              className="font-display relative text-3xl leading-tight tracking-tight text-ink md:text-4xl"
            >
              {title}
            </h2>
            <p className="relative mt-4 text-sm leading-relaxed text-ink-soft md:text-base">{body}</p>

            <div className="relative mt-8 flex flex-wrap gap-3">
              <Link
                href="/legal-health-checkup"
                onClick={dismiss}
                className="rounded-full bg-forest-900 px-5 py-3 text-sm font-medium text-cream transition hover:bg-forest-800"
              >
                {cta}
              </Link>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full border border-ink/15 px-5 py-3 text-sm text-ink-soft hover:text-ink"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
