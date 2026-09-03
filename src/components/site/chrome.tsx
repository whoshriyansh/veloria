"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[2px] bg-transparent">
        <div
          className="h-full origin-left bg-gold"
          style={{ width: `${width}%`, boxShadow: "0 0 12px rgba(196,165,116,0.55)" }}
        />
      </div>
      <div className="pointer-events-none fixed right-0 top-0 z-[90] hidden h-full w-px bg-ink/10 md:block">
        <div
          className="w-full bg-gold"
          style={{ height: `${width}%`, boxShadow: "0 0 10px rgba(196,165,116,0.4)" }}
        />
      </div>
    </>
  );
}

export function FilmGrain() {
  return <div className="site-grain" aria-hidden />;
}
