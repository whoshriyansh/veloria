import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const col = await collections.clients();
  const clients = await col.find({}).sort({ order: 1 }).toArray();
  return NextResponse.json(clients.map((c) => serialize(c as Record<string, unknown>)));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    name?: string;
    logoUrl?: string;
    website?: string;
    order?: number;
    isVisible?: boolean;
  };

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  await connectMongo();
  const col = await collections.clients();
  const doc = {
    name: body.name.trim(),
    logoUrl: body.logoUrl ?? "",
    website: body.website ?? "",
    order: typeof body.order === "number" ? body.order : 0,
    isVisible: body.isVisible ?? true,
  };
  const result = await col.insertOne(doc);
  return NextResponse.json(
    serialize({ ...doc, _id: result.insertedId } as Record<string, unknown>),
    { status: 201 },
  );
}
