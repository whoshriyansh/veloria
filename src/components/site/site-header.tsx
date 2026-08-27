"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  href: string;
  isExternal: boolean;
};

export function SiteHeader({
  logoText,
  items,
  contactEmail,
}: {
  logoText: string;
  items: NavItem[];
  contactEmail?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {contactEmail ? (
        <div className="pointer-events-auto mx-auto hidden max-w-6xl items-center justify-end px-6 pt-3 text-[11px] tracking-[0.14em] text-ink-soft/80 md:flex">
          <a href={`mailto:${contactEmail}`} className="hover:text-ink transition-colors">
            {contactEmail}
          </a>
        </div>
      ) : null}

      <div className="pointer-events-auto mx-auto max-w-6xl px-4 pt-3 md:pt-4">
        <nav
          className={cn(
            "glass-nav flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 md:px-6",
            scrolled && "shadow-[0_16px_50px_rgba(6,20,16,0.14)]",
          )}
        >
          <div className="hidden items-center gap-6 md:flex">
            {items.slice(0, 2).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "text-[12px] uppercase tracking-[0.18em] transition-colors",
                  pathname === item.href ? "text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/"
            className="font-display absolute left-1/2 -translate-x-1/2 text-[1.55rem] font-medium tracking-[-0.02em] text-ink md:static md:translate-x-0"
          >
            {logoText}
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/legal-health-checkup"
              className="hidden rounded-full bg-signal px-4 py-2 text-[12px] font-medium tracking-wide text-forest-950 transition hover:brightness-105 md:inline-flex"
            >
              Health Checkup
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/15 text-ink"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {open ? (
        <div className="pointer-events-auto mx-auto mt-3 max-w-6xl px-4">
          <div className="glass-nav overflow-hidden rounded-3xl p-6">
            <div className="grid gap-1">
              {items.map((item, i) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex items-baseline justify-between border-b border-ink/8 py-4 last:border-0"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <span className="font-display text-3xl tracking-tight text-ink transition group-hover:text-moss md:text-4xl">
                    {item.label}
                  </span>
                  <span className="text-xs tracking-[0.2em] text-ink-soft">0{i + 1}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
