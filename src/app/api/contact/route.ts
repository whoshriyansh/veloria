import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.string().trim().email().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const { name, phone, email, company, message } = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      name,
      phone,
      email: email || null,
      company: company || null,
      score: 0,
      maxScore: 0,
      readiness: "Contact Inquiry",
      status: "NEW",
      source: "Contact Form",
      notes: message || "",
    },
  });

  return NextResponse.json({
    ok: true,
    leadId: lead.id,
    message: "Thanks — a Veloria representative will call you soon.",
  });
}
