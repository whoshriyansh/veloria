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
} from "@/components/admin/ui";

type NavItem = {
  id: string;
  label: string;
  href: string;
  order: number;
  isVisible: boolean;
  isExternal: boolean;
};

export function NavigationManager({ initialItems }: { initialItems: NavItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newItem, setNewItem] = useState({
    label: "",
    href: "",
    order: items.length + 1,
    isVisible: true,
    isExternal: false,
  });

  function updateLocal(id: string, patch: Partial<NavItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function saveItem(item: NavItem) {
    setMessage(null);
    setError(null);
    const res = await fetch(`/api/admin/navigation/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      setError("Failed to save item.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this navigation item?")) return;
    setMessage(null);
    setError(null);
    const res = await fetch(`/api/admin/navigation/${id}`, { method: "DELETE" });
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
    const res = await fetch("/api/admin/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    setCreating(false);
    if (!res.ok) {
      setError("Failed to create.");
      return;
    }
    const created = (await res.json()) as NavItem;
    setItems((prev) => [...prev, created].sort((a, b) => a.order - b.order));
    setNewItem({
      label: "",
      href: "",
      order: items.length + 2,
      isVisible: true,
      isExternal: false,
    });
    setMessage("Created.");
    router.refresh();
  }

  return (
    <div>
      <PageHeader title="Navigation" description="Header links for the marketing site." />
      {message ? <div className="mb-4"><Flash>{message}</Flash></div> : null}
      {error ? <div className="mb-4"><Flash tone="error">{error}</Flash></div> : null}

      <div className="space-y-3">
        {items.map((item) => (
          <AdminCard key={item.id} className="!p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_80px_auto]">
              <Field label="Label">
                <Input
                  value={item.label}
                  onChange={(e) => updateLocal(item.id, { label: e.target.value })}
                />
              </Field>
              <Field label="Href">
                <Input
                  value={item.href}
                  onChange={(e) => updateLocal(item.id, { href: e.target.value })}
                />
              </Field>
              <Field label="Order">
                <Input
                  type="number"
                  value={item.order}
                  onChange={(e) =>
                    updateLocal(item.id, { order: Number(e.target.value) || 0 })
                  }
                />
              </Field>
              <div className="flex items-end gap-2">
                <Button type="button" variant="secondary" onClick={() => saveItem(item)}>
                  <Save className="size-3.5" />
                  Save
                </Button>
                <Button type="button" variant="danger" onClick={() => deleteItem(item.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-4">
              <Checkbox
                label="Visible"
                checked={item.isVisible}
                onChange={(e) => updateLocal(item.id, { isVisible: e.target.checked })}
              />
              <Checkbox
                label="External"
                checked={item.isExternal}
                onChange={(e) => updateLocal(item.id, { isExternal: e.target.checked })}
              />
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="mt-6">
        <h2 className="mb-4 text-sm font-medium text-white">Add navigation item</h2>
        <form onSubmit={createItem} className="grid gap-3 md:grid-cols-[1fr_1fr_80px_auto]">
          <Field label="Label">
            <Input
              required
              value={newItem.label}
              onChange={(e) => setNewItem((s) => ({ ...s, label: e.target.value }))}
            />
          </Field>
          <Field label="Href">
            <Input
              required
              value={newItem.href}
              onChange={(e) => setNewItem((s) => ({ ...s, href: e.target.value }))}
            />
          </Field>
          <Field label="Order">
            <Input
              type="number"
              value={newItem.order}
              onChange={(e) =>
                setNewItem((s) => ({ ...s, order: Number(e.target.value) || 0 }))
              }
            />
          </Field>
          <div className="flex items-end">
            <Button type="submit" disabled={creating}>
              <Plus className="size-3.5" />
              {creating ? "Adding…" : "Add"}
            </Button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
