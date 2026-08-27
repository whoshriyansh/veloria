"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminCard,
  Button,
  Checkbox,
  Field,
  Flash,
  Input,
  Textarea,
} from "@/components/admin/ui";
import { parseJsonArray } from "@/lib/utils";

type ServiceData = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl: string;
  icon: string;
  order: number;
  features: string;
  isVisible: boolean;
};

export function ServiceEditor({
  service,
  mode,
}: {
  service: ServiceData;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...service,
    featuresText: parseJsonArray(service.features).join("\n"),
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const features = JSON.stringify(
      form.featuresText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    );

    const payload = {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      description: form.description,
      imageUrl: form.imageUrl,
      icon: form.icon,
      order: form.order,
      features,
      isVisible: form.isVisible,
    };

    const res = await fetch(
      mode === "create" ? "/api/admin/services" : `/api/admin/services/${service.id}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    setSaving(false);
    if (!res.ok) {
      setError("Failed to save service.");
      return;
    }

    const saved = (await res.json()) as { id: string };
    setMessage("Service saved.");
    if (mode === "create") {
      router.push(`/admin/services/${saved.id}`);
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {message ? <Flash>{message}</Flash> : null}
      {error ? <Flash tone="error">{error}</Flash> : null}

      <AdminCard className="grid gap-4 md:grid-cols-2">
        <Field label="Title" htmlFor="title">
          <Input
            id="title"
            required
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          />
        </Field>
        <Field label="Slug" htmlFor="slug">
          <Input
            id="slug"
            required
            value={form.slug}
            onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
          />
        </Field>
        <Field label="Summary" htmlFor="summary" className="md:col-span-2">
          <Input
            id="summary"
            value={form.summary}
            onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
          />
        </Field>
        <Field label="Description" htmlFor="description" className="md:col-span-2">
          <Textarea
            id="description"
            rows={6}
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          />
        </Field>
        <Field label="Image URL" htmlFor="imageUrl">
          <Input
            id="imageUrl"
            value={form.imageUrl}
            onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
          />
        </Field>
        <Field label="Icon" htmlFor="icon">
          <Input
            id="icon"
            value={form.icon}
            onChange={(e) => setForm((s) => ({ ...s, icon: e.target.value }))}
          />
        </Field>
        <Field label="Order" htmlFor="order">
          <Input
            id="order"
            type="number"
            value={form.order}
            onChange={(e) =>
              setForm((s) => ({ ...s, order: Number(e.target.value) || 0 }))
            }
          />
        </Field>
        <Field label="Features (one per line)" htmlFor="features" className="md:col-span-2">
          <Textarea
            id="features"
            rows={6}
            value={form.featuresText}
            onChange={(e) => setForm((s) => ({ ...s, featuresText: e.target.value }))}
          />
        </Field>
        <Checkbox
          label="Visible"
          checked={form.isVisible}
          onChange={(e) => setForm((s) => ({ ...s, isVisible: e.target.checked }))}
        />
      </AdminCard>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : mode === "create" ? "Create service" : "Save service"}
      </Button>
    </form>
  );
}
