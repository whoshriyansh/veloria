import { requireAdmin } from "@/lib/admin-auth";
import { afterPublicCmsWrite } from "@/lib/cms";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const col = await collections.foundingMembers();
  const members = await col.find({}).sort({ order: 1 }).toArray();
  return NextResponse.json(members.map((m) => serialize(m as Record<string, unknown>)));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    name?: string;
    role?: string;
    imageUrl?: string;
    bio?: string;
    order?: number;
    isVisible?: boolean;
  };

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  await connectMongo();
  const col = await collections.foundingMembers();
  const baseSlug = slugify(body.name) || `member-${Date.now()}`;
  let slug = baseSlug;
  let n = 2;
  while (await col.findOne({ slug })) {
    slug = `${baseSlug}-${n}`;
    n += 1;
  }

  const doc = {
    slug,
    name: body.name.trim(),
    role: (body.role ?? "Founding Member").trim() || "Founding Member",
    imageUrl: body.imageUrl ?? "",
    bio: body.bio ?? "",
    order: typeof body.order === "number" ? body.order : 0,
    isVisible: body.isVisible ?? true,
  };
  const result = await col.insertOne(doc);
  afterPublicCmsWrite();
  return NextResponse.json(
    serialize({ ...doc, _id: result.insertedId } as Record<string, unknown>),
    { status: 201 },
  );
}
