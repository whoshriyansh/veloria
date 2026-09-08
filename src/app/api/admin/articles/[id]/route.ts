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
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.heading === "string") data.heading = body.heading;
  if (typeof body.imageUrl === "string") data.imageUrl = body.imageUrl;
  if (typeof body.link === "string") data.link = body.link;
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;

  await connectMongo();
  const col = await collections.articles();
  const article = await col.findOneAndUpdate(
    { _id: oid(id) },
    { $set: data },
    { returnDocument: "after" },
  );
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  afterPublicCmsWrite();
  return NextResponse.json(serialize(article as Record<string, unknown>));
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await connectMongo();
  const col = await collections.articles();
  const result = await col.deleteOne({ _id: oid(id) });
  if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  afterPublicCmsWrite();
  return NextResponse.json({ ok: true });
}
