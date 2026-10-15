import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = { robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <AdminNav />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
