import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, ObjectId, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

function normalizeFeatures(features: unknown): { _id: ObjectId; text: string; order: number }[] {
  if (!Array.isArray(features)) return [];
  return features
    .map((f, order) => {
      if (typeof f === "string") {
        const text = f.trim();
        return text ? { _id: new ObjectId(), text, order } : null;
      }
      if (f && typeof f === "object" && typeof (f as { text?: unknown }).text === "string") {
        const text = (f as { text: string }).text.trim();
        const featureOrder =
          typeof (f as { order?: unknown }).order === "number"
            ? (f as { order: number }).order
            : order;
        const existingId = (f as { id?: unknown }).id;
        const _id =
          typeof existingId === "string" && ObjectId.isValid(existingId)
            ? new ObjectId(existingId)
            : new ObjectId();
        return text ? { _id, text, order: featureOrder } : null;
      }
      return null;
    })
    .filter((f): f is { _id: ObjectId; text: string; order: number } => f !== null);
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const packagesCol = await collections.packages();
  const packages = await packagesCol.find({}).sort({ order: 1 }).toArray();
  return NextResponse.json(
    packages.map((pkg) => {
      const serialized = serialize(pkg as Record<string, unknown>);
      if (Array.isArray(serialized.features)) {
        serialized.features = [...(serialized.features as { order?: number }[])].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0),
        );
      }
      return serialized;
    }),
  );
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as {
    name?: string;
    slug?: string;
    tagline?: string;
    description?: string;
    cadence?: string;
    highlight?: boolean;
    order?: number;
    isVisible?: boolean;
    ctaLabel?: string;
    features?: unknown;
  };

  if (!body.name?.trim() || !body.slug?.trim()) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
  }

  await connectMongo();
  const packagesCol = await collections.packages();
  const now = new Date();
  const doc = {
    name: body.name.trim(),
    slug: body.slug.trim(),
    tagline: body.tagline ?? "",
    description: body.description ?? "",
    cadence: body.cadence ?? "Monthly",
    highlight: body.highlight ?? false,
    order: typeof body.order === "number" ? body.order : 0,
    isVisible: body.isVisible ?? true,
    ctaLabel: body.ctaLabel ?? "Request access",
    features: normalizeFeatures(body.features),
    createdAt: now,
    updatedAt: now,
  };
  const result = await packagesCol.insertOne(doc);

  return NextResponse.json(
    serialize({ ...doc, _id: result.insertedId } as Record<string, unknown>),
    { status: 201 },
  );
}
