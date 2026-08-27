import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PATCH(request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const data: {
    title?: string;
    subtitle?: string;
    content?: string;
    sections?: string;
    isPublished?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    heroImage?: string;
    slug?: string;
  } = {};

  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.subtitle === "string") data.subtitle = body.subtitle;
  if (typeof body.content === "string") data.content = body.content;
  if (typeof body.sections === "string") data.sections = body.sections;
  if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;
  if (typeof body.seoTitle === "string") data.seoTitle = body.seoTitle;
  if (typeof body.seoDescription === "string") data.seoDescription = body.seoDescription;
  if (typeof body.heroImage === "string") data.heroImage = body.heroImage;
  if (typeof body.slug === "string") data.slug = body.slug;

  try {
    const page = await prisma.page.update({ where: { id }, data });
    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  try {
    await prisma.page.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
