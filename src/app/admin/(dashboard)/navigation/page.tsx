import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { NavigationManager } from "@/components/admin/navigation-manager";

export default async function NavigationPage() {
  await connectMongo();
  const navigationItems = await collections.navigationItems();
  const itemsRaw = await navigationItems.find({}).sort({ order: 1 }).toArray();
  const items = itemsRaw.map((item) => serialize(item as Record<string, unknown>)) as {
    id: string;
    label: string;
    href: string;
    order: number;
    isVisible: boolean;
    isExternal: boolean;
  }[];
  return <NavigationManager initialItems={items} />;
}
