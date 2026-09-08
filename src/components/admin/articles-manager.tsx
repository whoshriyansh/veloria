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

type Article = {
  id: string;
  title: string;
  heading: string;
  imageUrl: string;
  link: string;
  order: number;
  isPublished: boolean;
};

export function ArticlesManager({ initialItems }: { initialItems: Article[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    heading: "",
    imageUrl: "",
    link: "",
    order: items.length + 1,
    isPublished: true,
  });

  async function saveItem(item: Article) {
    setMessage(null);
    setError(null);
    const res = await fetch(`/api/admin/articles/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      setError("Failed to save article.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this article?")) return;
    const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
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
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    setCreating(false);
    if (!res.ok) {
      setError("Failed to create.");
      return;
    }
    const created = (await res.json()) as Article;
    setItems((prev) => [...prev, created]);
    setNewItem({
      title: "",
      heading: "",
      imageUrl: "",
      link: "",
      order: items.length + 2,
      isPublished: true,
    });
    setMessage("Article added.");
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Insights"
        description="LinkedIn articles shown on the homepage and /insights. Add a heading, image, title and LinkedIn URL."
      />
      {message ? <Flash>{message}</Flash> : null}
      {error ? <Flash tone="error">{error}</Flash> : null}

      <form onSubmit={createItem} className="mb-6">
        <AdminCard className="grid gap-4 md:grid-cols-2">
          <Field label="Heading / category">
            <Input
              value={newItem.heading}
              placeholder="Readiness"
              onChange={(e) => setNewItem((s) => ({ ...s, heading: e.target.value }))}
            />
          </Field>
          <Field label="LinkedIn URL">
            <Input
              required
              type="url"
              placeholder="https://www.linkedin.com/pulse/..."
              value={newItem.link}
              onChange={(e) => setNewItem((s) => ({ ...s, link: e.target.value }))}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Title">
              <Input
                required
                value={newItem.title}
                onChange={(e) => setNewItem((s) => ({ ...s, title: e.target.value }))}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <ImageUploader
              value={newItem.imageUrl}
              onChange={(imageUrl) => setNewItem((s) => ({ ...s, imageUrl }))}
              label="Cover image"
            />
          </div>
          <Button type="submit" disabled={creating}>
            <Plus className="mr-1 inline size-4" />
            {creating ? "Adding…" : "Add article"}
          </Button>
        </AdminCard>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <AdminCard key={item.id} className="grid gap-4 md:grid-cols-2">
            <Field label="Heading">
              <Input
                value={item.heading}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((c) => (c.id === item.id ? { ...c, heading: e.target.value } : c)),
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
              <Field label="Title">
                <Input
                  value={item.title}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((c) => (c.id === item.id ? { ...c, title: e.target.value } : c)),
                    )
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="LinkedIn URL">
                <Input
                  value={item.link}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((c) => (c.id === item.id ? { ...c, link: e.target.value } : c)),
                    )
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <ImageUploader
                value={item.imageUrl}
                onChange={(imageUrl) =>
                  setItems((prev) =>
                    prev.map((c) => (c.id === item.id ? { ...c, imageUrl } : c)),
                  )
                }
                label="Cover image"
              />
            </div>
            <Checkbox
              label="Published"
              checked={item.isPublished}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((c) =>
                    c.id === item.id ? { ...c, isPublished: e.target.checked } : c,
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
