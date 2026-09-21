import { requireAdmin } from "@/lib/admin-auth";
import { afterPublicCmsWrite } from "@/lib/cms";
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
  if (typeof body.role === "string") data.role = body.role;
  if (typeof body.imageUrl === "string") data.imageUrl = body.imageUrl;
  if (typeof body.bio === "string") data.bio = body.bio;
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;

  await connectMongo();
  const col = await collections.foundingMembers();
  const member = await col.findOneAndUpdate(
    { _id: oid(id) },
    { $set: data },
    { returnDocument: "after" },
  );
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  afterPublicCmsWrite();
  return NextResponse.json(serialize(member as Record<string, unknown>));
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await connectMongo();
  const col = await collections.foundingMembers();
  const result = await col.deleteOne({ _id: oid(id) });
  if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  afterPublicCmsWrite();
  return NextResponse.json({ ok: true });
}
