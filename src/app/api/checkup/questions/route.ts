import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const questions = await prisma.healthQuestion.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      question: true,
      category: true,
      order: true,
      helpText: true,
      yesIsGood: true,
      weight: true,
    },
  });

  return NextResponse.json(questions);
}
