import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });
  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    slug?: string;
    title?: string;
    subtitle?: string;
    content?: string;
    sections?: string;
    isPublished?: boolean;
  };

  if (!body.slug?.trim() || !body.title?.trim()) {
    return NextResponse.json({ error: "slug and title are required" }, { status: 400 });
  }

  const page = await prisma.page.create({
    data: {
      slug: body.slug.trim(),
      title: body.title.trim(),
      subtitle: body.subtitle ?? "",
      content: body.content ?? "",
      sections: body.sections ?? "[]",
      isPublished: body.isPublished ?? true,
    },
  });

  return NextResponse.json(page, { status: 201 });
}
