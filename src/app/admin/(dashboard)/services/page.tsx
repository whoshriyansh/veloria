import Link from "next/link";
import { Plus } from "lucide-react";
import { connectMongo } from "@/lib/mongodb";
import { collections, serialize } from "@/lib/models";
import { AdminCard, PageHeader, Table, Th, Td } from "@/components/admin/ui";

export default async function ServicesPage() {
  await connectMongo();
  const servicesCol = await collections.services();
  const servicesRaw = await servicesCol.find({}).sort({ order: 1 }).toArray();
  const services = servicesRaw.map((s) => serialize(s as Record<string, unknown>));

  return (
    <div>
      <PageHeader
        title="Services"
        description="Service offerings shown on the site."
        actions={
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#2bb673] px-3.5 py-2 text-sm font-medium text-[#061410] transition hover:bg-[#6ef0a4]"
          >
            <Plus className="size-3.5" />
            New service
          </Link>
        }
      />
      <AdminCard>
        {services.length === 0 ? (
          <p className="text-sm text-white/45">No services yet.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Slug</Th>
                <Th>Order</Th>
                <Th>Visible</Th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-white/[0.02]">
                  <Td>
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="font-medium text-white hover:text-[#6ef0a4]"
                    >
                      {String(service.title)}
                    </Link>
                    <div className="text-xs text-white/40">{String(service.summary)}</div>
                  </Td>
                  <Td className="text-white/55">{String(service.slug)}</Td>
                  <Td>{Number(service.order)}</Td>
                  <Td>{service.isVisible ? "Yes" : "No"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </AdminCard>
    </div>
  );
}
