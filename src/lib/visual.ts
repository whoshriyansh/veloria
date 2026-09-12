import type { LucideIcon } from "lucide-react";
import {
  Rocket,
  Building2,
  HardHat,
  Hammer,
  Compass,
  Search,
  Crosshair,
  ShieldCheck,
  ArrowUpRight,
  Landmark,
  Scale,
  FileText,
  BadgeCheck,
  FolderOpen,
  AlertTriangle,
  Briefcase,
} from "lucide-react";

export const IMAGES = {
  heroPanel: "/frame.svg",
  dinnerHero:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1100&q=58",
  dinnerTable:
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=55",
  dinnerRoom:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=55",
  dinnerGlass:
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=55",
  article1:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=720&q=55",
  article2:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=720&q=55",
  article3:
    "https://images.unsplash.com/photo-1507679799987-4eee5c111973?auto=format&fit=crop&w=720&q=55",
};

export const AUDIENCE_ICONS: Record<string, LucideIcon> = {
  Startups: Rocket,
  Companies: Building2,
  "Builders & Developers": HardHat,
  Contractors: Hammer,
  "Entrepreneurs & Business Owners": Compass,
};

export const APPROACH_ICONS: Record<string, LucideIcon> = {
  Understand: Search,
  Focus: Crosshair,
  Strengthen: ShieldCheck,
  Move: ArrowUpRight,
};

export const SCORE_ICONS: Record<string, LucideIcon> = {
  "Corporate Structure": Landmark,
  Governance: Scale,
  Contracts: FileText,
  Compliance: BadgeCheck,
  "Transaction Readiness": FolderOpen,
  "Business Risk": AlertTriangle,
};

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  "corporate-structure-governance": Landmark,
  "contracts-commercial-risk": FileText,
  "fundraising-investment-readiness": FolderOpen,
  "due-diligence-preparation": Search,
  "projects-expansion": HardHat,
  "strategic-advisory": Compass,
};

export function audienceIcon(title?: string): LucideIcon {
  return (title && AUDIENCE_ICONS[title]) || Compass;
}

export function approachIcon(title?: string): LucideIcon {
  return (title && APPROACH_ICONS[title]) || Search;
}

export function scoreIcon(title?: string): LucideIcon {
  return (title && SCORE_ICONS[title]) || Landmark;
}

export function serviceIcon(slug?: string, title?: string): LucideIcon {
  if (slug && SERVICE_ICONS[slug]) return SERVICE_ICONS[slug];
  const key = Object.keys(SERVICE_ICONS).find((k) =>
    (title ?? "").toLowerCase().includes(k.split("-")[0]),
  );
  return (key && SERVICE_ICONS[key]) || Briefcase;
}
