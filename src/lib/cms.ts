import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import {
  FALLBACK_CLIENTS,
  FALLBACK_PACKAGES,
  FALLBACK_PAGES,
  FALLBACK_QUESTIONS,
  FALLBACK_SERVICES,
} from "@/lib/fallback-content";

export type CmsSettings = {
  id: string;
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  aboutPreview: string;
  footerText: string;
  logoText: string;
  metaTitle: string;
  metaDescription: string;
  showCheckupPopup: boolean;
  popupDelayMs: number;
  popupTitle: string;
  popupBody: string;
  popupCta: string;
};

export type CmsContact = {
  id: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  twitter: string;
  calendly: string;
  hours: string;
};

export type CmsNavItem = {
  id: string;
  label: string;
  href: string;
  order: number;
  isVisible: boolean;
  isExternal: boolean;
};

export type CmsPackageFeature = { id: string; text: string; order: number };

export type CmsPackage = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  cadence: string;
  highlight: boolean;
  order: number;
  isVisible: boolean;
  ctaLabel: string;
  features: CmsPackageFeature[];
};

const DEFAULT_SETTINGS: CmsSettings = {
  id: "default",
  siteName: "Veloria",
  tagline: "Structure. Strength. Readiness.",
  heroHeadline: "Build before you raise.",
  heroSubheadline:
    "Veloria helps startups, companies, builders, contractors, founders and business owners strengthen the foundations behind serious growth, capital, transactions and expansion.",
  heroCtaLabel: "Start a Readiness Review",
  heroCtaHref: "/legal-health-checkup",
  aboutPreview:
    "A stronger business is easier to fund, easier to scale and harder to disrupt.",
  footerText:
    "© 2026 Veloria. All rights reserved. Information on this website is general in nature and does not constitute legal advice.",
  logoText: "VELORIA",
  metaTitle: "Veloria — Build Before You Raise",
  metaDescription:
    "Veloria helps startups, companies, builders, contractors and business owners strengthen structure, governance and transaction readiness.",
  showCheckupPopup: true,
  popupDelayMs: 1800,
  popupTitle: "How ready is your business?",
  popupBody:
    "Take the free Veloria Score — a 15-question Legal Health Checkup. A representative will review your answers and call you with a clear path forward.",
  popupCta: "Begin the Score",
};

const DEFAULT_CONTACT: CmsContact = {
  id: "default",
  email: "hello@veloria.in",
  phone: "+91 98765 43210",
  address: "India",
  linkedin: "",
  twitter: "",
  calendly: "",
  hours: "Mon–Fri, 10am–7pm IST",
};

const DEFAULT_NAV: CmsNavItem[] = [
  { id: "nav-1", label: "Who We Work With", href: "/about", order: 1, isVisible: true, isExternal: false },
  { id: "nav-2", label: "What We Do", href: "/services", order: 2, isVisible: true, isExternal: false },
  { id: "nav-3", label: "Veloria Score", href: "/legal-health-checkup", order: 3, isVisible: true, isExternal: false },
  { id: "nav-4", label: "Clients", href: "/#clients", order: 4, isVisible: true, isExternal: false },
  { id: "nav-5", label: "Founders Circle", href: "/founder-circle", order: 5, isVisible: true, isExternal: false },
  { id: "nav-6", label: "Contact", href: "/contact", order: 6, isVisible: true, isExternal: false },
];

