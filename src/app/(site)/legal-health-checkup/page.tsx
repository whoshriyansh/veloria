import { LegalHealthCheckup } from "@/components/checkup/legal-health-checkup";
import { Reveal } from "@/components/site/reveal";
import { getHealthQuestions } from "@/lib/cms";

export default async function LegalHealthCheckupPage() {
  const questions = await getHealthQuestions();

  return (
    <>
      <section className="relative overflow-hidden bg-forest-950 px-6 pb-20 pt-40 text-cream md:pt-48">
        <div className="aurora" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-6">Free diagnostic</p>
            <h1 className="font-display max-w-3xl text-5xl tracking-tight md:text-7xl">
              Legal Health Checkup
            </h1>
            <p className="mt-6 max-w-xl text-cream/65">
              Fifteen yes/no questions used by counsel before fundraising, accelerator review, and
              investor diligence. Submit your answers — a Veloria representative will call you soon.
            </p>
          </Reveal>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-3 bg-cream" />
      </section>

      <section className="bg-cream px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <LegalHealthCheckup
            questions={questions.map((q) => ({
              id: q.id,
              question: q.question,
              category: q.category,
              helpText: q.helpText,
              order: q.order,
            }))}
          />
        </div>
      </section>
    </>
  );
}
