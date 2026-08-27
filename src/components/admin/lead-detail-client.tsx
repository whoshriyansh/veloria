"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button, Field, Flash, Input, Select, Textarea } from "@/components/admin/ui";
import { LEAD_STATUSES } from "@/lib/lead-status";

type Note = {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; name: string; email: string } | null;
};

type Answer = {
  id: string;
  answer: boolean;
  question: {
    id: string;
    question: string;
    category: string;
    yesIsGood: boolean;
    helpText: string;
    order: number;
  };
};

type LeadDetail = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  score: number;
  maxScore: number;
  readiness: string;
  status: string;
  notes: string;
  assignedTo: string | null;
  calledAt: string | null;
  createdAt: string;
  answers: Answer[];
  leadNotes: Note[];
};

export function LeadDetailClient({ lead }: { lead: LeadDetail }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo ?? "");
  const [calledAt, setCalledAt] = useState(
    lead.calledAt ? lead.calledAt.slice(0, 16) : "",
  );
  const [notes, setNotes] = useState(lead.notes);
  const [noteBody, setNoteBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  async function saveLead(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const res = await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        notes,
        assignedTo: assignedTo || null,
        calledAt: calledAt ? new Date(calledAt).toISOString() : null,
      }),
    });

    setSaving(false);
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Failed to save");
      return;
    }

    setMessage("Lead updated.");
    router.refresh();
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    setAddingNote(true);
    setMessage(null);
    setError(null);

    const res = await fetch(`/api/admin/leads/${lead.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: noteBody }),
    });

    setAddingNote(false);
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Failed to add note");
      return;
    }

    setNoteBody("");
    setMessage("Note added.");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6">
        <div className="admin-card p-5">
          <h2 className="mb-4 text-sm font-medium text-white">Checkup answers</h2>
          <div className="space-y-3">
            {lead.answers.map((item) => {
              const correct = item.answer === item.question.yesIsGood;
              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-white/[0.06] bg-[#0f1412] p-3"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-white/40">
                    <span>{item.question.category}</span>
                    <span
                      className={
                        correct ? "text-[#6ef0a4]" : "text-amber-300"
                      }
                    >
                      {item.answer ? "Yes" : "No"}
                      {correct ? " · good" : " · gap"}
                    </span>
                  </div>
                  <div className="text-sm text-white/90">{item.question.question}</div>
                  {item.question.helpText ? (
                    <div className="mt-1 text-xs text-white/40">{item.question.helpText}</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="admin-card p-5">
          <h2 className="mb-4 text-sm font-medium text-white">Activity notes</h2>
          <form onSubmit={addNote} className="mb-4 space-y-3">
            <Textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Add a call note…"
              required
            />
            <Button type="submit" disabled={addingNote || !noteBody.trim()}>
              {addingNote ? "Adding…" : "Add note"}
            </Button>
          </form>
          <div className="space-y-3">
            {lead.leadNotes.length === 0 ? (
              <p className="text-sm text-white/40">No notes yet.</p>
            ) : (
              lead.leadNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg border border-white/[0.06] bg-[#0f1412] p-3"
                >
                  <div className="mb-1 text-xs text-white/40">
                    {note.author?.name ?? "Admin"} ·{" "}
                    {format(new Date(note.createdAt), "MMM d, yyyy HH:mm")}
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-white/85">{note.body}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="admin-card space-y-3 p-5">
          <h2 className="text-sm font-medium text-white">Contact</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-white/40">Phone</dt>
              <dd>{lead.phone}</dd>
            </div>
            <div>
              <dt className="text-white/40">Email</dt>
              <dd>{lead.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-white/40">Company</dt>
              <dd>{lead.company ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-white/40">Score</dt>
              <dd>
                {lead.score}/{lead.maxScore} · {lead.readiness}
              </dd>
            </div>
            <div>
              <dt className="text-white/40">Submitted</dt>
              <dd>{format(new Date(lead.createdAt), "MMM d, yyyy HH:mm")}</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={saveLead} className="admin-card space-y-4 p-5">
          <h2 className="text-sm font-medium text-white">Update lead</h2>
          {message ? <Flash>{message}</Flash> : null}
          {error ? <Flash tone="error">{error}</Flash> : null}

          <Field label="Status" htmlFor="status">
            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Assigned to" htmlFor="assignedTo">
            <Input
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Counsel name"
            />
          </Field>

          <Field label="Called at" htmlFor="calledAt">
            <Input
              id="calledAt"
              type="datetime-local"
              value={calledAt}
              onChange={(e) => setCalledAt(e.target.value)}
            />
          </Field>

          <Field label="Internal notes" htmlFor="notes">
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </Field>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
