import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const siteSettings = await collections.siteSettings();
  const settings = await siteSettings.findOne({ key: "default" });
  return NextResponse.json(settings ? serialize(settings as Record<string, unknown>) : null);
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as Record<string, unknown>;
  const data: Record<string, string | number | boolean> = {};

  const stringKeys = [
    "siteName",
    "tagline",
    "heroHeadline",
    "heroSubheadline",
    "heroCtaLabel",
    "heroCtaHref",
    "aboutPreview",
    "footerText",
    "logoText",
    "metaTitle",
    "metaDescription",
    "popupTitle",
    "popupBody",
    "popupCta",
  ] as const;

  for (const key of stringKeys) {
    if (typeof body[key] === "string") data[key] = body[key];
  }
  if (typeof body.showCheckupPopup === "boolean") data.showCheckupPopup = body.showCheckupPopup;
  if (typeof body.popupDelayMs === "number") data.popupDelayMs = body.popupDelayMs;

  await connectMongo();
  const siteSettings = await collections.siteSettings();
  const settings = await siteSettings.findOneAndUpdate(
    { key: "default" },
    { $set: data, $setOnInsert: { key: "default" } },
    { upsert: true, returnDocument: "after" },
  );

  return NextResponse.json(serialize(settings as Record<string, unknown>));
}
