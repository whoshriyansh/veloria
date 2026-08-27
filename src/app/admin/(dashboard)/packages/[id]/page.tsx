import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, oid, serialize } from "@/lib/models";
import { PageHeader } from "@/components/admin/ui";
import { PackageEditor } from "@/components/admin/package-editor";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidId(id)) notFound();

  await connectMongo();
  const packagesCol = await collections.packages();
  const pkgRaw = await packagesCol.findOne({ _id: oid(id) });
  if (!pkgRaw) notFound();

  const pkg = serialize(pkgRaw as Record<string, unknown>);
  if (Array.isArray(pkg.features)) {
    pkg.features = [...(pkg.features as { order?: number }[])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
  }

  return (
    <div>
      <Link
        href="/admin/packages"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="size-3.5" />
        Back to packages
      </Link>
      <PageHeader title={String(pkg.name)} description={String(pkg.slug)} />
      <PackageEditor
        pkg={{
          id: pkg.id,
          name: String(pkg.name),
          slug: String(pkg.slug),
          tagline: String(pkg.tagline ?? ""),
          description: String(pkg.description ?? ""),
          cadence: String(pkg.cadence ?? "Monthly"),
          highlight: Boolean(pkg.highlight),
          order: Number(pkg.order ?? 0),
          isVisible: Boolean(pkg.isVisible),
          ctaLabel: String(pkg.ctaLabel ?? "Request access"),
          features: ((pkg.features as { id: string; text: string; order: number }[]) ?? []).map(
            (f) => ({
              id: f.id,
              text: f.text,
              order: f.order,
            }),
          ),
        }}
      />
    </div>
  );
}
