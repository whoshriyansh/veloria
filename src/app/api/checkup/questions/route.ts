import { getHealthQuestions } from "@/lib/cms";
import { NextResponse } from "next/server";

export async function GET() {
  const questions = await getHealthQuestions();
  return NextResponse.json(questions);
}
