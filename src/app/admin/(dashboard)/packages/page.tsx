import Link from "next/link";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { AdminCard, PageHeader } from "@/components/admin/ui";

export default async function PackagesPage() {
  await connectMongo();
  const packagesCol = await collections.packages();
  const packagesRaw = await packagesCol.find({}).sort({ order: 1 }).toArray();
  const packages = packagesRaw.map((pkg) => {
    const serialized = serialize(pkg as Record<string, unknown>);
    if (Array.isArray(serialized.features)) {
      serialized.features = [...(serialized.features as { order?: number }[])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      );
    }
    return serialized;
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
                  {String(pkg.name)}
                </Link>
                <div className="text-sm text-white/50">{String(pkg.tagline)}</div>
              </div>
              <div className="text-xs text-white/40">
                Order {Number(pkg.order)} · {pkg.isVisible ? "Visible" : "Hidden"}
                {pkg.highlight ? " · Highlighted" : ""}
              </div>
            </div>
            <ul className="space-y-1 text-sm text-white/70">
              {((pkg.features as { id: string; text: string }[]) ?? []).map((f) => (
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
