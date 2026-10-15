"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminNav";
import { ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { EmptyState, ErrorState, Pager } from "@/components/ui/misc";
import { Skeleton } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { href, useI18n } from "@/lib/i18n";

const PAGE_SIZE = 20;

export default function AdminProductsPage() {
  const { lang, t } = useI18n();
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const products = useQuery({
    queryKey: ["admin", "products", { search, page }],
    queryFn: () => api.products.list({ q: search, page: String(page), page_size: String(PAGE_SIZE), all: "1", sort: "title" }),
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <AdminHeader title={t.admin.products}
        action={<ButtonLink href={href(lang, "/admin/products/new")}>+ {t.admin.productForm.new}</ButtonLink>} />
      <form className="mb-4" onSubmit={(event) => { event.preventDefault(); setSearch(q); setPage(1); }}>
        <Input type="search" value={q} onChange={(event) => setQ(event.target.value)}
          placeholder={t.admin.productForm.searchPlaceholder} aria-label={t.common.search} />
      </form>

      {products.isError ? <ErrorState onRetry={() => products.refetch()} /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line bg-blush/40 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 text-start font-medium">{t.admin.productForm.title}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.productForm.category}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.productForm.price}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.productForm.stock}</th>
                <th className="px-4 py-3 text-start font-medium" />
              </tr>
            </thead>
            <tbody className={`divide-y divide-line ${products.isFetching ? "opacity-60" : ""}`}>
              {products.isPending && [1, 2, 3, 4, 5].map((i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><Skeleton className="h-10" /></td></tr>
              ))}
              {products.data?.results.map((product) => (
                <tr key={product.id} className="hover:bg-blush/30">
                  <td className="px-4 py-2.5">
                    <Link href={href(lang, `/admin/products/${product.slug}`)} className="flex items-center gap-3 hover:text-magenta">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blush">
                        <img src={product.image} alt="" className="size-4/5 object-contain" />
                      </span>
                      <span>
                        <span className="block font-medium">{product.title}</span>
                        <span className="block text-xs text-muted">{product.title_fa}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-muted">{product.category_name ?? "—"}</td>
                  <td className="px-4 py-2.5">
                    {formatPrice(product.price, lang)}
                    {product.on_sale && <span className="ms-2 text-xs text-muted line-through">{formatPrice(product.compare_at_price, lang)}</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${product.stock === 0 ? "bg-red-100 text-red-700" : product.stock <= 5 ? "bg-amber-100 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}>
                      {product.stock.toLocaleString(lang)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-end">
                    <span className="inline-flex gap-1.5">
                      {product.is_featured && <span className="rounded-full bg-blush px-2 py-0.5 text-xs text-burgundy">★</span>}
                      {!product.is_active && <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-600">{t.admin.productForm.hidden}</span>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.data?.count === 0 && <EmptyState title={t.admin.productForm.empty} />}
        </div>
      )}
      {products.data && <Pager page={page} count={products.data.count} pageSize={PAGE_SIZE} onChange={setPage} />}
    </div>
  );
}
