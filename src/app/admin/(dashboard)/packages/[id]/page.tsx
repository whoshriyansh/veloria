import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { PackageEditor } from "@/components/admin/package-editor";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: { features: { orderBy: { order: "asc" } } },
  });
  if (!pkg) notFound();

  return (
    <div>
      <Link
        href="/admin/packages"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="size-3.5" />
        Back to packages
      </Link>
      <PageHeader title={pkg.name} description={pkg.slug} />
      <PackageEditor pkg={pkg} />
    </div>
  );
}
