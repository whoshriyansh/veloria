import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, ObjectId, oid, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const body = (await request.json()) as { body?: string };

  if (!body.body?.trim()) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }

  await connectMongo();
  const leads = await collections.leads();
  const note = {
    _id: new ObjectId(),
    body: body.body.trim(),
    authorId: session.user.id,
    authorName: session.user.name ?? "Admin",
    authorEmail: session.user.email ?? "",
    createdAt: new Date(),
  };

  const lead = await leads.findOneAndUpdate(
    { _id: oid(id) },
    {
      $push: { leadNotes: note },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" },
  );

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const serializedLead = serialize(lead as Record<string, unknown>);
  const notes = serializedLead.leadNotes as Record<string, unknown>[];
  const serializedNote = notes[notes.length - 1] ?? {
    id: String(note._id),
    body: note.body,
    createdAt: note.createdAt,
    author: {
      id: session.user.id,
      name: session.user.name ?? "Admin",
      email: session.user.email ?? "",
    },
  };

  return NextResponse.json(serializedNote, { status: 201 });
}
