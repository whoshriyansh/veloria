import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";

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
  tagline: "Investment Ready",
  heroHeadline: "Investment Ready",
  heroSubheadline:
    "Startups: Make your platform Investment Ready, compliance ready, and paperwork ready.",
  heroCtaLabel: "Start Legal Health Checkup",
  heroCtaHref: "/legal-health-checkup",
  aboutPreview:
    "We are your Eternal Legal Counsel — the strategic legal partner founders keep for every raise, hire, and exit.",
  footerText: "© Veloria. Eternal legal counsel for ambitious startups.",
  logoText: "Veloria",
  metaTitle: "Veloria — Investment Ready Legal Counsel",
  metaDescription:
    "Veloria helps startups become investment ready, compliance ready, and paperwork ready.",
  showCheckupPopup: true,
  popupDelayMs: 1800,
  popupTitle: "How investment-ready is your startup?",
  popupBody:
    "Take our free 15-question Legal Health Checkup. A Veloria representative will review your answers and call you with a clear path forward.",
  popupCta: "Begin checkup",
};

const DEFAULT_CONTACT: CmsContact = {
  id: "default",
  email: "hello@veloria.legal",
  phone: "+1 (415) 555-0142",
  address: "San Francisco · New York · Remote",
  linkedin: "",
  twitter: "",
  calendly: "",
  hours: "Mon–Fri, 9am–6pm PT",
};

const DEFAULT_NAV: CmsNavItem[] = [
  { id: "nav-1", label: "About", href: "/about", order: 1, isVisible: true, isExternal: false },
  { id: "nav-2", label: "Services", href: "/services", order: 2, isVisible: true, isExternal: false },
  { id: "nav-3", label: "Packages", href: "/packages", order: 3, isVisible: true, isExternal: false },
  {
    id: "nav-4",
    label: "Founder Circle",
    href: "/founder-circle",
    order: 4,
    isVisible: true,
    isExternal: false,
  },
  {
    id: "nav-5",
    label: "Health Checkup",
    href: "/legal-health-checkup",
    order: 5,
    isVisible: true,
    isExternal: false,
  },
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
    return items.map((item) => serialize(item as Record<string, unknown>) as unknown as CmsNavItem);
  } catch {
    return DEFAULT_NAV;
  }
}

export async function getPageBySlug(slug: string) {
  if (!hasMongoUri()) return null;
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
      : null;
  } catch {
    return null;
  }
}

export async function getServices() {
  if (!hasMongoUri()) return [];
  try {
    await connectMongo();
    const servicesCol = await collections.services();
    const services = await servicesCol.find({ isVisible: true }).sort({ order: 1 }).toArray();
    return services.map(
      (s) =>
        serialize(s as Record<string, unknown>) as Record<string, unknown> & {
          id: string;
          title: string;
          slug: string;
          summary: string;
          description: string;
          icon: string;
          features: string;
        },
    );
  } catch {
    return [];
  }
}

export async function getPackages(): Promise<CmsPackage[]> {
  if (!hasMongoUri()) return [];
  try {
    await connectMongo();
    const packagesCol = await collections.packages();
    const packages = await packagesCol.find({ isVisible: true }).sort({ order: 1 }).toArray();
    return packages.map((pkg) => {
      const serialized = serialize(pkg as Record<string, unknown>) as unknown as CmsPackage;
      serialized.features = [...(serialized.features ?? [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      );
      return serialized;
    });
  } catch {
    return [];
  }
}

export async function getHealthQuestions() {
  if (!hasMongoUri()) return [];
  try {
    await connectMongo();
    const healthQuestions = await collections.healthQuestions();
    const questions = await healthQuestions.find({ isActive: true }).sort({ order: 1 }).toArray();
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
    return [];
  }
}
