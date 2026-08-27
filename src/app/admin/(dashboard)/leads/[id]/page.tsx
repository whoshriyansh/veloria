import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, oid, serialize } from "@/lib/models";
import { PageHeader } from "@/components/admin/ui";
import { StatusBadge, ReadinessBadge } from "@/components/admin/status-badge";
import { LeadDetailClient } from "@/components/admin/lead-detail-client";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidId(id)) notFound();

  await connectMongo();
  const leads = await collections.leads();
  const leadRaw = await leads.findOne({ _id: oid(id) });
  if (!leadRaw) notFound();

  const lead = serialize(leadRaw as Record<string, unknown>);

  if (Array.isArray(lead.answers)) {
    lead.answers = [...(lead.answers as { question?: { order?: number } }[])].sort(
      (a, b) => (a.question?.order ?? 0) - (b.question?.order ?? 0),
    );
  }
  if (Array.isArray(lead.leadNotes)) {
    lead.leadNotes = [...(lead.leadNotes as { createdAt?: string }[])].sort((a, b) =>
      String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")),
    );
  }

  const serialized = {
    id: lead.id,
    name: String(lead.name),
    phone: String(lead.phone),
    email: lead.email ? String(lead.email) : null,
    company: lead.company ? String(lead.company) : null,
    score: Number(lead.score),
    maxScore: Number(lead.maxScore),
    readiness: String(lead.readiness),
    status: String(lead.status),
    source: String(lead.source ?? ""),
    notes: String(lead.notes ?? ""),
    assignedTo: lead.assignedTo ? String(lead.assignedTo) : null,
    createdAt: String(lead.createdAt),
    calledAt: lead.calledAt ? String(lead.calledAt) : null,
    answers: (lead.answers as {
      id: string;
      answer: boolean;
      question: {
        id: string;
        question: string;
        category: string;
        yesIsGood: boolean;
        helpText: string;
        order: number;
      };
    }[]) ?? [],
    leadNotes: (lead.leadNotes as {
      id: string;
      body: string;
      createdAt: string;
      author: { id: string; name: string; email: string } | null;
    }[]) ?? [],
  };

  return (
    <div>
      <Link
        href="/admin/leads"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="size-3.5" />
        Back to leads
      </Link>
      <PageHeader
        title={serialized.name}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge status={serialized.status} />
            <ReadinessBadge readiness={serialized.readiness} />
            <span className="text-white/40">
              {serialized.score}/{serialized.maxScore}
            </span>
          </span>
        }
      />
      <LeadDetailClient lead={serialized} />
    </div>
  );
}
