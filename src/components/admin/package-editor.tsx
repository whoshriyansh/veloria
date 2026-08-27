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

type PackageData = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  cadence: string;
  highlight: boolean;
  order: number;
  isVisible: boolean;
  ctaLabel: string;
  features: { id: string; text: string; order: number }[];
};

export function PackageEditor({ pkg }: { pkg: PackageData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...pkg,
    featuresText: pkg.features.map((f) => f.text).join("\n"),
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const features = form.featuresText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const res = await fetch(`/api/admin/packages/${pkg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        tagline: form.tagline,
        description: form.description,
        cadence: form.cadence,
        highlight: form.highlight,
        order: form.order,
        isVisible: form.isVisible,
        ctaLabel: form.ctaLabel,
        features,
      }),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Failed to save package.");
      return;
    }
    setMessage("Package saved.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {message ? <Flash>{message}</Flash> : null}
      {error ? <Flash tone="error">{error}</Flash> : null}

      <AdminCard className="grid gap-4 md:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
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
        <Field label="Tagline" htmlFor="tagline" className="md:col-span-2">
          <Input
            id="tagline"
            value={form.tagline}
            onChange={(e) => setForm((s) => ({ ...s, tagline: e.target.value }))}
          />
        </Field>
        <Field label="Description" htmlFor="description" className="md:col-span-2">
          <Textarea
            id="description"
            rows={5}
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          />
        </Field>
        <Field label="Cadence" htmlFor="cadence">
          <Input
            id="cadence"
            value={form.cadence}
            onChange={(e) => setForm((s) => ({ ...s, cadence: e.target.value }))}
          />
        </Field>
        <Field label="CTA label" htmlFor="ctaLabel">
          <Input
            id="ctaLabel"
            value={form.ctaLabel}
            onChange={(e) => setForm((s) => ({ ...s, ctaLabel: e.target.value }))}
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
            rows={8}
            value={form.featuresText}
            onChange={(e) => setForm((s) => ({ ...s, featuresText: e.target.value }))}
          />
        </Field>
        <div className="flex flex-wrap gap-4 md:col-span-2">
          <Checkbox
            label="Highlight"
            checked={form.highlight}
            onChange={(e) => setForm((s) => ({ ...s, highlight: e.target.checked }))}
          />
          <Checkbox
            label="Visible"
            checked={form.isVisible}
            onChange={(e) => setForm((s) => ({ ...s, isVisible: e.target.checked }))}
          />
        </div>
      </AdminCard>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save package"}
      </Button>
    </form>
  );
}
