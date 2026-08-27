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
    label?: string;
    href?: string;
    order?: number;
    isVisible?: boolean;
    isExternal?: boolean;
  } = {};

  if (typeof body.label === "string") data.label = body.label.trim();
  if (typeof body.href === "string") data.href = body.href.trim();
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;
  if (typeof body.isExternal === "boolean") data.isExternal = body.isExternal;

  try {
    const item = await prisma.navigationItem.update({ where: { id }, data });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  try {
    await prisma.navigationItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
