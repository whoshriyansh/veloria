import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const items = await prisma.navigationItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    label?: string;
    href?: string;
    order?: number;
    isVisible?: boolean;
    isExternal?: boolean;
  };

  if (!body.label?.trim() || !body.href?.trim()) {
    return NextResponse.json({ error: "label and href are required" }, { status: 400 });
  }

  const item = await prisma.navigationItem.create({
    data: {
      label: body.label.trim(),
      href: body.href.trim(),
      order: typeof body.order === "number" ? body.order : 0,
      isVisible: body.isVisible ?? true,
      isExternal: body.isExternal ?? false,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
