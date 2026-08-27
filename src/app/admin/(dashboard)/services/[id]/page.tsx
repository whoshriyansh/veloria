import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, oid, serialize } from "@/lib/models";
import { PageHeader } from "@/components/admin/ui";
import { ServiceEditor } from "@/components/admin/service-editor";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidId(id)) notFound();

  await connectMongo();
  const services = await collections.services();
  const serviceRaw = await services.findOne({ _id: oid(id) });
  if (!serviceRaw) notFound();
  const service = serialize(serviceRaw as Record<string, unknown>);

  return (
    <div>
      <Link
        href="/admin/services"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="size-3.5" />
        Back to services
      </Link>
      <PageHeader title={String(service.title)} description={String(service.slug)} />
      <ServiceEditor
        mode="edit"
        service={{
          id: service.id,
          title: String(service.title),
          slug: String(service.slug),
          summary: String(service.summary ?? ""),
          description: String(service.description ?? ""),
          imageUrl: String(service.imageUrl ?? ""),
          icon: String(service.icon ?? "scale"),
          order: Number(service.order ?? 0),
          features: String(service.features ?? "[]"),
          isVisible: Boolean(service.isVisible),
        }}
      />
    </div>
  );
}
