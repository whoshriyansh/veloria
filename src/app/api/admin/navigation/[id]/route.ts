import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, oid, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const data: {
    label?: string;
    href?: string;
    order?: number;
    isVisible?: boolean;
    isExternal?: boolean;
  } = {};

  if (typeof body.label === "string") data.label = body.label.trim();
  if (typeof body.href === "string") data.href = body.href.trim();
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;
  if (typeof body.isExternal === "boolean") data.isExternal = body.isExternal;

  await connectMongo();
  const navigationItems = await collections.navigationItems();
  const item = await navigationItems.findOneAndUpdate(
    { _id: oid(id) },
    { $set: data },
    { returnDocument: "after" },
  );
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(item as Record<string, unknown>));
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectMongo();
  const navigationItems = await collections.navigationItems();
  const result = await navigationItems.deleteOne({ _id: oid(id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
