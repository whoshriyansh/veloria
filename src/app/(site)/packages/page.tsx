import { Reveal } from "@/components/site/reveal";
import { getPackages } from "@/lib/cms";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <>
      <section className="relative overflow-hidden bg-forest-950 px-6 pb-24 pt-40 text-cream md:pt-48">
        <div className="aurora" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Packages</p>
            <h1 className="font-display max-w-3xl text-5xl tracking-tight md:text-7xl">
              Monthly counsel. No price tags on the page.
            </h1>
            <p className="mt-6 max-w-xl text-cream/65">
              Every package is scoped around outcomes — readiness, continuity, and diligence speed.
              Pricing is shared on a call after we understand your stage.
            </p>
          </Reveal>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-3 bg-cream" />
      </section>

      <section className="bg-cream px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 0.08}>
              <article
                className={cn(
                  "flex h-full flex-col rounded-[1.75rem] border p-7 md:p-8",
                  pkg.highlight
                    ? "border-forest-900 bg-forest-900 text-cream"
                    : "border-ink/10 bg-white/50 text-ink",
                )}
              >
                <p
                  className={cn(
                    "text-xs tracking-[0.18em]",
                    pkg.highlight ? "text-signal/80" : "text-ink-soft",
                  )}
                >
                  {pkg.cadence.toUpperCase()}
                </p>
                <h2 className="font-display mt-4 text-3xl tracking-tight">{pkg.name}</h2>
                <p
                  className={cn(
                    "mt-2 text-sm",
                    pkg.highlight ? "text-cream/70" : "text-ink-soft",
                  )}
                >
                  {pkg.tagline}
                </p>
                <p
                  className={cn(
                    "mt-5 text-sm leading-relaxed",
                    pkg.highlight ? "text-cream/65" : "text-ink-soft",
                  )}
                >
                  {pkg.description}
                </p>
                <ul className="mt-8 flex-1 space-y-3">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature.id}
                      className={cn(
                        "border-t pt-3 text-sm",
                        pkg.highlight ? "border-cream/15" : "border-ink/10",
                      )}
                    >
                      {feature.text}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={cn(
                    "mt-8 inline-flex justify-center rounded-full px-5 py-3 text-sm font-medium transition",
                    pkg.highlight
                      ? "bg-signal text-forest-950 hover:brightness-105"
                      : "bg-forest-900 text-cream hover:bg-forest-800",
                  )}
                >
                  {pkg.ctaLabel}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
