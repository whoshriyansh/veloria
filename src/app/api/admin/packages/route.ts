import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const packages = await prisma.package.findMany({
    orderBy: { order: "asc" },
    include: { features: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(packages);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    name?: string;
    slug?: string;
    tagline?: string;
    description?: string;
    cadence?: string;
    highlight?: boolean;
    order?: number;
    isVisible?: boolean;
    ctaLabel?: string;
    features?: string[];
  };

  if (!body.name?.trim() || !body.slug?.trim()) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
  }

  const features = Array.isArray(body.features) ? body.features.filter((f) => f.trim()) : [];

  const pkg = await prisma.package.create({
    data: {
      name: body.name.trim(),
      slug: body.slug.trim(),
      tagline: body.tagline ?? "",
      description: body.description ?? "",
      cadence: body.cadence ?? "Monthly",
      highlight: body.highlight ?? false,
      order: typeof body.order === "number" ? body.order : 0,
      isVisible: body.isVisible ?? true,
      ctaLabel: body.ctaLabel ?? "Request access",
      features: {
        create: features.map((text, order) => ({ text: text.trim(), order })),
      },
    },
    include: { features: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(pkg, { status: 201 });
}
