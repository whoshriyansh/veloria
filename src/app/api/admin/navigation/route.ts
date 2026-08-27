import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const navigationItems = await collections.navigationItems();
  const items = await navigationItems.find({}).sort({ order: 1 }).toArray();
  return NextResponse.json(items.map((item) => serialize(item as Record<string, unknown>)));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    label?: string;
    href?: string;
    order?: number;
    isVisible?: boolean;
    isExternal?: boolean;
  };

  if (!body.label?.trim() || !body.href?.trim()) {
    return NextResponse.json({ error: "label and href are required" }, { status: 400 });
  }

  await connectMongo();
  const navigationItems = await collections.navigationItems();
  const doc = {
    label: body.label.trim(),
    href: body.href.trim(),
    order: typeof body.order === "number" ? body.order : 0,
    isVisible: body.isVisible ?? true,
    isExternal: body.isExternal ?? false,
  };
  const result = await navigationItems.insertOne(doc);

  return NextResponse.json(
    serialize({ ...doc, _id: result.insertedId } as Record<string, unknown>),
    { status: 201 },
  );
}
