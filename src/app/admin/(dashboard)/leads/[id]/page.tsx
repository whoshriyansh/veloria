import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { StatusBadge, ReadinessBadge } from "@/components/admin/status-badge";
import { LeadDetailClient } from "@/components/admin/lead-detail-client";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      answers: {
        include: { question: true },
        orderBy: { question: { order: "asc" } },
      },
      leadNotes: {
        include: { author: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!lead) notFound();

  const serialized = {
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    calledAt: lead.calledAt?.toISOString() ?? null,
    answers: lead.answers.map((a) => ({
      id: a.id,
      answer: a.answer,
      question: {
        id: a.question.id,
        question: a.question.question,
        category: a.question.category,
        yesIsGood: a.question.yesIsGood,
        helpText: a.question.helpText,
        order: a.question.order,
      },
    })),
    leadNotes: lead.leadNotes.map((n) => ({
      id: n.id,
      body: n.body,
      createdAt: n.createdAt.toISOString(),
      author: n.author,
    })),
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
        title={lead.name}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge status={lead.status} />
            <ReadinessBadge readiness={lead.readiness} />
            <span className="text-white/40">
              {lead.score}/{lead.maxScore}
            </span>
          </span>
        }
      />
      <LeadDetailClient lead={serialized} />
    </div>
  );
}
