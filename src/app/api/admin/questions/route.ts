import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const healthQuestions = await collections.healthQuestions();
  const questions = await healthQuestions.find({}).sort({ order: 1 }).toArray();
  return NextResponse.json(questions.map((q) => serialize(q as Record<string, unknown>)));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    question?: string;
    category?: string;
    order?: number;
    yesIsGood?: boolean;
    helpText?: string;
    isActive?: boolean;
    weight?: number;
  };

  if (!body.question?.trim()) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  await connectMongo();
  const healthQuestions = await collections.healthQuestions();
  const doc = {
    question: body.question.trim(),
    category: body.category ?? "General",
    order: typeof body.order === "number" ? body.order : 0,
    yesIsGood: body.yesIsGood ?? true,
    helpText: body.helpText ?? "",
    isActive: body.isActive ?? true,
    weight: typeof body.weight === "number" ? body.weight : 1,
  };
  const result = await healthQuestions.insertOne(doc);

  return NextResponse.json(
    serialize({ ...doc, _id: result.insertedId } as Record<string, unknown>),
    { status: 201 },
  );
}
