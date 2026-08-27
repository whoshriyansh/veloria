import { getSiteSettings } from "@/lib/cms";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return (
    <SettingsForm
      initial={{
        siteName: settings.siteName,
        tagline: settings.tagline,
        heroHeadline: settings.heroHeadline,
        heroSubheadline: settings.heroSubheadline,
        heroCtaLabel: settings.heroCtaLabel,
        heroCtaHref: settings.heroCtaHref,
        aboutPreview: settings.aboutPreview,
        footerText: settings.footerText,
        logoText: settings.logoText,
        metaTitle: settings.metaTitle,
        metaDescription: settings.metaDescription,
        showCheckupPopup: settings.showCheckupPopup,
        popupDelayMs: settings.popupDelayMs,
        popupTitle: settings.popupTitle,
        popupBody: settings.popupBody,
        popupCta: settings.popupCta,
      }}
    />
  );
}
