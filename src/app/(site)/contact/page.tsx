import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/site/reveal";
import { getContactInfo, getPageBySlug } from "@/lib/cms";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const [page, contact, params] = await Promise.all([
    getPageBySlug("contact"),
    getContactInfo(),
    searchParams,
  ]);
  const defaultMessage =
    params.intent === "circle"
      ? "I would like to be considered for the Veloria Founders Circle. I am requesting a conversation — not a seat by default."
      : "";

  return (
    <>
      <section className="relative overflow-hidden bg-forest-950 px-6 pb-24 pt-28 text-cream md:pt-36">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Veloria Advisory</p>
            <h1 className="font-display max-w-3xl text-5xl font-medium tracking-tight md:text-7xl">
              {page?.title ?? "Build before the opportunity arrives."}
            </h1>
            <p className="mt-6 max-w-xl text-cream/65">{page?.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-[88px]">
        <div className="container-v grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <Reveal>
            <div className="space-y-8">
              <p className="text-ink-soft">{page?.content}</p>
              <div>
                <p className="eyebrow mb-2">Email</p>
                <a href={`mailto:${contact.email}`} className="text-lg hover:text-moss">
                  {contact.email}
                </a>
              </div>
              <div>
                <p className="eyebrow mb-2">Phone</p>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-lg hover:text-moss">
                  {contact.phone}
                </a>
              </div>
              <div>
                <p className="eyebrow mb-2">Studio</p>
                <p className="text-lg">{contact.address}</p>
              </div>
              <div>
                <p className="eyebrow mb-2">Hours</p>
                <p className="text-lg">{contact.hours}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactForm defaultMessage={defaultMessage} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
