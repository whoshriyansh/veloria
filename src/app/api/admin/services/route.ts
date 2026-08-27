import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    title?: string;
    slug?: string;
    summary?: string;
    description?: string;
    imageUrl?: string;
    icon?: string;
    order?: number;
    features?: string;
    isVisible?: boolean;
  };

  if (!body.title?.trim() || !body.slug?.trim()) {
    return NextResponse.json({ error: "title and slug are required" }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      title: body.title.trim(),
      slug: body.slug.trim(),
      summary: body.summary ?? "",
      description: body.description ?? "",
      imageUrl: body.imageUrl ?? "",
      icon: body.icon ?? "scale",
      order: typeof body.order === "number" ? body.order : 0,
      features: body.features ?? "[]",
      isVisible: body.isVisible ?? true,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
