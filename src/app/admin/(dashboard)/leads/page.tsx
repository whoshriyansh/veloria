import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { AdminCard, PageHeader, Table, Th, Td } from "@/components/admin/ui";
import { ReadinessBadge, StatusBadge } from "@/components/admin/status-badge";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Leads"
        description={`${leads.length} checkup submissions`}
      />

      <AdminCard>
        {leads.length === 0 ? (
          <p className="text-sm text-white/45">No leads yet.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                <Th>Score</Th>
                <Th>Readiness</Th>
                <Th>Status</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02]">
                  <Td>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-white hover:text-[#6ef0a4]"
                    >
                      {lead.name}
                    </Link>
                    {lead.company ? (
                      <div className="text-xs text-white/40">{lead.company}</div>
                    ) : null}
                  </Td>
                  <Td>{lead.phone}</Td>
                  <Td className="text-white/70">{lead.email ?? "—"}</Td>
                  <Td>
                    {lead.score}/{lead.maxScore}
                  </Td>
                  <Td>
                    <ReadinessBadge readiness={lead.readiness} />
                  </Td>
                  <Td>
                    <StatusBadge status={lead.status} />
                  </Td>
                  <Td className="whitespace-nowrap text-white/50">
                    {format(lead.createdAt, "MMM d, yyyy HH:mm")}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </AdminCard>
    </div>
  );
}
