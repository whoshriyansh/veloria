import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { ClientsManager } from "@/components/admin/clients-manager";

export default async function ClientsAdminPage() {
  await connectMongo();
  const col = await collections.clients();
  const items = (await col.find({}).sort({ order: 1 }).toArray()).map(
    (c) => serialize(c as Record<string, unknown>) as unknown as {
      id: string;
      name: string;
      logoUrl: string;
      website: string;
      order: number;
      isVisible: boolean;
    },
  );

  return <ClientsManager initialItems={items} />;
}