export async function getSiteSettings(): Promise<CmsSettings> {
  if (!hasMongoUri()) return DEFAULT_SETTINGS;
  try {
    await connectMongo();
    const siteSettings = await collections.siteSettings();
    let settings = await siteSettings.findOne({ key: "default" });
    if (!settings) {
      const { id: _id, ...defaults } = DEFAULT_SETTINGS;
      const doc = { ...defaults, key: "default" as const };
      const result = await siteSettings.insertOne(doc);
      settings = { ...doc, _id: result.insertedId };
    }
    return serialize(settings as Record<string, unknown>) as unknown as CmsSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getContactInfo(): Promise<CmsContact> {
  if (!hasMongoUri()) return DEFAULT_CONTACT;
  try {
    await connectMongo();
    const contactInfo = await collections.contactInfo();
    let contact = await contactInfo.findOne({ key: "default" });
    if (!contact) {
      const { id: _id, ...defaults } = DEFAULT_CONTACT;
      const doc = { ...defaults, key: "default" as const };
      const result = await contactInfo.insertOne(doc);
      contact = { ...doc, _id: result.insertedId };
    }
    return serialize(contact as Record<string, unknown>) as unknown as CmsContact;
  } catch {
    return DEFAULT_CONTACT;
  }
}

export async function getNavigation(): Promise<CmsNavItem[]> {
  if (!hasMongoUri()) return DEFAULT_NAV;
  try {
    await connectMongo();
    const navigationItems = await collections.navigationItems();
    const items = await navigationItems.find({ isVisible: true }).sort({ order: 1 }).toArray();
    if (!items.length) return DEFAULT_NAV;
    return items.map((item) => serialize(item as Record<string, unknown>) as unknown as CmsNavItem);
  } catch {
    return DEFAULT_NAV;
  }
}

export async function getPageBySlug(slug: string) {
  const fallback = FALLBACK_PAGES[slug] ?? null;
  if (!hasMongoUri()) return fallback;
  try {
    await connectMongo();
    const pages = await collections.pages();
    const page = await pages.findOne({ slug });
    return page
      ? (serialize(page as Record<string, unknown>) as Record<string, unknown> & {
          id: string;
          title: string;
          subtitle: string;
          content: string;
          sections: string;
        })
      : fallback;
  } catch {
    return fallback;
  }
}

export async function getServices() {
  if (!hasMongoUri()) return FALLBACK_SERVICES;
  try {
    await connectMongo();
    const servicesCol = await collections.services();
    const services = await servicesCol.find({ isVisible: true }).sort({ order: 1 }).toArray();
    if (!services.length) return FALLBACK_SERVICES;
    return services.map(
      (s) =>
        serialize(s as Record<string, unknown>) as Record<string, unknown> & {
          id: string;
          title: string;
          slug: string;
          summary: string;
          description: string;
          imageUrl: string;
          icon: string;
          features: string;
        },
    );
  } catch {
    return FALLBACK_SERVICES;
  }
}

export async function getPackages(): Promise<CmsPackage[]> {
  if (!hasMongoUri()) return FALLBACK_PACKAGES;
  try {
    await connectMongo();
    const packagesCol = await collections.packages();
    const packages = await packagesCol.find({ isVisible: true }).sort({ order: 1 }).toArray();
    if (!packages.length) return FALLBACK_PACKAGES;
    return packages.map((pkg) => {
      const serialized = serialize(pkg as Record<string, unknown>) as unknown as CmsPackage;
      serialized.features = [...(serialized.features ?? [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      );
      return serialized;
    });
  } catch {
    return FALLBACK_PACKAGES;
  }
}

export async function getHealthQuestions() {
  if (!hasMongoUri()) return FALLBACK_QUESTIONS;
  try {
    await connectMongo();
    const healthQuestions = await collections.healthQuestions();
    const questions = await healthQuestions.find({ isActive: true }).sort({ order: 1 }).toArray();
    if (!questions.length) return FALLBACK_QUESTIONS;
    return questions.map(
      (q) =>
        serialize(q as Record<string, unknown>) as {
          id: string;
          question: string;
          category: string;
          order: number;
          weight: number;
          yesIsGood: boolean;
          helpText: string;
        },
    );
  } catch {
    return FALLBACK_QUESTIONS;
  }
}

export type CmsClient = {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  order: number;
};

export async function getClients(): Promise<CmsClient[]> {
  if (!hasMongoUri()) return FALLBACK_CLIENTS;
  try {
    await connectMongo();
    const clientsCol = await collections.clients();
    const clients = await clientsCol.find({ isVisible: true }).sort({ order: 1 }).toArray();
    if (!clients.length) return FALLBACK_CLIENTS;
    return clients.map(
      (c) => serialize(c as Record<string, unknown>) as unknown as CmsClient,
    );
  } catch {
    return FALLBACK_CLIENTS;
  }
}
