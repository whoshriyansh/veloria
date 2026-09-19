import type { Metadata } from "next";
import { LegalHealthCheckup } from "@/components/checkup/legal-health-checkup";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { getHealthQuestions } from "@/lib/cms";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Veloria Score — Legal Health Checkup",
    description:
      "Take the free Veloria Score: a 15-question legal health checkup across structure, governance, contracts, compliance and transaction readiness.",
    path: "/legal-health-checkup",
  });
}

export default async function LegalHealthCheckupPage() {
  const questions = await getHealthQuestions();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Veloria", path: "/" },
          { name: "Veloria Score", path: "/legal-health-checkup" },
        ])}
      />
      <section className="page-hero">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">The Veloria Score™</p>
            <h1 className="page-hero-title font-display">
              Legal Health Checkup
            </h1>
            <p className="mt-6 max-w-xl text-cream/65">
              Fifteen yes/no questions across structure, governance, contracts, compliance,
              transaction readiness and risk. Submit your answers — a Veloria representative will
              call you soon.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-cream-deep">
        <div className="container-v max-w-3xl">
          {questions.length === 0 ? (
            <p className="text-ink-soft">The checkup will appear here once questions are published in admin.</p>
          ) : (
            <LegalHealthCheckup
              questions={questions.map((q) => ({
                id: q.id,
                question: q.question,
                category: q.category,
                helpText: q.helpText,
                order: q.order,
              }))}
            />
          )}
        </div>
      </section>
    </>
  );
}
