import { LegalHealthCheckup } from "@/components/checkup/legal-health-checkup";
import { Reveal } from "@/components/site/reveal";
import { getHealthQuestions } from "@/lib/cms";

export default async function LegalHealthCheckupPage() {
  const questions = await getHealthQuestions();

  return (
    <>
      <section className="relative overflow-hidden bg-forest-950 px-6 pb-20 pt-28 text-cream md:pt-36">
        <div className="aurora" />
        <div className="container-v relative">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">The Veloria Score™</p>
            <h1 className="font-display max-w-3xl text-5xl font-medium tracking-tight md:text-7xl">
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

      <section className="bg-cream-deep py-16 md:py-24">
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
