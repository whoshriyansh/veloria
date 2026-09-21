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
import { ImageUploader } from "@/components/admin/image-uploader";

type Member = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  order: number;
  isVisible: boolean;
};

export function FoundingMembersManager({ initialItems }: { initialItems: Member[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    role: "Founding Member",
    imageUrl: "",
    bio: "",
    order: items.length + 1,
    isVisible: true,
  });

  function patchLocal(id: string, next: Partial<Member>) {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...next } : m)));
  }

  async function saveItem(item: Member) {
    setMessage(null);
    setError(null);
    const res = await fetch(`/api/admin/founding-members/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      setError("Failed to save member.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this founding member?")) return;
    const res = await fetch(`/api/admin/founding-members/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete.");
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    setMessage("Deleted.");
    router.refresh();
  }

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/founding-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    setCreating(false);
    if (!res.ok) {
      setError("Failed to add member.");
      return;
    }
    const created = (await res.json()) as Member;
    setItems((prev) => [...prev, created].sort((a, b) => a.order - b.order));
    setNewItem({
      name: "",
      role: "Founding Member",
      imageUrl: "",
      bio: "",
      order: items.length + 2,
      isVisible: true,
    });
    setMessage("Member added.");
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Founding team"
        description="Portraits on the About page. Upload a photo or paste a URL. Shown in order."
      />
      {message ? <Flash>{message}</Flash> : null}
      {error ? <Flash tone="error">{error}</Flash> : null}

      <form onSubmit={createItem} className="mb-6">
        <AdminCard className="grid gap-4 md:grid-cols-2">
          <Field label="Name">
            <Input
              required
              value={newItem.name}
              onChange={(e) => setNewItem((s) => ({ ...s, name: e.target.value }))}
            />
          </Field>
          <Field label="Role">
            <Input
              value={newItem.role}
              onChange={(e) => setNewItem((s) => ({ ...s, role: e.target.value }))}
            />
          </Field>
          <Field label="Order">
            <Input
              type="number"
              value={newItem.order}
              onChange={(e) => setNewItem((s) => ({ ...s, order: Number(e.target.value) || 0 }))}
            />
          </Field>
          <div className="flex items-end">
            <Checkbox
              label="Visible on About"
              checked={newItem.isVisible}
              onChange={(e) => setNewItem((s) => ({ ...s, isVisible: e.target.checked }))}
            />
          </div>
          <div className="md:col-span-2">
            <ImageUploader
              value={newItem.imageUrl}
              onChange={(imageUrl) => setNewItem((s) => ({ ...s, imageUrl }))}
              label="Portrait"
            />
          </div>
          <Field label="Short bio (optional)" className="md:col-span-2">
            <Textarea
              value={newItem.bio}
              onChange={(e) => setNewItem((s) => ({ ...s, bio: e.target.value }))}
            />
          </Field>
          <Button type="submit" disabled={creating}>
            <Plus className="mr-1 inline size-4" />
            {creating ? "Adding…" : "Add member"}
          </Button>
        </AdminCard>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <AdminCard key={item.id} className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <Input value={item.name} onChange={(e) => patchLocal(item.id, { name: e.target.value })} />
            </Field>
            <Field label="Role">
              <Input value={item.role} onChange={(e) => patchLocal(item.id, { role: e.target.value })} />
            </Field>
            <Field label="Order">
              <Input
                type="number"
                value={item.order}
                onChange={(e) => patchLocal(item.id, { order: Number(e.target.value) || 0 })}
              />
            </Field>
            <div className="flex items-end">
              <Checkbox
                label="Visible on About"
                checked={item.isVisible}
                onChange={(e) => patchLocal(item.id, { isVisible: e.target.checked })}
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploader
                value={item.imageUrl}
                onChange={(imageUrl) => patchLocal(item.id, { imageUrl })}
                label="Portrait"
              />
            </div>
            <Field label="Short bio (optional)" className="md:col-span-2">
              <Textarea
                value={item.bio}
                onChange={(e) => patchLocal(item.id, { bio: e.target.value })}
              />
            </Field>
            <div className="flex gap-2">
              <Button type="button" onClick={() => saveItem(item)}>
                <Save className="mr-1 inline size-4" /> Save
              </Button>
              <Button type="button" variant="danger" onClick={() => deleteItem(item.id)}>
                <Trash2 className="mr-1 inline size-4" /> Delete
              </Button>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
