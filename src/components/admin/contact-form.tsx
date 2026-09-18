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
  notifyEmails: string[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ initial }: { initial: Contact }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [draftEmail, setDraftEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function addNotifyEmail() {
    const email = draftEmail.trim().toLowerCase();
    setError(null);
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid notification email.");
      return;
    }
    if (form.notifyEmails.includes(email)) {
      setError("That email is already on the list.");
      return;
    }
    if (form.notifyEmails.length >= 3) {
      setError("You can add up to 3 notification emails.");
      return;
    }
    setForm((s) => ({ ...s, notifyEmails: [...s.notifyEmails, email] }));
    setDraftEmail("");
  }

  function removeNotifyEmail(email: string) {
    setForm((s) => ({
      ...s,
      notifyEmails: s.notifyEmails.filter((item) => item !== email),
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const draft = draftEmail.trim().toLowerCase();
    let notifyEmails = form.notifyEmails;
    if (EMAIL_RE.test(draft) && !notifyEmails.includes(draft) && notifyEmails.length < 3) {
      notifyEmails = [...notifyEmails, draft];
      setForm((s) => ({ ...s, notifyEmails }));
      setDraftEmail("");
    }

    const res = await fetch("/api/admin/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, notifyEmails }),
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

        <AdminCard>
          <div className="mb-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
              Lead alerts
            </p>
            <p className="mt-1 text-sm text-white/50">
              Up to 3 internal emails. Each receives a “new lead” note when someone
              submits the contact form or Veloria Score. Leave empty to skip those
              alerts. Visitors still get their own confirmation when they leave an
              email. These addresses are not shown on the public site.
            </p>
          </div>

          {form.notifyEmails.length ? (
            <ul className="mb-4 space-y-2">
              {form.notifyEmails.map((email) => (
                <li
                  key={email}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#0f1412] px-3 py-2"
                >
                  <span className="truncate text-sm text-[#e8ebe9]">{email}</span>
                  <Button
                    type="button"
                    variant="danger"
                    className="shrink-0 px-2.5 py-1 text-xs"
                    onClick={() => removeNotifyEmail(email)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-4 text-sm text-white/40">
              No notification emails yet. New leads will not send an internal alert.
            </p>
          )}

          {form.notifyEmails.length < 3 ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                value={draftEmail}
                placeholder="team@veloria.co.in"
                onChange={(e) => setDraftEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNotifyEmail();
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                className="shrink-0"
                onClick={addNotifyEmail}
              >
                Add email
              </Button>
            </div>
          ) : null}
        </AdminCard>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save contact"}
        </Button>
      </form>
    </div>
  );
}
