"use client";

import { useState } from "react";

export function ImageUploader({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be 10MB or smaller.");
      return;
    }
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const json = (await res.json()) as { url?: string; error?: string };
    setUploading(false);
    if (!res.ok || !json.url) {
      setError(json.error || "Upload failed.");
      return;
    }
    onChange(json.url);
  }

  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-[0.14em] text-white/45">{label}</p>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-28 w-full rounded-lg object-cover" />
      ) : (
        <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-white/15 text-xs text-white/40">
          No image yet
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => onFile(e.target.files?.[0])}
        className="text-xs text-white/70 file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL"
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
      />
      {uploading ? <p className="text-xs text-white/50">Uploading…</p> : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <p className="text-[11px] text-white/35">JPG, PNG, WebP, GIF or SVG. Max 10MB. Hosted on Cloudinary.</p>
    </div>
  );
}
