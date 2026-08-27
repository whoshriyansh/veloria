import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const contact = await prisma.contactInfo.findUnique({ where: { id: "default" } });
  return NextResponse.json(contact);
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as Record<string, unknown>;
  const data: Record<string, string> = {};
  const keys = ["email", "phone", "address", "linkedin", "twitter", "calendly", "hours"] as const;

  for (const key of keys) {
    if (typeof body[key] === "string") data[key] = body[key];
  }

  const contact = await prisma.contactInfo.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json(contact);
}
