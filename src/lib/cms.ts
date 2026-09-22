import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { sanitizeNotifyEmails } from "@/lib/email";
import {
  FALLBACK_CLIENTS,
  FALLBACK_FOUNDING_MEMBERS,
  FALLBACK_ARTICLES,
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
  notifyEmails: string[];
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
  metaTitle: "Veloria — Business Readiness, Governance & Transaction Advisory",
  metaDescription:
    "Veloria is a business readiness advisory for startups, companies, founders and owners in India. Strengthen structure, governance and transactions — then take the Veloria Score.",
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
  notifyEmails: [],
};

const DEFAULT_NAV: CmsNavItem[] = [
  {
    id: "nav-1",
    label: "Who We Work With",
    href: "/about",
    order: 1,
    isVisible: true,
    isExternal: false,
  },
  {
    id: "nav-2",
    label: "What We Do",
    href: "/services",
    order: 2,
    isVisible: true,
    isExternal: false,
  },
  {
    id: "nav-3",
    label: "Founders Circle",
    href: "/founder-circle",
    order: 3,
    isVisible: true,
    isExternal: false,
  },
  {
    id: "nav-4",
    label: "Speak with Veloria",
    href: "/contact",
    order: 4,
    isVisible: true,
    isExternal: false,
  },
];

function publicNav(items: CmsNavItem[]): CmsNavItem[] {
  const hiddenLabels = new Set([
    "v-score",
    "veloria score",
    "insights",
    "clients",
  ]);
  const hiddenHrefs = new Set([
    "/#score",
    "/#insights",
    "/#clients",
    "/insights",
  ]);
  return items
    .filter((item) => {
      const label = item.label.trim().toLowerCase();
      const href = item.href.trim().toLowerCase();
      return !hiddenLabels.has(label) && !hiddenHrefs.has(href);
    })
    .map((item) => {
      if (
        item.href.trim() === "/contact" &&
        item.label.trim().toLowerCase() === "contact"
      ) {
        return { ...item, label: "Speak with Veloria" };
      }
      return item;
    });
}

type CacheEntry<T> = { value: T; exp: number };
type CmsMem = {
  data: Map<string, CacheEntry<unknown>>;
  inflight: Map<string, Promise<unknown>>;
};

declare global {
  // eslint-disable-next-line no-var
  var veloriaCmsCache: CmsMem | undefined;
}

const cmsMem: CmsMem = global.veloriaCmsCache ?? {
  data: new Map(),
  inflight: new Map(),
};
global.veloriaCmsCache = cmsMem;

const CMS_TTL_MS = 45_000;

export function bustCmsCache() {
  cmsMem.data.clear();
}

export function afterPublicCmsWrite() {
  bustCmsCache();
  revalidateTag("cms", "max");
  revalidatePath("/", "layout");
}

function cachedCms<T>(key: string[], fn: () => Promise<T>): Promise<T> {
  return unstable_cache(fn, key, { revalidate: 60, tags: ["cms"] })();
}

async function remember<T>(
  key: string,
  fallback: T,
  fn: () => Promise<T>,
): Promise<T> {
  const hit = cmsMem.data.get(key) as CacheEntry<T> | undefined;
  if (hit && hit.exp > Date.now()) return hit.value;
  if (!hasMongoUri()) return fallback;

  const pending = cmsMem.inflight.get(key) as Promise<T> | undefined;
  if (pending) {
    try {
      return await pending;
    } catch {
      return hit?.value ?? fallback;
    }
  }

  const run = fn()
    .then((value) => {
      cmsMem.data.set(key, { value, exp: Date.now() + CMS_TTL_MS });
      return value;
    })
    .finally(() => {
      cmsMem.inflight.delete(key);
    });

  cmsMem.inflight.set(key, run);

  try {
    return await run;
  } catch {
    return hit?.value ?? fallback;
  }
}

export async function getSiteSettings(): Promise<CmsSettings> {
  return cachedCms(["cms-settings"], () =>
    remember("settings", DEFAULT_SETTINGS, async () => {
      await connectMongo();
      const siteSettings = await collections.siteSettings();
      let settings = await siteSettings.findOne({ key: "default" });
      if (!settings) {
        const { id: _id, ...defaults } = DEFAULT_SETTINGS;
        const doc = { ...defaults, key: "default" as const };
        const result = await siteSettings.insertOne(doc);
        settings = { ...doc, _id: result.insertedId };
      } else if (settings.metaTitle === "Veloria — Build Before You Raise") {
        await siteSettings.updateOne(
          { key: "default" },
          {
            $set: {
              metaTitle: DEFAULT_SETTINGS.metaTitle,
              metaDescription: DEFAULT_SETTINGS.metaDescription,
            },
          },
        );
        settings.metaTitle = DEFAULT_SETTINGS.metaTitle;
        settings.metaDescription = DEFAULT_SETTINGS.metaDescription;
      }
      return serialize(
        settings as Record<string, unknown>,
      ) as unknown as CmsSettings;
    }),
  );
}

