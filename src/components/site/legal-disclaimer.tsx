"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const DISCLAIMER_KEY = "veloria_legal_disclaimer_ack";
export const DISCLAIMER_TTL_MS = 2 * 24 * 60 * 60 * 1000;

export function isDisclaimerAcknowledged() {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(DISCLAIMER_KEY);
  if (!raw) return false;
  const acknowledgedAt = Number(raw);
  if (!Number.isFinite(acknowledgedAt)) return false;
  return Date.now() - acknowledgedAt < DISCLAIMER_TTL_MS;
}

export function acknowledgeDisclaimer() {
  window.localStorage.setItem(DISCLAIMER_KEY, String(Date.now()));
}

export function LegalDisclaimer({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isDisclaimerAcknowledged()) {
      onDone();
      return;
    }
    setOpen(true);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => acceptRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [onDone]);

  const accept = () => {
    acknowledgeDisclaimer();
    setOpen(false);
    onDone();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-[#061410]/70 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="legal-disclaimer-title"
            aria-describedby="legal-disclaimer-body"
            className="relative w-full max-w-[34rem] overflow-hidden border border-[#e7e1d4] bg-cream p-6 shadow-2xl sm:p-8 md:p-10"
            initial={{ opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow mb-4">Veloria</p>
            <h2
              id="legal-disclaimer-title"
              className="font-display text-[clamp(1.7rem,5.5vw,2.15rem)] font-medium leading-[1.18] tracking-tight text-ink"
            >
              Before you continue.
            </h2>
            <div
              id="legal-disclaimer-body"
              className="mt-5 space-y-3 text-sm leading-relaxed text-ink-soft sm:text-[15px]"
            >
              <p>
                This website offers general information about Veloria and its
                work. It is not legal advice, a legal opinion, or an offer of
                representation.
              </p>
              <p>
                Using this site, sending a message, or taking the Veloria Score
                does not create a lawyer–client relationship. You should take
                advice from a qualified professional on your own facts.
              </p>
            </div>
            <button
              ref={acceptRef}
              type="button"
              onClick={accept}
              className="btn-lux btn-lux-fill mt-8 w-full sm:w-auto"
            >
              I understand
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
