import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json(settings);
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

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json(settings);
}
