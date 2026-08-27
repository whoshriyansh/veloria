import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { QuestionsManager } from "@/components/admin/questions-manager";

export default async function QuestionsPage() {
  await connectMongo();
  const healthQuestions = await collections.healthQuestions();
  const questionsRaw = await healthQuestions.find({}).sort({ order: 1 }).toArray();
  const questions = questionsRaw.map((q) => serialize(q as Record<string, unknown>)) as {
    id: string;
    question: string;
    category: string;
    order: number;
    weight: number;
    yesIsGood: boolean;
    helpText: string;
    isActive: boolean;
  }[];
  return <QuestionsManager initialQuestions={questions} />;
}
