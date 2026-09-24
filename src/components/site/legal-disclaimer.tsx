"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

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
  const done = useRef(false);

  useEffect(() => {
    if (isDisclaimerAcknowledged()) {
      onDone();
      return;
    }
    setOpen(true);
    document.body.classList.add("disclaimer-open");
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => acceptRef.current?.focus(), 80);
    return () => {
      document.body.classList.remove("disclaimer-open");
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [onDone]);

  const accept = () => {
    if (done.current) return;
    done.current = true;
    acknowledgeDisclaimer();
    document.body.classList.remove("disclaimer-open");
    setOpen(false);
    onDone();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="legal-disclaimer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="legal-disclaimer-title"
            aria-describedby="legal-disclaimer-body"
            className="legal-disclaimer-card"
            initial={{ opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className="legal-disclaimer-close"
              aria-label="Close and continue"
              onPointerUp={accept}
              onClick={accept}
            >
              <X size={18} />
            </button>
            <p className="eyebrow mb-4">Veloria</p>
            <h2 id="legal-disclaimer-title" className="legal-disclaimer-title">
              Before you continue.
            </h2>
            <div id="legal-disclaimer-body" className="legal-disclaimer-copy">
              <p>
                This website offers general information about Veloria and its work. It is not legal
                advice, a legal opinion, or an offer of representation.
              </p>
              <p>
                Using this site, sending a message, or taking the Veloria Score does not create a
                lawyer–client relationship. You should take advice from a qualified professional
                on your own facts.
              </p>
            </div>
            <button
              ref={acceptRef}
              type="button"
              className="legal-disclaimer-accept"
              onPointerUp={accept}
              onClick={accept}
            >
              I understand
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
