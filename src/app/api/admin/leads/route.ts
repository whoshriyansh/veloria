import { requireAdmin } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectMongo();
  const leadsCol = await collections.leads();
  const leads = await leadsCol.find({}).sort({ createdAt: -1 }).toArray();

  return NextResponse.json(
    leads.map((lead) => {
      const serialized = serialize(lead as Record<string, unknown>);
      return {
        ...serialized,
        _count: {
          answers: Array.isArray(lead.answers) ? lead.answers.length : 0,
          leadNotes: Array.isArray(lead.leadNotes) ? lead.leadNotes.length : 0,
        },
      };
    }),
  );
}
