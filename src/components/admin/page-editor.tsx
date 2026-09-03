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
import { ImageUploader } from "@/components/admin/image-uploader";

type PageData = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  heroImage: string;
  sections: string;
  isPublished: boolean;
};

export function PageEditor({ page }: { page: PageData }) {
  const router = useRouter();
  const [form, setForm] = useState(page);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      JSON.parse(form.sections);
    } catch {
      setSaving(false);
      setError("Sections must be valid JSON.");
      return;
    }

    const res = await fetch(`/api/admin/pages/${page.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Failed to save page.");
      return;
    }
    setMessage("Page saved.");
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
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
          />
        </Field>
        <Field label="Slug" htmlFor="slug">
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
            required
          />
        </Field>
        <Field label="Subtitle" htmlFor="subtitle" className="md:col-span-2">
          <Input
            id="subtitle"
            value={form.subtitle}
            onChange={(e) => setForm((s) => ({ ...s, subtitle: e.target.value }))}
          />
        </Field>
        <Field label="Hero image" className="md:col-span-2">
          <ImageUploader
            value={form.heroImage}
            onChange={(heroImage) => setForm((s) => ({ ...s, heroImage }))}
            label="Page hero image"
          />
        </Field>
        <Field label="Content" htmlFor="content" className="md:col-span-2">
          <Textarea
            id="content"
            rows={10}
            value={form.content}
            onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))}
          />
        </Field>
        <Field label="Sections JSON" htmlFor="sections" className="md:col-span-2">
          <Textarea
            id="sections"
            rows={12}
            className="font-mono text-xs"
            value={form.sections}
            onChange={(e) => setForm((s) => ({ ...s, sections: e.target.value }))}
          />
        </Field>
        <Checkbox
          label="Published"
          checked={form.isPublished}
          onChange={(e) => setForm((s) => ({ ...s, isPublished: e.target.checked }))}
        />
      </AdminCard>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save page"}
      </Button>
    </form>
  );
}
