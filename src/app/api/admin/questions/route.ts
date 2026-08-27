import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const questions = await prisma.healthQuestion.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(questions);
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

  const created = await prisma.healthQuestion.create({
    data: {
      question: body.question.trim(),
      category: body.category ?? "General",
      order: typeof body.order === "number" ? body.order : 0,
      yesIsGood: body.yesIsGood ?? true,
      helpText: body.helpText ?? "",
      isActive: body.isActive ?? true,
      weight: typeof body.weight === "number" ? body.weight : 1,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
