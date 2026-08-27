import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Users,
  FileText,
  Briefcase,
  Package,
  HelpCircle,
  Settings,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminCard, PageHeader, Table, Th, Td } from "@/components/admin/ui";
import { ReadinessBadge, StatusBadge } from "@/components/admin/status-badge";
import { LEAD_STATUSES } from "@/lib/lead-status";

export default async function AdminDashboardPage() {
  const [leads, statusGroups, recentLeads, counts] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    Promise.all([
      prisma.page.count(),
      prisma.service.count(),
      prisma.package.count(),
      prisma.healthQuestion.count({ where: { isActive: true } }),
    ]),
  ]);

  const statusMap = Object.fromEntries(
    statusGroups.map((g) => [g.status, g._count._all]),
  ) as Record<string, number>;

  const quickLinks = [
    { href: "/admin/leads", label: "Leads", icon: Users, meta: `${leads} total` },
    { href: "/admin/pages", label: "Pages", icon: FileText, meta: `${counts[0]} pages` },
    {
      href: "/admin/services",
      label: "Services",
      icon: Briefcase,
      meta: `${counts[1]} services`,
    },
    {
      href: "/admin/packages",
      label: "Packages",
      icon: Package,
      meta: `${counts[2]} packages`,
    },
    {
      href: "/admin/questions",
      label: "Questions",
      icon: HelpCircle,
      meta: `${counts[3]} active`,
    },
    { href: "/admin/settings", label: "Settings", icon: Settings, meta: "Site & popup" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Lead pipeline and content overview."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {LEAD_STATUSES.map((status) => (
          <AdminCard key={status} className="!p-4">
            <div className="text-[11px] uppercase tracking-[0.14em] text-white/40">
              {status.replaceAll("_", " ")}
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {statusMap[status] ?? 0}
            </div>
          </AdminCard>
        ))}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map(({ href, label, icon: Icon, meta }) => (
          <Link
            key={href}
            href={href}
            className="admin-card group flex items-center justify-between p-4 transition hover:border-[#6ef0a4]/25"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/5 p-2 text-[#6ef0a4]">
                <Icon className="size-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-xs text-white/45">{meta}</div>
              </div>
            </div>
            <ArrowRight className="size-4 text-white/30 transition group-hover:text-[#6ef0a4]" />
          </Link>
        ))}
      </div>

      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Recent leads</h2>
          <Link href="/admin/leads" className="text-xs text-[#6ef0a4] hover:underline">
            View all
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-white/45">No leads yet.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Score</Th>
                <Th>Readiness</Th>
                <Th>Status</Th>
                <Th>When</Th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02]">
                  <Td>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-white hover:text-[#6ef0a4]"
                    >
                      {lead.name}
                    </Link>
                    <div className="text-xs text-white/40">{lead.phone}</div>
                  </Td>
                  <Td>
                    {lead.score}/{lead.maxScore}
                  </Td>
                  <Td>
                    <ReadinessBadge readiness={lead.readiness} />
                  </Td>
                  <Td>
                    <StatusBadge status={lead.status} />
                  </Td>
                  <Td className="text-white/50">
                    {formatDistanceToNow(lead.createdAt, { addSuffix: true })}
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
