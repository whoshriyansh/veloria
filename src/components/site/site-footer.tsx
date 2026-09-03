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
    <footer className="bg-[#101613] text-[#aab3ad]">
      <div className="container-v py-11">
        <div className="grid gap-11 md:grid-cols-[1.3fr_.8fr_.8fr]">
          <div>
            <p className="font-display text-[29px] tracking-[0.11em] text-white">{logoText}</p>
            <p className="mt-3 max-w-[350px] text-[12px] leading-relaxed">
              Business readiness, governance and transaction advisory for ambitious companies and
              entrepreneurs.
            </p>
          </div>
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.14em] text-[#d4dad6]">Explore</p>
            <ul className="space-y-2 text-[12px]">
              {nav.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="nav-link transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.14em] text-[#d4dad6]">Contact</p>
            <ul className="space-y-2 text-[12px]">
              <li>
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {phone}
                </a>
              </li>
              <li>{address}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-5 text-[10px] leading-relaxed text-[#7c8781]">
          {footerText}
        </div>
      </div>
    </footer>
  );
}
