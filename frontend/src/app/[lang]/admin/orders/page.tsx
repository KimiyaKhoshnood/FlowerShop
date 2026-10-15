"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminNav";
import { Input, Select } from "@/components/ui/Field";
import { EmptyState, ErrorState, Pager, StatusBadge } from "@/components/ui/misc";
import { Skeleton } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { href, useI18n } from "@/lib/i18n";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const orders = useQuery({
    queryKey: ["admin", "orders", { status, search, page }],
    queryFn: () => api.admin.orders({ status, q: search, page }),
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <AdminHeader title={t.admin.orders} />
      <div className="mb-4 flex flex-wrap gap-3">
        <form className="min-w-56 flex-1" onSubmit={(event) => { event.preventDefault(); setSearch(q); setPage(1); }}>
          <Input type="search" value={q} onChange={(event) => setQ(event.target.value)} placeholder={t.admin.orderList.searchPlaceholder}
            aria-label={t.common.search} />
        </form>
        <Select value={status} aria-label={t.admin.orderList.allStatuses} containerClassName="w-48"
          onChange={(event) => { setPage(1); router.replace(`${href(lang, "/admin/orders")}${event.target.value ? `?status=${event.target.value}` : ""}`); }}>
          <option value="">{t.admin.orderList.allStatuses}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{t.order.status[s]}</option>)}
        </Select>
      </div>

      {orders.isError ? <ErrorState onRetry={() => orders.refetch()} /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line bg-blush/40 text-start text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 text-start font-medium">#</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.orderList.customer}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.orderList.date}</th>
                <th className="px-4 py-3 text-start font-medium">{t.order.deliveryDate}</th>
                <th className="px-4 py-3 text-start font-medium">{t.bag.total}</th>
                <th className="px-4 py-3 text-start font-medium" />
              </tr>
            </thead>
            <tbody className={`divide-y divide-line ${orders.isFetching ? "opacity-60" : ""}`}>
              {orders.isPending && [1, 2, 3, 4].map((i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><Skeleton className="h-6" /></td></tr>
              ))}
              {orders.data?.results.map((order) => (
                <tr key={order.id} className="hover:bg-blush/30">
                  <td className="px-4 py-3 font-medium" dir="ltr">
                    <Link href={href(lang, `/admin/orders/${order.id}`)} className="hover:text-magenta">{order.number}</Link>
                  </td>
                  <td className="px-4 py-3">{order.customer?.name || order.customer?.username}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(order.created_at, lang)}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(order.delivery_date, lang)}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.total, lang)}</td>
                  <td className="px-4 py-3 text-end"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.data?.count === 0 && <EmptyState title={t.admin.orderList.empty} />}
        </div>
      )}
      {orders.data && <Pager page={page} count={orders.data.count} onChange={setPage} />}
    </div>
  );
}