export async function getContactInfo(): Promise<CmsContact> {
  return cachedCms(["cms-contact"], () =>
    remember("contact", DEFAULT_CONTACT, async () => {
      await connectMongo();
      const contactInfo = await collections.contactInfo();
      let contact = await contactInfo.findOne({ key: "default" });
      if (!contact) {
        const { id: _id, ...defaults } = DEFAULT_CONTACT;
        const doc = { ...defaults, key: "default" as const };
        const result = await contactInfo.insertOne(doc);
        contact = { ...doc, _id: result.insertedId };
      }
      return serialize({
        ...contact,
        notifyEmails: sanitizeNotifyEmails(
          (contact as { notifyEmails?: unknown }).notifyEmails,
        ),
      } as Record<string, unknown>) as unknown as CmsContact;
    }),
  );
}

export async function getNavigation(): Promise<CmsNavItem[]> {
  const items = await cachedCms(["cms-nav"], () =>
    remember("nav", DEFAULT_NAV, async () => {
      await connectMongo();
      const navigationItems = await collections.navigationItems();
      await navigationItems.updateMany(
        { href: "/contact", label: "Contact" },
        { $set: { label: "Speak with Veloria" } },
      );
      const docs = await navigationItems
        .find({ isVisible: true })
        .sort({ order: 1 })
        .toArray();
      if (!docs.length) return DEFAULT_NAV;
      return docs.map(
        (item) =>
          serialize(item as Record<string, unknown>) as unknown as CmsNavItem,
      );
    }),
  );
  return publicNav(items);
}

export type CmsPage = {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  sections: string;
  seoTitle?: string;
  seoDescription?: string;
};

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  const fallback = FALLBACK_PAGES[slug] ?? null;
  return cachedCms(["cms-page", slug], () =>
    remember(`page:${slug}`, fallback, async () => {
      await connectMongo();
      const pages = await collections.pages();
      const page = await pages.findOne({ slug });
      return page
        ? (serialize(page as Record<string, unknown>) as unknown as CmsPage)
        : fallback;
    }),
  );
}

export async function getServices() {
  return cachedCms(["cms-services"], () =>
    remember("services", FALLBACK_SERVICES, async () => {
      await connectMongo();
      const servicesCol = await collections.services();
      const services = await servicesCol
        .find({ isVisible: true })
        .sort({ order: 1 })
        .toArray();
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
    }),
  );
}

export async function getPackages(): Promise<CmsPackage[]> {
  return cachedCms(["cms-packages"], () =>
    remember("packages", FALLBACK_PACKAGES, async () => {
      await connectMongo();
      const packagesCol = await collections.packages();
      const packages = await packagesCol
        .find({ isVisible: true })
        .sort({ order: 1 })
        .toArray();
      if (!packages.length) return FALLBACK_PACKAGES;
      return packages.map((pkg) => {
        const serialized = serialize(
          pkg as Record<string, unknown>,
        ) as unknown as CmsPackage;
        serialized.features = [...(serialized.features ?? [])].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0),
        );
        return serialized;
      });
    }),
  );
}

export async function getHealthQuestions() {
  return remember("questions", FALLBACK_QUESTIONS, async () => {
    await connectMongo();
    const healthQuestions = await collections.healthQuestions();
    const questions = await healthQuestions
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();
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
  });
}

export type CmsClient = {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  order: number;
};

export type CmsArticle = {
  id: string;
  title: string;
  heading: string;
  imageUrl: string;
  link: string;
  order: number;
};

export type CmsFoundingMember = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  order: number;
};

export async function getClients(): Promise<CmsClient[]> {
  return remember("clients", FALLBACK_CLIENTS, async () => {
    await connectMongo();
    const clientsCol = await collections.clients();
    const clients = await clientsCol
      .find({ isVisible: true })
      .sort({ order: 1 })
      .toArray();
    if (!clients.length) return FALLBACK_CLIENTS;
    return clients.map(
      (c) => serialize(c as Record<string, unknown>) as unknown as CmsClient,
    );
  });
}

export async function getFoundingMembers(): Promise<CmsFoundingMember[]> {
  return cachedCms(["cms-founding-members"], () =>
    remember("foundingMembers", FALLBACK_FOUNDING_MEMBERS, async () => {
      await connectMongo();
      const col = await collections.foundingMembers();
      let members = await col
        .find({ isVisible: true })
        .sort({ order: 1 })
        .toArray();
      if (!members.length) {
        const existing = await col.countDocuments();
        if (existing === 0) {
          await col.insertMany(
            FALLBACK_FOUNDING_MEMBERS.map(({ id: _id, ...member }) => ({
              ...member,
              isVisible: true,
            })),
          );
          members = await col
            .find({ isVisible: true })
            .sort({ order: 1 })
            .toArray();
        }
      }
      if (!members.length) return FALLBACK_FOUNDING_MEMBERS;
      return members.map(
        (m) =>
          serialize(
            m as Record<string, unknown>,
          ) as unknown as CmsFoundingMember,
      );
    }),
  );
}

export async function getArticles(limit?: number): Promise<CmsArticle[]> {
  const fallback = limit
    ? FALLBACK_ARTICLES.slice(0, limit)
    : FALLBACK_ARTICLES;
  return cachedCms(["cms-articles", String(limit ?? "all")], () =>
    remember(`articles:${limit ?? "all"}`, fallback, async () => {
      await connectMongo();
      const col = await collections.articles();
      const cursor = col
        .find({ isPublished: true })
        .sort({ order: 1, publishedAt: -1 });
      const articles = await (limit ? cursor.limit(limit) : cursor).toArray();
      if (!articles.length) return fallback;
      return articles.map(
        (a) => serialize(a as Record<string, unknown>) as unknown as CmsArticle,
      );
    }),
  );
}
