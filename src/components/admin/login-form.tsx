"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Field, Flash, Input } from "@/components/admin/ui";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("admin@veloria.legal");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="admin-card w-full max-w-md space-y-4 p-8">
      <div>
        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
          Veloria CMS
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-white">Sign in</h1>
        <p className="mt-1 text-sm text-white/50">Access the admin dashboard.</p>
      </div>

      {error ? <Flash tone="error">{error}</Flash> : null}

      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
