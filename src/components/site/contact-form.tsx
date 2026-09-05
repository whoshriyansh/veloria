"use client";

import { FormEvent, useState } from "react";

export function ContactForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          phone: String(data.get("phone") || ""),
          email: String(data.get("email") || "") || undefined,
          company: String(data.get("company") || "") || undefined,
          message: String(data.get("message") || "") || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send");
      setSent(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-[1.75rem] border border-ink/10 bg-white/50 p-8 md:p-10">
        <p className="eyebrow mb-3">Received</p>
        <h2 className="font-display text-3xl tracking-tight">We’ll be in touch shortly.</h2>
        <p className="mt-3 text-sm text-ink-soft">
          A Veloria representative will review your note and call you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[1.75rem] border border-ink/10 bg-white/50 p-8 md:p-10"
    >
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm">
          <span className="text-ink-soft">Name *</span>
          <input
            name="name"
            required
            className="rounded-2xl border border-ink/12 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-signal-deep/40"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-ink-soft">Phone *</span>
          <input
            name="phone"
            required
            className="rounded-2xl border border-ink/12 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-signal-deep/40"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-ink-soft">Email</span>
          <input
            name="email"
            type="email"
            className="rounded-2xl border border-ink/12 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-signal-deep/40"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-ink-soft">Company</span>
          <input
            name="company"
            className="rounded-2xl border border-ink/12 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-signal-deep/40"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-ink-soft">How can we help?</span>
          <textarea
            name="message"
            rows={4}
            defaultValue={defaultMessage}
            className="rounded-2xl border border-ink/12 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-signal-deep/40"
          />
        </label>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-full bg-forest-900 px-6 py-3 text-sm font-medium text-cream disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
