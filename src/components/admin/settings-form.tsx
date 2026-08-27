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
  PageHeader,
  Textarea,
} from "@/components/admin/ui";

type Settings = {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  aboutPreview: string;
  footerText: string;
  logoText: string;
  metaTitle: string;
  metaDescription: string;
  showCheckupPopup: boolean;
  popupDelayMs: number;
  popupTitle: string;
  popupBody: string;
  popupCta: string;
};

export function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Failed to save settings.");
      return;
    }
    setMessage("Settings saved.");
    router.refresh();
  }

  return (
    <div>
      <PageHeader title="Site settings" description="Global copy, SEO, and checkup popup." />
      <form onSubmit={onSubmit} className="space-y-4">
        {message ? <Flash>{message}</Flash> : null}
        {error ? <Flash tone="error">{error}</Flash> : null}

        <AdminCard className="grid gap-4 md:grid-cols-2">
          <h2 className="text-sm font-medium text-white md:col-span-2">Brand & hero</h2>
          <Field label="Site name">
            <Input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} />
          </Field>
          <Field label="Logo text">
            <Input value={form.logoText} onChange={(e) => set("logoText", e.target.value)} />
          </Field>
          <Field label="Tagline">
            <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Hero headline">
            <Input
              value={form.heroHeadline}
              onChange={(e) => set("heroHeadline", e.target.value)}
            />
          </Field>
          <Field label="Hero subheadline" className="md:col-span-2">
            <Textarea
              rows={3}
              value={form.heroSubheadline}
              onChange={(e) => set("heroSubheadline", e.target.value)}
            />
          </Field>
          <Field label="Hero CTA label">
            <Input
              value={form.heroCtaLabel}
              onChange={(e) => set("heroCtaLabel", e.target.value)}
            />
          </Field>
          <Field label="Hero CTA href">
            <Input
              value={form.heroCtaHref}
              onChange={(e) => set("heroCtaHref", e.target.value)}
            />
          </Field>
          <Field label="About preview" className="md:col-span-2">
            <Textarea
              rows={3}
              value={form.aboutPreview}
              onChange={(e) => set("aboutPreview", e.target.value)}
            />
          </Field>
          <Field label="Footer text" className="md:col-span-2">
            <Input
              value={form.footerText}
              onChange={(e) => set("footerText", e.target.value)}
            />
          </Field>
        </AdminCard>

        <AdminCard className="grid gap-4 md:grid-cols-2">
          <h2 className="text-sm font-medium text-white md:col-span-2">SEO</h2>
          <Field label="Meta title">
            <Input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
          </Field>
          <Field label="Meta description" className="md:col-span-2">
            <Textarea
              rows={3}
              value={form.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
            />
          </Field>
        </AdminCard>

        <AdminCard className="grid gap-4 md:grid-cols-2">
          <h2 className="text-sm font-medium text-white md:col-span-2">Checkup popup</h2>
          <Checkbox
            label="Show checkup popup"
            checked={form.showCheckupPopup}
            onChange={(e) => set("showCheckupPopup", e.target.checked)}
          />
          <Field label="Popup delay (ms)">
            <Input
              type="number"
              value={form.popupDelayMs}
              onChange={(e) => set("popupDelayMs", Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="Popup title" className="md:col-span-2">
            <Input
              value={form.popupTitle}
              onChange={(e) => set("popupTitle", e.target.value)}
            />
          </Field>
          <Field label="Popup body" className="md:col-span-2">
            <Textarea
              rows={4}
              value={form.popupBody}
              onChange={(e) => set("popupBody", e.target.value)}
            />
          </Field>
          <Field label="Popup CTA">
            <Input value={form.popupCta} onChange={(e) => set("popupCta", e.target.value)} />
          </Field>
        </AdminCard>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
