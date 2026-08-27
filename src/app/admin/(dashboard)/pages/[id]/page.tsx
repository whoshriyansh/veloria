import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { PageEditor } from "@/components/admin/page-editor";

export default async function PageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div>
      <Link
        href="/admin/pages"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="size-3.5" />
        Back to pages
      </Link>
      <PageHeader title={page.title} description={`/${page.slug}`} />
      <PageEditor
        page={{
          id: page.id,
          slug: page.slug,
          title: page.title,
          subtitle: page.subtitle,
          content: page.content,
          sections: page.sections,
          isPublished: page.isPublished,
        }}
      />
    </div>
  );
}
