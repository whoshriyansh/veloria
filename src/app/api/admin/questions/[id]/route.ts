import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
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

  try {
    const question = await prisma.healthQuestion.update({ where: { id }, data });
    return NextResponse.json(question);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  try {
    await prisma.healthQuestion.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
