"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, ErrorState, Pager, StatusBadge } from "@/components/ui/misc";
import { Skeleton } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { href, useI18n } from "@/lib/i18n";

export default function AccountOrdersPage() {
  const { lang, t } = useI18n();
  const [page, setPage] = useState(1);
  const orders = useQuery({ queryKey: ["orders", page], queryFn: () => api.orders.list(page), placeholderData: keepPreviousData });

  if (orders.isPending) return <div className="flex flex-col gap-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>;
  if (orders.isError) return <ErrorState onRetry={() => orders.refetch()} />;
  if (orders.data.count === 0) {
    return <EmptyState title={t.account.noOrders} action={<ButtonLink href={href(lang, "/shop")}>{t.account.shopNow}</ButtonLink>} />;
  }

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {orders.data.results.map((order) => (
          <li key={order.id}>
            <Link href={href(lang, `/account/orders/${order.id}`)}
              className="card flex flex-wrap items-center gap-4 p-4 transition hover:shadow-(--shadow-soft) sm:flex-nowrap">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {order.items.slice(0, 3).map((item) => (
                  <span key={item.id} className="flex size-14 items-center justify-center rounded-xl border-2 border-white bg-blush">
                    <img src={item.product_image} alt="" className="size-4/5 object-contain" />
                  </span>
                ))}
              </div>
              <div className="flex-1">
                <p className="font-semibold" dir="ltr">{order.number}</p>
                <p className="text-sm text-muted">{formatDate(order.created_at, lang)} · {order.items.reduce((n, i) => n + i.qty, 0).toLocaleString(lang)} × 💐</p>
              </div>
              <StatusBadge status={order.status} />
              <span className="w-24 text-end font-semibold text-burgundy">{formatPrice(order.total, lang)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Pager page={page} count={orders.data.count} onChange={setPage} />
    </div>
  );
}
