"use client";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminNav";
import { ProductForm } from "@/components/admin/ProductForm";
import { href, useI18n } from "@/lib/i18n";

export default function NewProductPage() {
  const { lang, t } = useI18n();
  return (
    <div>
      <Link href={href(lang, "/admin/products")} className="text-sm text-muted hover:text-magenta"><span className="inline-block rtl:-scale-x-100">←</span> {t.admin.products}</Link>
      <div className="mt-4"><AdminHeader title={t.admin.productForm.new} /></div>
      <ProductForm />
    </div>
  );
}
