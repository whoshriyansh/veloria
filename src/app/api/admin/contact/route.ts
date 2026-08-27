import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const contactInfo = await collections.contactInfo();
  const contact = await contactInfo.findOne({ key: "default" });
  return NextResponse.json(contact ? serialize(contact as Record<string, unknown>) : null);
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

  await connectMongo();
  const contactInfo = await collections.contactInfo();
  const contact = await contactInfo.findOneAndUpdate(
    { key: "default" },
    { $set: data, $setOnInsert: { key: "default" } },
    { upsert: true, returnDocument: "after" },
  );

  return NextResponse.json(serialize(contact as Record<string, unknown>));
}
