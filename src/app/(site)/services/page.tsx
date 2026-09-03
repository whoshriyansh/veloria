import { Reveal } from "@/components/site/reveal";
import { getServices } from "@/lib/cms";
import { parseJsonArray } from "@/lib/utils";
import Link from "next/link";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="relative overflow-hidden bg-forest-950 px-6 pb-24 pt-28 text-cream md:pt-36">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">What we do</p>
            <h1 className="font-display max-w-3xl text-5xl font-medium tracking-tight md:text-7xl">
              We strengthen the business behind the opportunity.
            </h1>
            <p className="mt-6 max-w-xl text-cream/65">
              Core advisory across structure, contracts, fundraising, diligence, projects and
              strategic decisions — managed from the Veloria dashboard.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-[88px]">
        <div className="container-v space-y-0">
          {services.map((service, i) => {
            const features = parseJsonArray<string>(service.features);
            return (
              <Reveal key={service.id} delay={i * 0.04}>
                <article
                  id={service.slug}
                  className="grid gap-8 border-b border-ink/10 py-16 first:pt-0 md:grid-cols-[0.4fr_1fr]"
                >
                  <div>
                    <p className="text-xs tracking-[0.2em] text-gold">0{i + 1}</p>
                    <h2 className="font-display mt-3 text-4xl font-medium tracking-tight">
                      {service.title}
                    </h2>
                    {service.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.imageUrl}
                        alt=""
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
        <div className="container-v flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-3xl md:text-4xl">Monthly retainers, scoped to outcomes.</h2>
          <Link href="/packages" className="btn-lux bg-signal font-semibold text-forest-950">
            Explore packages
          </Link>
        </div>
      </section>
    </>
  );
}
