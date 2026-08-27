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
  const pages = await collections.pages();
  const page = await pages.findOne({ _id: oid(id) });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(page as Record<string, unknown>));
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
    subtitle?: string;
    content?: string;
    sections?: string;
    isPublished?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    heroImage?: string;
    slug?: string;
    updatedAt?: Date;
  } = {};

  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.subtitle === "string") data.subtitle = body.subtitle;
  if (typeof body.content === "string") data.content = body.content;
  if (typeof body.sections === "string") data.sections = body.sections;
  if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;
  if (typeof body.seoTitle === "string") data.seoTitle = body.seoTitle;
  if (typeof body.seoDescription === "string") data.seoDescription = body.seoDescription;
  if (typeof body.heroImage === "string") data.heroImage = body.heroImage;
  if (typeof body.slug === "string") data.slug = body.slug;
  data.updatedAt = new Date();

  await connectMongo();
  const pages = await collections.pages();
  const page = await pages.findOneAndUpdate(
    { _id: oid(id) },
    { $set: data },
    { returnDocument: "after" },
  );
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(page as Record<string, unknown>));
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectMongo();
  const pages = await collections.pages();
  const result = await pages.deleteOne({ _id: oid(id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
