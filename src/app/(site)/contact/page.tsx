import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact-form";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { getContactInfo, getPageBySlug } from "@/lib/cms";
import { breadcrumbJsonLd, cmsPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("contact");
  return cmsPageMetadata({
    page,
    title: "Speak with Veloria",
    description:
      "Speak with Veloria about business readiness, governance, transactions or the Veloria Score. A representative will reach out within 24 hours.",
    path: "/contact",
  });
}

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
      ? "I am writing regarding a Veloria dinner."
      : "";

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Veloria", path: "/" },
          { name: "Speak with Veloria", path: "/contact" },
        ])}
      />
      <section className="page-hero">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Veloria Advisory</p>
            <h1 className="page-hero-title font-display">
              {page?.title ?? "Build before the opportunity arrives."}
            </h1>
            <p className="mt-6 max-w-xl text-cream/65">{page?.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
          <div className="container-v grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-12">
          <Reveal>
            <div className="space-y-8">
              <p className="text-ink-soft">{page?.content}</p>
              <div>
                <p className="eyebrow mb-2">Email</p>
                <a href={`mailto:${contact.email}`} className="break-all text-lg hover:text-moss">
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
