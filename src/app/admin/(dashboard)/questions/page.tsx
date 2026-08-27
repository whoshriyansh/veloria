import { prisma } from "@/lib/prisma";
import { QuestionsManager } from "@/components/admin/questions-manager";

export default async function QuestionsPage() {
  const questions = await prisma.healthQuestion.findMany({ orderBy: { order: "asc" } });
  return <QuestionsManager initialQuestions={questions} />;
}
