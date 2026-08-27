import { Reveal } from "@/components/site/reveal";
import { getServices } from "@/lib/cms";
import { parseJsonArray } from "@/lib/utils";
import Link from "next/link";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="relative overflow-hidden bg-forest-950 px-6 pb-24 pt-40 text-cream md:pt-48">
        <div className="aurora" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Services</p>
            <h1 className="font-display max-w-3xl text-5xl tracking-tight md:text-7xl">
              Legal infrastructure for every chapter of the company.
            </h1>
            <p className="mt-6 max-w-xl text-cream/65">
              From first incorporation hygiene to Series diligence — Veloria packages counsel into
              clear workstreams founders can actually run.
            </p>
          </Reveal>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-3 bg-cream" />
      </section>

      <section className="bg-cream px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl space-y-16">
          {services.map((service, i) => {
            const features = parseJsonArray<string>(service.features);
            return (
              <Reveal key={service.id} delay={i * 0.05}>
                <article
                  id={service.slug}
                  className="grid gap-8 border-b border-ink/10 pb-16 last:border-0 md:grid-cols-[0.35fr_1fr]"
                >
                  <div>
                    <p className="text-xs tracking-[0.2em] text-ink-soft">0{i + 1}</p>
                    <h2 className="font-display mt-3 text-4xl tracking-tight text-ink">
                      {service.title}
                    </h2>
                  </div>
                  <div>
                    <p className="text-lg text-ink-soft">{service.summary}</p>
                    <p className="mt-4 leading-relaxed text-ink-soft/90">{service.description}</p>
                    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="rounded-2xl bg-[#f8f5ef] px-4 py-3 text-sm text-ink"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-forest-900 px-6 py-20 text-cream">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-3xl md:text-4xl">See monthly packages</h2>
          <Link
            href="/packages"
            className="inline-flex rounded-full bg-signal px-6 py-3 text-sm font-semibold text-forest-950"
          >
            Explore packages
          </Link>
        </div>
      </section>
    </>
  );
}
