import { prisma } from "@/lib/prisma";
import { readinessFromScore } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const answerSchema = z.object({
  questionId: z.string().min(1),
  answer: z.boolean(),
});

const checkupSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  phone: z.string().trim().min(1, "phone is required"),
  email: z.string().trim().email().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  answers: z.array(answerSchema).min(1, "answers are required"),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkupSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, phone, email, company, answers } = parsed.data;
  const questionIds = [...new Set(answers.map((a) => a.questionId))];

  const questions = await prisma.healthQuestion.findMany({
    where: { id: { in: questionIds }, isActive: true },
  });

  if (questions.length !== questionIds.length) {
    return NextResponse.json({ error: "One or more questions are invalid" }, { status: 400 });
  }

  const questionMap = new Map(questions.map((q) => [q.id, q]));
  let score = 0;
  let maxScore = 0;

  for (const item of answers) {
    const question = questionMap.get(item.questionId);
    if (!question) continue;
    maxScore += question.weight;
    if (item.answer === question.yesIsGood) {
      score += question.weight;
    }
  }

  const readiness = readinessFromScore(score, maxScore);

  const lead = await prisma.lead.create({
    data: {
      name,
      phone,
      email: email || null,
      company: company || null,
      score,
      maxScore,
      readiness,
      status: "NEW",
      source: "Legal Health Checkup",
      answers: {
        create: answers.map((a) => ({
          questionId: a.questionId,
          answer: a.answer,
        })),
      },
    },
  });

  return NextResponse.json({
    ok: true,
    leadId: lead.id,
    score,
    maxScore,
    readiness,
    message:
      "Thanks — a Veloria representative will review your checkup and call you shortly.",
  });
}
