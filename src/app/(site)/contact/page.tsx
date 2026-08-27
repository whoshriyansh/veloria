import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/site/reveal";
import { getContactInfo, getPageBySlug } from "@/lib/cms";

export default async function ContactPage() {
  const [page, contact] = await Promise.all([getPageBySlug("contact"), getContactInfo()]);

  return (
    <>
      <section className="relative overflow-hidden bg-forest-950 px-6 pb-24 pt-40 text-cream md:pt-48">
        <div className="aurora" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Contact</p>
            <h1 className="font-display max-w-3xl text-5xl tracking-tight md:text-7xl">
              {page?.title ?? "Let’s talk readiness"}
            </h1>
            <p className="mt-6 max-w-xl text-cream/65">{page?.subtitle}</p>
          </Reveal>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-3 bg-cream" />
      </section>

      <section className="bg-cream px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="space-y-8">
              <p className="text-ink-soft">{page?.content}</p>
              <div>
                <p className="eyebrow mb-2">Email</p>
                <a href={`mailto:${contact.email}`} className="text-lg text-ink hover:text-moss">
                  {contact.email}
                </a>
              </div>
              <div>
                <p className="eyebrow mb-2">Phone</p>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="text-lg text-ink hover:text-moss"
                >
                  {contact.phone}
                </a>
              </div>
              <div>
                <p className="eyebrow mb-2">Studios</p>
                <p className="text-lg text-ink">{contact.address}</p>
              </div>
              <div>
                <p className="eyebrow mb-2">Hours</p>
                <p className="text-lg text-ink">{contact.hours}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
