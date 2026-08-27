"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save } from "lucide-react";
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

type Question = {
  id: string;
  question: string;
  category: string;
  order: number;
  yesIsGood: boolean;
  helpText: string;
  isActive: boolean;
  weight: number;
};

export function QuestionsManager({ initialQuestions }: { initialQuestions: Question[] }) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({
    question: "",
    category: "General",
    order: questions.length + 1,
    yesIsGood: true,
    helpText: "",
    isActive: true,
    weight: 1,
  });

  function updateLocal(id: string, patch: Partial<Question>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  async function saveQuestion(q: Question) {
    setMessage(null);
    setError(null);
    const res = await fetch(`/api/admin/questions/${q.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q),
    });
    if (!res.ok) {
      setError("Failed to save question.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
  }

  async function deleteQuestion(id: string) {
    if (!confirm("Delete this question?")) return;
    const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete. It may be linked to existing leads.");
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setMessage("Deleted.");
    router.refresh();
  }

  async function createQuestion(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setCreating(false);
    if (!res.ok) {
      setError("Failed to create.");
      return;
    }
    const created = (await res.json()) as Question;
    setQuestions((prev) => [...prev, created].sort((a, b) => a.order - b.order));
    setDraft({
      question: "",
      category: "General",
      order: questions.length + 2,
      yesIsGood: true,
      helpText: "",
      isActive: true,
      weight: 1,
    });
    setMessage("Created.");
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Health questions"
        description="Legal Health Checkup questionnaire."
      />
      {message ? <div className="mb-4"><Flash>{message}</Flash></div> : null}
      {error ? <div className="mb-4"><Flash tone="error">{error}</Flash></div> : null}

      <div className="space-y-3">
        {questions.map((q) => (
          <AdminCard key={q.id} className="!p-4">
            <Field label="Question">
              <Textarea
                rows={2}
                value={q.question}
                onChange={(e) => updateLocal(q.id, { question: e.target.value })}
              />
            </Field>
            <div className="mt-3 grid gap-3 md:grid-cols-4">
              <Field label="Category">
                <Input
                  value={q.category}
                  onChange={(e) => updateLocal(q.id, { category: e.target.value })}
                />
              </Field>
              <Field label="Order">
                <Input
                  type="number"
                  value={q.order}
                  onChange={(e) =>
                    updateLocal(q.id, { order: Number(e.target.value) || 0 })
                  }
                />
              </Field>
              <Field label="Weight">
                <Input
                  type="number"
                  value={q.weight}
                  onChange={(e) =>
                    updateLocal(q.id, { weight: Number(e.target.value) || 1 })
                  }
                />
              </Field>
              <Field label="Help text">
                <Input
                  value={q.helpText}
                  onChange={(e) => updateLocal(q.id, { helpText: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-4">
                <Checkbox
                  label="Yes is good"
                  checked={q.yesIsGood}
                  onChange={(e) => updateLocal(q.id, { yesIsGood: e.target.checked })}
                />
                <Checkbox
                  label="Active"
                  checked={q.isActive}
                  onChange={(e) => updateLocal(q.id, { isActive: e.target.checked })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => saveQuestion(q)}>
                  <Save className="size-3.5" />
                  Save
                </Button>
                <Button type="button" variant="danger" onClick={() => deleteQuestion(q.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="mt-6">
        <h2 className="mb-4 text-sm font-medium text-white">Add question</h2>
        <form onSubmit={createQuestion} className="space-y-3">
          <Field label="Question">
            <Textarea
              required
              rows={2}
              value={draft.question}
              onChange={(e) => setDraft((s) => ({ ...s, question: e.target.value }))}
            />
          </Field>
          <div className="grid gap-3 md:grid-cols-4">
            <Field label="Category">
              <Input
                value={draft.category}
                onChange={(e) => setDraft((s) => ({ ...s, category: e.target.value }))}
              />
            </Field>
            <Field label="Order">
              <Input
                type="number"
                value={draft.order}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, order: Number(e.target.value) || 0 }))
                }
              />
            </Field>
            <Field label="Weight">
              <Input
                type="number"
                value={draft.weight}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, weight: Number(e.target.value) || 1 }))
                }
              />
            </Field>
            <Field label="Help text">
              <Input
                value={draft.helpText}
                onChange={(e) => setDraft((s) => ({ ...s, helpText: e.target.value }))}
              />
            </Field>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-4">
              <Checkbox
                label="Yes is good"
                checked={draft.yesIsGood}
                onChange={(e) => setDraft((s) => ({ ...s, yesIsGood: e.target.checked }))}
              />
              <Checkbox
                label="Active"
                checked={draft.isActive}
                onChange={(e) => setDraft((s) => ({ ...s, isActive: e.target.checked }))}
              />
            </div>
            <Button type="submit" disabled={creating}>
              <Plus className="size-3.5" />
              {creating ? "Adding…" : "Add question"}
            </Button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
