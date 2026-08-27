import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(service);
}

export async function PATCH(request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const data: {
    title?: string;
    slug?: string;
    summary?: string;
    description?: string;
    imageUrl?: string;
    icon?: string;
    order?: number;
    features?: string;
    isVisible?: boolean;
  } = {};

  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.slug === "string") data.slug = body.slug;
  if (typeof body.summary === "string") data.summary = body.summary;
  if (typeof body.description === "string") data.description = body.description;
  if (typeof body.imageUrl === "string") data.imageUrl = body.imageUrl;
  if (typeof body.icon === "string") data.icon = body.icon;
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.features === "string") data.features = body.features;
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;

  try {
    const service = await prisma.service.update({ where: { id }, data });
    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  try {
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
