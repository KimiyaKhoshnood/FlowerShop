"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminNav";
import { ProductForm } from "@/components/admin/ProductForm";
import { ErrorState } from "@/components/ui/misc";
import { PageSpinner } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { href, useI18n } from "@/lib/i18n";

export default function EditProductPage() {
  const { lang, t } = useI18n();
  const { slug } = useParams<{ slug: string }>();
  const product = useQuery({ queryKey: ["admin", "product", slug], queryFn: () => api.products.get(slug) });

  return (
    <div>
      <Link href={href(lang, "/admin/products")} className="text-sm text-muted hover:text-magenta"><span className="inline-block rtl:-scale-x-100">←</span> {t.admin.products}</Link>
      <div className="mt-4"><AdminHeader title={product.data?.title ?? t.admin.productForm.edit} /></div>
      {product.isPending ? <PageSpinner />
        : product.isError ? <ErrorState onRetry={() => product.refetch()} />
          : <ProductForm key={product.data.updated_at} product={product.data} />}
    </div>
  );
}
