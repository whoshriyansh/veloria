import Link from "next/link";

export function SiteFooter({
  logoText,
  footerText,
  email,
  phone,
  address,
  nav,
}: {
  logoText: string;
  footerText: string;
  email: string;
  phone: string;
  address: string;
  nav: { id: string; label: string; href: string }[];
}) {
  return (
    <footer className="relative overflow-hidden bg-forest-950 text-cream">
      <div className="aurora opacity-40" />
      <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-5xl tracking-tight md:text-6xl">{logoText}</p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/65">
              Eternal legal counsel for founders who refuse to arrive at diligence unprepared.
            </p>
            <Link
              href="/legal-health-checkup"
              className="mt-8 inline-flex rounded-full bg-signal px-5 py-3 text-sm font-medium text-forest-950 transition hover:brightness-105"
            >
              Free Legal Health Checkup
            </Link>
          </div>

          <div>
            <p className="eyebrow eyebrow-light mb-4">Navigate</p>
            <ul className="space-y-3 text-sm text-cream/75">
              {nav.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="transition hover:text-cream">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow eyebrow-light mb-4">Contact</p>
            <ul className="space-y-3 text-sm text-cream/75">
              <li>
                <a href={`mailto:${email}`} className="hover:text-cream">
                  {email}
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-cream">
                  {phone}
                </a>
              </li>
              <li>{address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs tracking-[0.14em] text-cream/45 md:flex-row md:items-center md:justify-between">
          <p>{footerText}</p>
          <p>INVESTMENT · COMPLIANCE · PAPERWORK</p>
        </div>
      </div>
      <div className="h-3 bg-cream" />
    </footer>
  );
}
