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
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={cn(
          "glass-nav transition-shadow duration-500",
          scrolled && "shadow-[0_12px_40px_rgba(6,20,16,0.08)]",
        )}
      >
        <div className="container-v flex h-[82px] items-center justify-between">
          <Link
            href="/"
            className="font-display text-[1.65rem] tracking-[0.14em] text-ink"
          >
            {logoText}
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                data-active={pathname === item.href}
                className={cn(
                  "nav-link text-[13px] text-[#4f5853] transition-colors hover:text-ink",
                  pathname === item.href && "text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Magnetic className="max-sm:hidden">
              <Link
                href="/contact"
                className="btn-lux btn-lux-ghost !px-[17px] !py-[11px] text-[12px] tracking-wide"
              >
                Speak with Veloria
              </Link>
            </Magnetic>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center border border-ink/20 text-ink lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {open ? (
        <div className="border-b border-ink/10 bg-cream lg:hidden">
          <div className="container-v py-6">
            {items.map((item, i) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-baseline justify-between border-b border-ink/8 py-4"
              >
                <span className="font-display text-3xl tracking-tight">{item.label}</span>
                <span className="text-xs tracking-[0.2em] text-ink-soft">0{i + 1}</span>
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-6 inline-flex bg-forest-900 px-5 py-3 text-sm text-cream"
            >
              Speak with Veloria
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
