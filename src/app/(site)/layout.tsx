import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CheckupPopup } from "@/components/checkup/checkup-popup";
import { getContactInfo, getNavigation, getSiteSettings } from "@/lib/cms";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, contact, nav] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
    getNavigation(),
  ]);

  return (
    <>
      <SiteHeader
        logoText={settings.logoText}
        items={nav}
        contactEmail={contact.email}
      />
      <main className="flex-1">{children}</main>
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
    </>
  );
}
