import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const body = (await request.json()) as { body?: string };

  if (!body.body?.trim()) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const note = await prisma.leadNote.create({
    data: {
      leadId: id,
      body: body.body.trim(),
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(note, { status: 201 });
}
