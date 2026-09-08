import { requireAdmin } from "@/lib/admin-auth";
import { afterPublicCmsWrite } from "@/lib/cms";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const col = await collections.articles();
  const articles = await col.find({}).sort({ order: 1 }).toArray();
  return NextResponse.json(articles.map((a) => serialize(a as Record<string, unknown>)));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    title?: string;
    heading?: string;
    imageUrl?: string;
    link?: string;
    order?: number;
    isPublished?: boolean;
  };

  if (!body.title?.trim() || !body.link?.trim()) {
    return NextResponse.json({ error: "title and link are required" }, { status: 400 });
  }

  await connectMongo();
  const col = await collections.articles();
  const doc = {
    title: body.title.trim(),
    heading: body.heading?.trim() ?? "",
    imageUrl: body.imageUrl ?? "",
    link: body.link.trim(),
    order: typeof body.order === "number" ? body.order : 0,
    isPublished: body.isPublished ?? true,
    publishedAt: new Date(),
  };
  const result = await col.insertOne(doc);
  afterPublicCmsWrite();
  return NextResponse.json(
    serialize({ ...doc, _id: result.insertedId } as Record<string, unknown>),
    { status: 201 },
  );
}
