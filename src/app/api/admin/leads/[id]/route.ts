import { requireAdmin } from "@/lib/admin-auth";
import { isLeadStatus } from "@/lib/lead-status";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      answers: {
        include: { question: true },
        orderBy: { question: { order: "asc" } },
      },
      leadNotes: {
        include: { author: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const data: {
    status?: string;
    notes?: string;
    assignedTo?: string | null;
    calledAt?: Date | null;
  } = {};

  if (typeof body.status === "string") {
    if (!isLeadStatus(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = body.status;
  }
  if (typeof body.notes === "string") data.notes = body.notes;
  if (typeof body.assignedTo === "string") data.assignedTo = body.assignedTo || null;
  if (body.assignedTo === null) data.assignedTo = null;
  if (body.calledAt === null) data.calledAt = null;
  if (typeof body.calledAt === "string") {
    const parsed = new Date(body.calledAt);
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Invalid calledAt" }, { status: 400 });
    }
    data.calledAt = parsed;
  }

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data,
      include: {
        answers: {
          include: { question: true },
          orderBy: { question: { order: "asc" } },
        },
        leadNotes: {
          include: { author: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
