import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: { features: { orderBy: { order: "asc" } } },
  });
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pkg);
}

export async function PATCH(request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;

  const data: {
    name?: string;
    slug?: string;
    tagline?: string;
    description?: string;
    cadence?: string;
    highlight?: boolean;
    order?: number;
    isVisible?: boolean;
    ctaLabel?: string;
  } = {};

  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.slug === "string") data.slug = body.slug;
  if (typeof body.tagline === "string") data.tagline = body.tagline;
  if (typeof body.description === "string") data.description = body.description;
  if (typeof body.cadence === "string") data.cadence = body.cadence;
  if (typeof body.highlight === "boolean") data.highlight = body.highlight;
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;
  if (typeof body.ctaLabel === "string") data.ctaLabel = body.ctaLabel;

  try {
    if (Array.isArray(body.features)) {
      const featureTexts = (body.features as unknown[])
        .filter((f): f is string => typeof f === "string")
        .map((f) => f.trim())
        .filter(Boolean);

      await prisma.$transaction([
        prisma.packageFeature.deleteMany({ where: { packageId: id } }),
        prisma.package.update({
          where: { id },
          data: {
            ...data,
            features: {
              create: featureTexts.map((text, order) => ({ text, order })),
            },
          },
        }),
      ]);
    } else {
      await prisma.package.update({ where: { id }, data });
    }

    const pkg = await prisma.package.findUnique({
      where: { id },
      include: { features: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(pkg);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  try {
    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
