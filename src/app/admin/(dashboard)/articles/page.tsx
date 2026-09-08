import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { ArticlesManager } from "@/components/admin/articles-manager";

export default async function ArticlesAdminPage() {
  await connectMongo();
  const col = await collections.articles();
  const items = (await col.find({}).sort({ order: 1 }).toArray()).map(
    (a) =>
      serialize(a as Record<string, unknown>) as unknown as {
        id: string;
        title: string;
        heading: string;
        imageUrl: string;
        link: string;
        order: number;
        isPublished: boolean;
      },
  );

  return <ArticlesManager initialItems={items} />;
}
