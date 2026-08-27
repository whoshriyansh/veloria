import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongo();
  const healthQuestions = await collections.healthQuestions();
  const questions = await healthQuestions
    .find(
      { isActive: true },
      {
        projection: {
          question: 1,
          category: 1,
          order: 1,
          helpText: 1,
          yesIsGood: 1,
          weight: 1,
        },
      },
    )
    .sort({ order: 1 })
    .toArray();

  return NextResponse.json(questions.map((q) => serialize(q as Record<string, unknown>)));
}
