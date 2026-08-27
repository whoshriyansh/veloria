import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, oid, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectMongo();
  const services = await collections.services();
  const service = await services.findOne({ _id: oid(id) });
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(service as Record<string, unknown>));
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
    title?: string;
    slug?: string;
    summary?: string;
    description?: string;
    imageUrl?: string;
    icon?: string;
    order?: number;
    features?: string;
    isVisible?: boolean;
    updatedAt?: Date;
  } = {};

  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.slug === "string") data.slug = body.slug;
  if (typeof body.summary === "string") data.summary = body.summary;
  if (typeof body.description === "string") data.description = body.description;
  if (typeof body.imageUrl === "string") data.imageUrl = body.imageUrl;
  if (typeof body.icon === "string") data.icon = body.icon;
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.features === "string") data.features = body.features;
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;
  data.updatedAt = new Date();

  await connectMongo();
  const services = await collections.services();
  const service = await services.findOneAndUpdate(
    { _id: oid(id) },
    { $set: data },
    { returnDocument: "after" },
  );
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(service as Record<string, unknown>));
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectMongo();
  const services = await collections.services();
  const result = await services.deleteOne({ _id: oid(id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
