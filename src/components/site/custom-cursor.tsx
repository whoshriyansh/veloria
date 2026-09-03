"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const hover = useRef(false);
  const hidden = useRef(false);
  const ready = useRef(false);
  const scale = useRef(1);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    ring.current = { ...mouse.current };

    const isInteractive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false;
      return Boolean(el.closest("a, button, [data-cursor], label, summary"));
    };

    const isField = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false;
      return Boolean(el.closest("input, textarea, select, [contenteditable='true']"));
    };

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      hover.current = isInteractive(e.target);
      hidden.current = isField(e.target);
      ready.current = true;
    };

    const hide = () => {
      hidden.current = true;
    };
    const show = () => {
      hidden.current = false;
    };

    let raf = 0;
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.11;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.11;
      scale.current += ((hover.current ? 2.15 : 1) - scale.current) * 0.16;

      const dot = dotRef.current;
      const circle = ringRef.current;
      if (dot) {
        dot.style.opacity = !ready.current || hidden.current ? "0" : "1";
        dot.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }
      if (circle) {
        circle.style.opacity = !ready.current || hidden.current ? "0" : hover.current ? "0.55" : "1";
        circle.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) scale(${scale.current})`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
