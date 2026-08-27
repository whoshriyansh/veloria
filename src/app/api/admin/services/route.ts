import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const servicesCol = await collections.services();
  const services = await servicesCol.find({}).sort({ order: 1 }).toArray();
  return NextResponse.json(services.map((s) => serialize(s as Record<string, unknown>)));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    title?: string;
    slug?: string;
    summary?: string;
    description?: string;
    imageUrl?: string;
    icon?: string;
    order?: number;
    features?: string;
    isVisible?: boolean;
  };

  if (!body.title?.trim() || !body.slug?.trim()) {
    return NextResponse.json({ error: "title and slug are required" }, { status: 400 });
  }

  await connectMongo();
  const servicesCol = await collections.services();
  const now = new Date();
  const doc = {
    title: body.title.trim(),
    slug: body.slug.trim(),
    summary: body.summary ?? "",
    description: body.description ?? "",
    imageUrl: body.imageUrl ?? "",
    icon: body.icon ?? "scale",
    order: typeof body.order === "number" ? body.order : 0,
    features: body.features ?? "[]",
    isVisible: body.isVisible ?? true,
    createdAt: now,
    updatedAt: now,
  };
  const result = await servicesCol.insertOne(doc);

  return NextResponse.json(
    serialize({ ...doc, _id: result.insertedId } as Record<string, unknown>),
    { status: 201 },
  );
}
