import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/cms";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const instrument = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cormorant.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
