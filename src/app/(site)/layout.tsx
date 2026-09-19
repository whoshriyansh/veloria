import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CheckupPopup } from "@/components/checkup/checkup-popup";
import { CustomCursor } from "@/components/site/custom-cursor";
import { FilmGrain, ScrollProgress } from "@/components/site/chrome";
import { VeloriaChat } from "@/components/site/veloria-chat";
import { JsonLd } from "@/components/site/json-ld";
import { getContactInfo, getNavigation, getServices, getSiteSettings } from "@/lib/cms";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, contact, nav, services] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
    getNavigation(),
    getServices(),
  ]);

  return (
    <>
      <JsonLd data={organizationJsonLd(contact, services)} />
      <JsonLd data={websiteJsonLd()} />
      <CustomCursor />
      <ScrollProgress />
      <FilmGrain />
      <SiteHeader
        logoText={settings.logoText}
        items={nav}
        contactEmail={contact.email}
      />
      <main className="flex-1 pb-[5.5rem] sm:pb-24 lg:pb-0">{children}</main>
      <SiteFooter
        logoText={settings.logoText}
        footerText={settings.footerText}
        email={contact.email}
        phone={contact.phone}
        address={contact.address}
        nav={nav}
      />
      <CheckupPopup
        enabled={settings.showCheckupPopup}
        delayMs={settings.popupDelayMs}
        title={settings.popupTitle}
        body={settings.popupBody}
        cta={settings.popupCta}
      />
      <VeloriaChat />
    </>
  );
}
