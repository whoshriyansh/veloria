import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, oid, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await request.json()) as Record<string, unknown>;
  const data: Record<string, string | number | boolean> = {};
  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.logoUrl === "string") data.logoUrl = body.logoUrl;
  if (typeof body.website === "string") data.website = body.website;
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;

  await connectMongo();
  const col = await collections.clients();
  const client = await col.findOneAndUpdate(
    { _id: oid(id) },
    { $set: data },
    { returnDocument: "after" },
  );
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(client as Record<string, unknown>));
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await connectMongo();
  const col = await collections.clients();
  const result = await col.deleteOne({ _id: oid(id) });
  if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
