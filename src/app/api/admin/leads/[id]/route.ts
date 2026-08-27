import { requireAdmin } from "@/lib/admin-auth";
import { isLeadStatus } from "@/lib/lead-status";
import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, oid, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

function serializeLead(lead: Record<string, unknown>) {
  const serialized = serialize(lead);
  if (Array.isArray(serialized.answers)) {
    serialized.answers = [...(serialized.answers as { question?: { order?: number } }[])].sort(
      (a, b) => (a.question?.order ?? 0) - (b.question?.order ?? 0),
    );
  }
  if (Array.isArray(serialized.leadNotes)) {
    serialized.leadNotes = [...(serialized.leadNotes as { createdAt?: string }[])].sort((a, b) =>
      String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")),
    );
  }
  return serialized;
}

export async function GET(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectMongo();
  const leads = await collections.leads();
  const lead = await leads.findOne({ _id: oid(id) });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeLead(lead as Record<string, unknown>));
}

export async function PATCH(request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const data: {
    status?: string;
    notes?: string;
    assignedTo?: string | null;
    calledAt?: Date | null;
    updatedAt?: Date;
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
  data.updatedAt = new Date();

  await connectMongo();
  const leads = await collections.leads();
  const lead = await leads.findOneAndUpdate(
    { _id: oid(id) },
    { $set: data },
    { returnDocument: "after" },
  );
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeLead(lead as Record<string, unknown>));
}
