import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const pagesCol = await collections.pages();
  const pages = await pagesCol.find({}).sort({ slug: 1 }).toArray();
  return NextResponse.json(pages.map((page) => serialize(page as Record<string, unknown>)));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    slug?: string;
    title?: string;
    subtitle?: string;
    content?: string;
    sections?: string;
    isPublished?: boolean;
  };

  if (!body.slug?.trim() || !body.title?.trim()) {
    return NextResponse.json({ error: "slug and title are required" }, { status: 400 });
  }

  await connectMongo();
  const pagesCol = await collections.pages();
  const now = new Date();
  const doc = {
    slug: body.slug.trim(),
    title: body.title.trim(),
    subtitle: body.subtitle ?? "",
    content: body.content ?? "",
    heroImage: "",
    seoTitle: "",
    seoDescription: "",
    sections: body.sections ?? "[]",
    isPublished: body.isPublished ?? true,
    createdAt: now,
    updatedAt: now,
  };
  const result = await pagesCol.insertOne(doc);

  return NextResponse.json(
    serialize({ ...doc, _id: result.insertedId } as Record<string, unknown>),
    { status: 201 },
  );
}
