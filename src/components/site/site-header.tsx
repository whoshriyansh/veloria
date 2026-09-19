"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/site/magnetic";

type NavItem = {
  id: string;
  label: string;
  href: string;
  isExternal: boolean;
};

export function SiteHeader({
  logoText,
  items,
}: {
  logoText: string;
  items: NavItem[];
  contactEmail?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const inverted = scrolled || open;

  return (
    <header className="sticky top-0 z-50">
      <nav className={cn("glass-nav", inverted && "nav-scrolled")}>
        <div className="container-v flex h-[64px] items-center justify-between sm:h-[74px] lg:h-[82px]">
          <Link
            href="/"
            aria-label="Veloria home"
            title="Veloria"
            className={cn(
              "font-display min-w-0 truncate text-[1.28rem] tracking-[0.1em] transition-colors duration-400 sm:text-[1.5rem] sm:tracking-[0.12em] lg:text-[1.65rem] lg:tracking-[0.14em]",
              inverted ? "text-cream" : "text-ink",
            )}
          >
            {logoText}
          </Link>

          <div className="hidden items-center gap-5 xl:gap-8 lg:flex">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                data-active={pathname === item.href}
                className={cn(
                  "nav-link text-[13px] transition-colors duration-400",
                  inverted
                    ? "text-cream/70 hover:text-cream"
                    : "text-[#4f5853] hover:text-ink",
                  pathname === item.href && (inverted ? "text-cream" : "text-ink"),
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden sm:block">
              <Link
                href="/legal-health-checkup"
                className="btn-lux btn-lux-ghost !px-[17px] !py-[11px] text-[12px] tracking-wide"
              >
                Check your V Score
              </Link>
            </Magnetic>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-current lg:hidden",
                inverted ? "border-cream/30 text-cream" : "border-ink/20 text-ink",
              )}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {open ? (
        <div className="max-h-[calc(100dvh-64px)] overflow-y-auto border-b border-white/10 bg-forest-950 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:hidden">
          <div className="container-v py-5">
            {items.map((item, i) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3.5 text-cream"
              >
                <span className="font-display text-[1.65rem] leading-[1.15] tracking-tight sm:text-3xl">
                  {item.label}
                </span>
                <span className="shrink-0 text-xs tracking-[0.2em] text-gold">0{i + 1}</span>
              </Link>
            ))}
            <Link
              href="/legal-health-checkup"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-cream px-5 py-3.5 text-sm text-forest-950 sm:w-auto"
            >
              Check your V Score
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
