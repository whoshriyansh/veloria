import { requireAdmin } from "@/lib/admin-auth";
import { afterPublicCmsWrite } from "@/lib/cms";
import { sanitizeNotifyEmails } from "@/lib/email";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const contactInfo = await collections.contactInfo();
  const contact = await contactInfo.findOne({ key: "default" });
  if (!contact) return NextResponse.json(null);
  return NextResponse.json(
    serialize({
      ...contact,
      notifyEmails: sanitizeNotifyEmails(contact.notifyEmails),
    } as Record<string, unknown>),
  );
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  const keys = ["email", "phone", "address", "linkedin", "twitter", "calendly", "hours"] as const;

  for (const key of keys) {
    if (typeof body[key] === "string") data[key] = body[key];
  }
  if ("notifyEmails" in body) {
    data.notifyEmails = sanitizeNotifyEmails(body.notifyEmails);
  }

  await connectMongo();
  const contactInfo = await collections.contactInfo();
  const contact = await contactInfo.findOneAndUpdate(
    { key: "default" },
    { $set: data, $setOnInsert: { key: "default" } },
    { upsert: true, returnDocument: "after" },
  );

  afterPublicCmsWrite();
  return NextResponse.json(serialize(contact as Record<string, unknown>));
}
