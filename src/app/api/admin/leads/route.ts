import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { answers: true, leadNotes: true } },
    },
  });

  return NextResponse.json(leads);
}
