import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/cms";
import { BRAND } from "@/lib/seo";
import { siteUrl } from "@/lib/env";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.metaTitle || `${BRAND.name} — ${BRAND.tagline}`;
  const description = settings.metaDescription || BRAND.description;
  const url = siteUrl();

  return {
    metadataBase: new URL(url),
    title: {
      default: title,
      template: `%s | ${BRAND.name}`,
    },
    description,
    applicationName: BRAND.name,
    authors: [{ name: BRAND.name, url }],
    creator: BRAND.name,
    publisher: BRAND.name,
    keywords: [
      "Veloria",
      "Veloria advisory",
      "Veloria Score",
      "legal health checkup",
      "business readiness",
      "governance",
      "transaction advisory",
      "startup legal India",
    ],
    category: "business",
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: BRAND.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    formatDetection: {
      email: true,
      telephone: true,
      address: true,
    },
    other: {
      "geo.region": "IN",
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${dmSans.variable} ${playfair.variable} ${instrument.variable} h-full overflow-x-clip antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip bg-cream text-ink">{children}</body>
    </html>
  );
}
