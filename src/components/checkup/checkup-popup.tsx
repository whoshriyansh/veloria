"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { lockPublicOverlay, unlockPublicOverlay } from "@/lib/public-overlay";

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
  const closed = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = window.setTimeout(() => setOpen(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [enabled, delayMs]);

  useEffect(() => {
    if (!open) return;
    lockPublicOverlay();
    return () => unlockPublicOverlay();
  }, [open]);

  const dismiss = () => {
    if (closed.current) return;
    closed.current = true;
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="site-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onPointerUp={(e) => {
            if (e.target === e.currentTarget) dismiss();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkup-popup-title"
            className="site-overlay-card"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onPointerUp={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="site-overlay-close"
              aria-label="Dismiss"
              onPointerUp={dismiss}
              onClick={dismiss}
            >
              <X size={18} />
            </button>

            <p className="eyebrow mb-4">The Veloria Score™</p>
            <h2 id="checkup-popup-title" className="site-overlay-title">
              {title}
            </h2>
            <p className="site-overlay-copy">{body}</p>

            <div className="site-overlay-actions">
              <Link
                href="/legal-health-checkup"
                onClick={dismiss}
                className="site-overlay-accept"
              >
                {cta}
              </Link>
              <button
                type="button"
                className="site-overlay-ghost"
                onPointerUp={dismiss}
                onClick={dismiss}
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
