import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, ObjectId, oid, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

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

export async function GET(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectMongo();
  const packagesCol = await collections.packages();
  const pkg = await packagesCol.findOne({ _id: oid(id) });
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const serialized = serialize(pkg as Record<string, unknown>);
  if (Array.isArray(serialized.features)) {
    serialized.features = [...(serialized.features as { order?: number }[])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
  }
  return NextResponse.json(serialized);
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
    name?: string;
    slug?: string;
    tagline?: string;
    description?: string;
    cadence?: string;
    highlight?: boolean;
    order?: number;
    isVisible?: boolean;
    ctaLabel?: string;
    features?: { _id: ObjectId; text: string; order: number }[];
    updatedAt?: Date;
  } = {};

  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.slug === "string") data.slug = body.slug;
  if (typeof body.tagline === "string") data.tagline = body.tagline;
  if (typeof body.description === "string") data.description = body.description;
  if (typeof body.cadence === "string") data.cadence = body.cadence;
  if (typeof body.highlight === "boolean") data.highlight = body.highlight;
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.isVisible === "boolean") data.isVisible = body.isVisible;
  if (typeof body.ctaLabel === "string") data.ctaLabel = body.ctaLabel;
  if (Array.isArray(body.features)) {
    data.features = normalizeFeatures(body.features);
  }
  data.updatedAt = new Date();

  await connectMongo();
  const packagesCol = await collections.packages();
  const pkg = await packagesCol.findOneAndUpdate(
    { _id: oid(id) },
    { $set: data },
    { returnDocument: "after" },
  );
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const serialized = serialize(pkg as Record<string, unknown>);
  if (Array.isArray(serialized.features)) {
    serialized.features = [...(serialized.features as { order?: number }[])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
  }
  return NextResponse.json(serialized);
}

export async function DELETE(_request: Request, context: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectMongo();
  const packagesCol = await collections.packages();
  const result = await packagesCol.deleteOne({ _id: oid(id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
