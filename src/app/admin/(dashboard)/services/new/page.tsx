import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { ServiceEditor } from "@/components/admin/service-editor";

export default function NewServicePage() {
  return (
    <div>
      <Link
        href="/admin/services"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="size-3.5" />
        Back to services
      </Link>
      <PageHeader title="New service" />
      <ServiceEditor
        mode="create"
        service={{
          title: "",
          slug: "",
          summary: "",
          description: "",
          imageUrl: "",
          icon: "scale",
          order: 0,
          features: "[]",
          isVisible: true,
        }}
      />
    </div>
  );
}
