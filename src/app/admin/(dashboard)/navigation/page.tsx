import { prisma } from "@/lib/prisma";
import { NavigationManager } from "@/components/admin/navigation-manager";

export default async function NavigationPage() {
  const items = await prisma.navigationItem.findMany({ orderBy: { order: "asc" } });
  return <NavigationManager initialItems={items} />;
}
