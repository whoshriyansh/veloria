"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Navigation,
  FileText,
  Briefcase,
  Package,
  HelpCircle,
  Settings,
  Phone,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/navigation", label: "Navigation", icon: Navigation },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/questions", label: "Questions", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/contact", label: "Contact", icon: Phone },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/[0.06] bg-[#0c110f]">
      <div className="border-b border-white/[0.06] px-5 py-5">
        <Link href="/admin" className="block">
          <div className="text-lg font-semibold tracking-tight text-white">Veloria</div>
          <div className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-white/40">
            Admin CMS
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-[#6ef0a4]/12 text-[#6ef0a4]"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-4 shrink-0 opacity-80" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/55 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
