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
import { ImageUploader } from "@/components/admin/image-uploader";

type Client = {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  order: number;
  isVisible: boolean;
};

export function ClientsManager({ initialItems }: { initialItems: Client[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    logoUrl: "",
    website: "",
    order: items.length + 1,
    isVisible: true,
  });

  async function saveItem(item: Client) {
    setMessage(null);
    setError(null);
    const res = await fetch(`/api/admin/clients/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      setError("Failed to save client.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this client?")) return;
    const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
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
    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    setCreating(false);
    if (!res.ok) {
      setError("Failed to create.");
      return;
    }
    const created = (await res.json()) as Client;
    setItems((prev) => [...prev, created]);
    setNewItem({ name: "", logoUrl: "", website: "", order: items.length + 2, isVisible: true });
    setMessage("Client added.");
    router.refresh();
  }

  return (
    <div>
      <PageHeader title="Clients" description="Logo wall on the homepage. Upload logos under 10MB." />
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
          <Field label="Website">
            <Input
              value={newItem.website}
              onChange={(e) => setNewItem((s) => ({ ...s, website: e.target.value }))}
            />
          </Field>
          <div className="md:col-span-2">
            <ImageUploader
              value={newItem.logoUrl}
              onChange={(logoUrl) => setNewItem((s) => ({ ...s, logoUrl }))}
              label="Logo"
            />
          </div>
          <Button type="submit" disabled={creating}>
            <Plus className="mr-1 inline size-4" />
            {creating ? "Adding…" : "Add client"}
          </Button>
        </AdminCard>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <AdminCard key={item.id} className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <Input
                value={item.name}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((c) => (c.id === item.id ? { ...c, name: e.target.value } : c)),
                  )
                }
              />
            </Field>
            <Field label="Order">
              <Input
                type="number"
                value={item.order}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((c) =>
                      c.id === item.id ? { ...c, order: Number(e.target.value) || 0 } : c,
                    ),
                  )
                }
              />
            </Field>
            <div className="md:col-span-2">
              <ImageUploader
                value={item.logoUrl}
                onChange={(logoUrl) =>
                  setItems((prev) =>
                    prev.map((c) => (c.id === item.id ? { ...c, logoUrl } : c)),
                  )
                }
                label="Logo"
              />
            </div>
            <Checkbox
              label="Visible"
              checked={item.isVisible}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((c) =>
                    c.id === item.id ? { ...c, isVisible: e.target.checked } : c,
                  ),
                )
              }
            />
            <div className="flex gap-2">
              <Button type="button" onClick={() => saveItem(item)}>
                <Save className="mr-1 inline size-4" /> Save
              </Button>
              <Button type="button" onClick={() => deleteItem(item.id)}>
                <Trash2 className="mr-1 inline size-4" /> Delete
              </Button>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
