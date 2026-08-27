import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veloria Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell min-h-screen">{children}</div>;
}
