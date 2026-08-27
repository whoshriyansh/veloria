import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, ObjectId, oid } from "@/lib/models";
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

  if (!questionIds.every((id) => isValidId(id))) {
    return NextResponse.json({ error: "One or more questions are invalid" }, { status: 400 });
  }

  await connectMongo();
  const healthQuestions = await collections.healthQuestions();

  const questions = await healthQuestions
    .find({
      _id: { $in: questionIds.map((id) => oid(id)) },
      isActive: true,
    })
    .toArray();

  if (questions.length !== questionIds.length) {
    return NextResponse.json({ error: "One or more questions are invalid" }, { status: 400 });
  }

  const questionMap = new Map(questions.map((q) => [String(q._id), q]));
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
  const now = new Date();

  const doc = {
    name,
    phone,
    email: email || null,
    company: company || null,
    score,
    maxScore,
    readiness,
    status: "NEW",
    source: "Legal Health Checkup",
    notes: "",
    answers: answers.map((a) => {
      const question = questionMap.get(a.questionId)!;
      return {
        _id: new ObjectId(),
        questionId: a.questionId,
        answer: a.answer,
        questionSnapshot: {
          question: question.question,
          category: question.category,
          yesIsGood: question.yesIsGood,
          helpText: question.helpText,
          order: question.order,
        },
        createdAt: now,
      };
    }),
    leadNotes: [] as never[],
    createdAt: now,
    updatedAt: now,
  };

  const leads = await collections.leads();
  const result = await leads.insertOne(doc);

  return NextResponse.json({
    ok: true,
    leadId: String(result.insertedId),
    score,
    maxScore,
    readiness,
    message:
      "Thanks — a Veloria representative will review your checkup and call you shortly.",
  });
}
