import { Reveal } from "@/components/site/reveal";
import { getServices } from "@/lib/cms";
import { parseJsonArray } from "@/lib/utils";
import { Photo } from "@/components/site/photo";
import { serviceIcon } from "@/lib/visual";
import Link from "next/link";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="page-hero">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">What we do</p>
            <h1 className="page-hero-title font-display">
              We strengthen the business behind the opportunity.
            </h1>
            <p className="mt-6 max-w-xl text-cream/65">
              Core advisory across structure, contracts, fundraising, diligence, projects and
              strategic decisions — managed from the Veloria dashboard.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-v space-y-0">
          {services.map((service, i) => {
            const features = parseJsonArray<string>(service.features);
            const Icon = serviceIcon(service.slug, service.title);
            return (
              <Reveal key={service.id} delay={i * 0.04}>
                <article
                  id={service.slug}
                    className="grid gap-6 border-b border-ink/10 py-10 first:pt-0 sm:py-14 md:grid-cols-[0.4fr_1fr] md:gap-8 md:py-16"
                >
                  <div className="group">
                    <p className="text-xs tracking-[0.2em] text-gold">0{i + 1}</p>
                    <Icon className="icon-glyph icon-glyph-xl mt-5" strokeWidth={1.15} />
                    <h2 className="font-display mt-4 text-[clamp(1.7rem,5vw,2.25rem)] font-medium leading-[1.18] tracking-tight">
                      {service.title}
                    </h2>
                    {service.imageUrl ? (
                      <Photo
                        src={service.imageUrl}
                        className="mt-6 aspect-[4/3] w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-lg text-ink-soft">{service.summary}</p>
                    <p className="mt-4 leading-relaxed text-ink-soft">{service.description}</p>
                    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                      {features.map((feature) => (
                        <li key={feature} className="border border-ink/10 bg-[#f8f5ef] px-4 py-3 text-sm">
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

      <section className="bg-forest-900 py-20 text-cream">
        <div className="container-v flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-[clamp(1.7rem,5vw,2.25rem)] md:text-4xl">Monthly retainers, scoped to outcomes.</h2>
          <Link href="/packages" className="btn-lux bg-signal font-semibold text-forest-950">
            Explore packages
          </Link>
        </div>
      </section>
    </>
  );
}
