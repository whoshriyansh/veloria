import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, oid, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const data: {
    question?: string;
    category?: string;
    order?: number;
    yesIsGood?: boolean;
    helpText?: string;
    isActive?: boolean;
    weight?: number;
  } = {};

  if (typeof body.question === "string") data.question = body.question;
  if (typeof body.category === "string") data.category = body.category;
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.yesIsGood === "boolean") data.yesIsGood = body.yesIsGood;
  if (typeof body.helpText === "string") data.helpText = body.helpText;
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (typeof body.weight === "number") data.weight = body.weight;

  await connectMongo();
  const healthQuestions = await collections.healthQuestions();
  const question = await healthQuestions.findOneAndUpdate(
    { _id: oid(id) },
    { $set: data },
    { returnDocument: "after" },
  );
  if (!question) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(question as Record<string, unknown>));
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectMongo();
  const healthQuestions = await collections.healthQuestions();
  const result = await healthQuestions.deleteOne({ _id: oid(id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
