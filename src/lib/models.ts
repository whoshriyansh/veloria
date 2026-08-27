import { ObjectId, type Collection, type Document } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type UserDoc = {
  _id?: ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SiteSettingsDoc = {
  _id?: ObjectId;
  key: string;
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

export type ContactInfoDoc = {
  _id?: ObjectId;
  key: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  twitter: string;
  calendly: string;
  hours: string;
};

export type NavigationItemDoc = {
  _id?: ObjectId;
  label: string;
  href: string;
  order: number;
  isVisible: boolean;
  isExternal: boolean;
};

export type PageDoc = {
  _id?: ObjectId;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  heroImage: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  sections: string;
};

export type ServiceDoc = {
  _id?: ObjectId;
  title: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl: string;
  icon: string;
  order: number;
  isVisible: boolean;
  features: string;
};

export type PackageFeature = {
  _id?: ObjectId;
  id?: string;
  text: string;
  order: number;
};

export type PackageDoc = {
  _id?: ObjectId;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  cadence: string;
  highlight: boolean;
  order: number;
  isVisible: boolean;
  ctaLabel: string;
  features: PackageFeature[];
};

export type HealthQuestionDoc = {
  _id?: ObjectId;
  question: string;
  category: string;
  order: number;
  weight: number;
  yesIsGood: boolean;
  helpText: string;
  isActive: boolean;
};

export type LeadAnswer = {
  _id?: ObjectId;
  id?: string;
  questionId: string;
  answer: boolean;
  questionSnapshot?: {
    question: string;
    category: string;
    yesIsGood: boolean;
    helpText: string;
    order: number;
  };
  createdAt?: Date;
};

export type LeadNote = {
  _id?: ObjectId;
  id?: string;
  body: string;
  authorId?: string | null;
  authorName?: string | null;
  authorEmail?: string | null;
  createdAt?: Date;
};

export type LeadDoc = {
  _id?: ObjectId;
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  score: number;
  maxScore: number;
  readiness: string;
  status: string;
  source: string;
  notes: string;
  assignedTo?: string | null;
  calledAt?: Date | null;
  answers: LeadAnswer[];
  leadNotes: LeadNote[];
  createdAt?: Date;
  updatedAt?: Date;
};

async function col<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

export const collections = {
  users: () => col<UserDoc>("users"),
  siteSettings: () => col<SiteSettingsDoc>("siteSettings"),
  contactInfo: () => col<ContactInfoDoc>("contactInfo"),
  navigationItems: () => col<NavigationItemDoc>("navigationItems"),
  pages: () => col<PageDoc>("pages"),
  services: () => col<ServiceDoc>("services"),
  packages: () => col<PackageDoc>("packages"),
  healthQuestions: () => col<HealthQuestionDoc>("healthQuestions"),
  leads: () => col<LeadDoc>("leads"),
};

export function isValidId(id: string) {
  return ObjectId.isValid(id);
}

export function oid(id: string) {
  return new ObjectId(id);
}

export function serialize(doc: null | undefined): null;
export function serialize(
  doc: Record<string, unknown>,
): Record<string, unknown> & { id: string };
export function serialize(
  doc: Record<string, unknown> | null | undefined,
): (Record<string, unknown> & { id: string }) | null {
  if (!doc) return null;
  const obj = JSON.parse(JSON.stringify(doc)) as Record<string, unknown>;
  if (obj._id) {
    obj.id = String(obj._id);
    delete obj._id;
  }

  if (Array.isArray(obj.features)) {
    obj.features = (obj.features as Record<string, unknown>[]).map((f) => {
      const feature = { ...f };
      if (feature._id) {
        feature.id = String(feature._id);
        delete feature._id;
      }
      if (!feature.id) feature.id = new ObjectId().toHexString();
      return feature;
    });
  }

  if (Array.isArray(obj.answers)) {
    obj.answers = (obj.answers as Record<string, unknown>[]).map((a) => {
      const answer = { ...a };
      if (answer._id) {
        answer.id = String(answer._id);
        delete answer._id;
      }
      const snap = answer.questionSnapshot as Record<string, unknown> | undefined;
      if (snap) {
        answer.question = {
          id: String(answer.questionId ?? ""),
          question: snap.question ?? "",
          category: snap.category ?? "General",
          yesIsGood: Boolean(snap.yesIsGood),
          helpText: snap.helpText ?? "",
          order: Number(snap.order ?? 0),
        };
      }
      return answer;
    });
  }

  if (Array.isArray(obj.leadNotes)) {
    obj.leadNotes = (obj.leadNotes as Record<string, unknown>[]).map((n) => {
      const note = { ...n };
      if (note._id) {
        note.id = String(note._id);
        delete note._id;
      }
      note.author =
        note.authorId || note.authorName
          ? {
              id: String(note.authorId ?? ""),
              name: String(note.authorName ?? "Admin"),
              email: String(note.authorEmail ?? ""),
            }
          : null;
      return note;
    });
  }

  return obj as Record<string, unknown> & { id: string };
}

export { ObjectId };
