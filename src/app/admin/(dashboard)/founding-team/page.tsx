import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { FoundingMembersManager } from "@/components/admin/founding-members-manager";

export default async function FoundingTeamAdminPage() {
  await connectMongo();
  const col = await collections.foundingMembers();
  const items = (await col.find({}).sort({ order: 1 }).toArray()).map(
    (m) =>
      serialize(m as Record<string, unknown>) as unknown as {
        id: string;
        name: string;
        role: string;
        imageUrl: string;
        bio: string;
        order: number;
        isVisible: boolean;
      },
  );

  return (
    <FoundingMembersManager
      initialItems={items.map((item) => ({
        ...item,
        role: item.role ?? "Founding Member",
        bio: item.bio ?? "",
        isVisible: item.isVisible !== false,
      }))}
    />
  );
}
