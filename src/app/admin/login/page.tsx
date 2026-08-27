import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_rgba(110,240,164,0.08),_transparent_55%),#0f1412] px-4">
      <Suspense fallback={<div className="text-sm text-white/50">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
