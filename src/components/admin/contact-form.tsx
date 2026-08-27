"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminCard,
  Button,
  Field,
  Flash,
  Input,
  PageHeader,
} from "@/components/admin/ui";

type Contact = {
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  twitter: string;
  calendly: string;
  hours: string;
};

export function ContactForm({ initial }: { initial: Contact }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const res = await fetch("/api/admin/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Failed to save contact info.");
      return;
    }
    setMessage("Contact info saved.");
    router.refresh();
  }

  return (
    <div>
      <PageHeader title="Contact info" description="Public contact details." />
      <form onSubmit={onSubmit} className="space-y-4">
        {message ? <Flash>{message}</Flash> : null}
        {error ? <Flash tone="error">{error}</Flash> : null}

        <AdminCard className="grid gap-4 md:grid-cols-2">
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            />
          </Field>
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
            />
          </Field>
          <Field label="Address" className="md:col-span-2">
            <Input
              value={form.address}
              onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
            />
          </Field>
          <Field label="Hours">
            <Input
              value={form.hours}
              onChange={(e) => setForm((s) => ({ ...s, hours: e.target.value }))}
            />
          </Field>
          <Field label="LinkedIn">
            <Input
              value={form.linkedin}
              onChange={(e) => setForm((s) => ({ ...s, linkedin: e.target.value }))}
            />
          </Field>
          <Field label="Twitter / X">
            <Input
              value={form.twitter}
              onChange={(e) => setForm((s) => ({ ...s, twitter: e.target.value }))}
            />
          </Field>
          <Field label="Calendly">
            <Input
              value={form.calendly}
              onChange={(e) => setForm((s) => ({ ...s, calendly: e.target.value }))}
            />
          </Field>
        </AdminCard>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save contact"}
        </Button>
      </form>
    </div>
  );
}
