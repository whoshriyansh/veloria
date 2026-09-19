import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";
import type { CmsContact } from "@/lib/cms";

export { siteUrl };

type ServicePreview = {
  title: string;
  slug: string;
  summary: string;
};

export const BRAND = {
  name: "Veloria",
  legalName: "Veloria",
  tagline: "Structure. Strength. Readiness.",
  description:
    "Veloria helps startups, companies, builders, contractors, founders and business owners strengthen structure, governance and transaction readiness.",
} as const;

export const PUBLIC_PATHS = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/services", changeFrequency: "monthly" as const, priority: 0.85 },
  { path: "/legal-health-checkup", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/founder-circle", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/packages", changeFrequency: "monthly" as const, priority: 0.55 },
  { path: "/insights", changeFrequency: "weekly" as const, priority: 0.5 },
];

export function absoluteUrl(path = "/") {
  const base = siteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function cmsPageMetadata({
  page,
  title,
  description,
  path,
  absoluteTitle,
}: {
  page?: { seoTitle?: string; seoDescription?: string } | null;
  title: string;
  description: string;
  path: string;
  absoluteTitle?: string;
}) {
  const seoTitle = page?.seoTitle?.trim();
  const seoDescription = page?.seoDescription?.trim();
  return pageMetadata({
    title: seoTitle || title,
    description: seoDescription || description,
    path,
    absoluteTitle: seoTitle ? undefined : absoluteTitle,
  });
}

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const resolvedTitle = absoluteTitle ?? title;
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: path === "/" ? "website" : "website",
      locale: "en_IN",
      url,
      siteName: BRAND.name,
      title: resolvedTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
    },
  };
}

export function organizationJsonLd(
  contact: Pick<CmsContact, "email" | "phone" | "address" | "linkedin" | "twitter">,
  services: ServicePreview[] = [],
) {
  const url = siteUrl();
  const sameAs = [contact.linkedin, contact.twitter].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${url}/#organization`,
    name: BRAND.name,
    alternateName: ["Veloria Advisory", "VELORIA"],
    url,
    logo: `${url}/opengraph-image`,
    image: `${url}/opengraph-image`,
    slogan: BRAND.tagline,
    description: BRAND.description,
    email: contact.email,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      streetAddress: contact.address || undefined,
    },
    areaServed: { "@type": "Country", name: "India" },
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: [
      "Business readiness",
      "Corporate governance",
      "Transaction advisory",
      "Legal health checkup",
      "Veloria Score",
    ],
    hasOfferCatalog: services.length
      ? {
          "@type": "OfferCatalog",
          name: "Veloria services",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.summary,
              url: `${url}/services#${service.slug}`,
            },
          })),
        }
      : undefined,
  };
}

export function websiteJsonLd() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: BRAND.name,
    alternateName: ["Veloria Advisory", "VELORIA"],
    url,
    description: BRAND.description,
    inLanguage: "en-IN",
    publisher: { "@id": `${url}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
