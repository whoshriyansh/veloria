import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { connectMongo } from "@/lib/mongodb";
import { collections, isValidId, oid, serialize } from "@/lib/models";
import { PageHeader } from "@/components/admin/ui";
import { PageEditor } from "@/components/admin/page-editor";

export default async function PageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidId(id)) notFound();

  await connectMongo();
  const pages = await collections.pages();
  const pageRaw = await pages.findOne({ _id: oid(id) });
  if (!pageRaw) notFound();
  const page = serialize(pageRaw as Record<string, unknown>);

  return (
    <div>
      <Link
        href="/admin/pages"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="size-3.5" />
        Back to pages
      </Link>
      <PageHeader title={String(page.title)} description={`/${String(page.slug)}`} />
      <PageEditor
        page={{
          id: page.id,
          slug: String(page.slug),
          title: String(page.title),
          subtitle: String(page.subtitle ?? ""),
          content: String(page.content ?? ""),
          sections: String(page.sections ?? "[]"),
          isPublished: Boolean(page.isPublished),
        }}
      />
    </div>
  );
}
