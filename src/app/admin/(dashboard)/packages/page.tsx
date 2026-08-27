import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminCard, PageHeader } from "@/components/admin/ui";

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { order: "asc" },
    include: { features: { orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <PageHeader title="Packages" description="Retainer packages and feature lists." />
      <div className="space-y-4">
        {packages.map((pkg) => (
          <AdminCard key={pkg.id}>
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link
                  href={`/admin/packages/${pkg.id}`}
                  className="text-lg font-medium text-white hover:text-[#6ef0a4]"
                >
                  {pkg.name}
                </Link>
                <div className="text-sm text-white/50">{pkg.tagline}</div>
              </div>
              <div className="text-xs text-white/40">
                Order {pkg.order} · {pkg.isVisible ? "Visible" : "Hidden"}
                {pkg.highlight ? " · Highlighted" : ""}
              </div>
            </div>
            <ul className="space-y-1 text-sm text-white/70">
              {pkg.features.map((f) => (
                <li key={f.id}>• {f.text}</li>
              ))}
            </ul>
          </AdminCard>
        ))}
        {packages.length === 0 ? (
          <AdminCard>
            <p className="text-sm text-white/45">No packages yet.</p>
          </AdminCard>
        ) : null}
      </div>
    </div>
  );
}
