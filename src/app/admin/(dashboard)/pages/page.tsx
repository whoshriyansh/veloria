import Link from "next/link";
import { format } from "date-fns";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { AdminCard, PageHeader, Table, Th, Td } from "@/components/admin/ui";

export default async function PagesListPage() {
  await connectMongo();
  const pagesCol = await collections.pages();
  const pagesRaw = await pagesCol.find({}).sort({ slug: 1 }).toArray();
  const pages = pagesRaw.map((page) => serialize(page as Record<string, unknown>));

  return (
    <div>
      <PageHeader title="Pages" description="Edit CMS page content and sections." />
      <AdminCard>
        <Table>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Slug</Th>
              <Th>Published</Th>
              <Th>Updated</Th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-white/[0.02]">
                <Td>
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="font-medium text-white hover:text-[#6ef0a4]"
                  >
                    {String(page.title)}
                  </Link>
                </Td>
                <Td className="text-white/55">/{String(page.slug)}</Td>
                <Td>{page.isPublished ? "Yes" : "No"}</Td>
                <Td className="text-white/45">
                  {format(new Date(String(page.updatedAt)), "MMM d, yyyy")}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </AdminCard>
    </div>
  );
}
