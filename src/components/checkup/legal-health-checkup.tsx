"use client";

import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  question: string;
  category: string;
  helpText: string;
  order: number;
};

type Result = {
  score: number;
  maxScore: number;
  readiness: string;
  message: string;
};

export function LegalHealthCheckup({ questions }: { questions: Question[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const total = questions.length;
  const isContactStep = step === total;
  const progress = Math.min(step, total) / Math.max(total, 1);

  const current = questions[step];

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const setAnswer = (id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (step < total - 1) {
      window.setTimeout(() => setStep((s) => s + 1), 220);
    } else {
      window.setTimeout(() => setStep(total), 220);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Name and phone number are required.");
      return;
    }

    if (answeredCount < total) {
      setError("Please answer every question before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          company: company.trim() || undefined,
          answers: questions.map((q) => ({
            questionId: q.id,
            answer: answers[q.id],
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult({
        score: data.score,
        maxScore: data.maxScore,
        readiness: data.readiness,
        message: data.message,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-ink/8 bg-white/50 p-8 md:p-12"
      >
        <p className="eyebrow mb-4">Report received</p>
        <h2 className="font-display text-4xl tracking-tight text-ink md:text-5xl">
          Our representative will call you soon.
        </h2>
        <p className="mt-5 max-w-xl text-ink-soft">{result.message}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-forest-900 p-5 text-cream">
            <p className="text-xs uppercase tracking-[0.18em] text-cream/55">Score</p>
            <p className="mt-2 font-display text-4xl">
              {result.score}
              <span className="text-xl text-cream/50">/{result.maxScore}</span>
            </p>
          </div>
          <div className="rounded-2xl bg-cream-deep/60 p-5 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Readiness</p>
            <p className="mt-2 font-display text-3xl text-moss">{result.readiness}</p>
            <p className="mt-2 text-sm text-ink-soft">
              A Veloria counsel will review your answers and reach you at {phone}.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className=" border border-ink/8 bg-white/40 p-6 backdrop-blur-sm md:p-10">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs tracking-[0.16em] text-ink-soft">
          <span>
            {isContactStep ? "CONTACT" : `QUESTION ${Math.min(step + 1, total)} / ${total}`}
          </span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className="h-full bg-signal-deep"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isContactStep && current ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.35 }}
          >
            <p className="eyebrow mb-4">{current.category}</p>
            <h2 className="font-display max-w-2xl text-3xl leading-tight tracking-tight text-ink md:text-4xl">
              {current.question}
            </h2>
            {current.helpText ? (
              <p className="mt-4 max-w-xl text-sm text-ink-soft">{current.helpText}</p>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setAnswer(current.id, true)}
                className={cn(
                  "min-w-[120px] rounded-full border px-8 py-3.5 text-sm font-medium transition",
                  answers[current.id] === true
                    ? "border-forest-900 bg-forest-900 text-cream"
                    : "border-ink/15 bg-transparent text-ink hover:border-ink/40",
                )}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setAnswer(current.id, false)}
                className={cn(
                  "min-w-[120px] rounded-full border px-8 py-3.5 text-sm font-medium transition",
                  answers[current.id] === false
                    ? "border-forest-900 bg-forest-900 text-cream"
                    : "border-ink/15 bg-transparent text-ink hover:border-ink/40",
                )}
              >
                No
              </button>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex items-center gap-1 rounded-full border border-ink/10 px-4 py-2 text-sm text-ink-soft disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Back
              </button>
              {answers[current.id] !== undefined ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(total, s + 1))}
                  className="inline-flex items-center gap-1 rounded-full border border-ink/10 px-4 py-2 text-sm text-ink"
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : null}
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="contact"
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            className="max-w-xl"
          >
            <p className="eyebrow mb-4">Almost done</p>
            <h2 className="font-display text-3xl tracking-tight text-ink md:text-4xl">
              Where should we reach you?
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              Share your details. A Veloria representative will call you with a read of your report.
            </p>

            <div className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm">
                <span className="text-ink-soft">Full name *</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl border border-ink/12 bg-white/70 px-4 py-3 outline-none ring-signal-deep/40 focus:ring-2"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="text-ink-soft">Phone number *</span>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-2xl border border-ink/12 bg-white/70 px-4 py-3 outline-none ring-signal-deep/40 focus:ring-2"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="text-ink-soft">Email (optional)</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border border-ink/12 bg-white/70 px-4 py-3 outline-none ring-signal-deep/40 focus:ring-2"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="text-ink-soft">Company (optional)</span>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="rounded-2xl border border-ink/12 bg-white/70 px-4 py-3 outline-none ring-signal-deep/40 focus:ring-2"
                />
              </label>
            </div>

            {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(total - 1)}
                className="inline-flex items-center gap-1 rounded-full border border-ink/10 px-4 py-2 text-sm text-ink-soft"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-6 py-3 text-sm font-medium text-cream disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit report"}
                {!submitting ? <Check size={16} /> : null}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
