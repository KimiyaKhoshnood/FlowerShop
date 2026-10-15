"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminHeader } from "@/components/admin/AdminNav";
import { ErrorState, StatusBadge } from "@/components/ui/misc";
import { Skeleton } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { formatNumber, formatPrice } from "@/lib/format";
import { fill, href, useI18n } from "@/lib/i18n";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOverviewPage() {
  const { lang, t } = useI18n();
  const stats = useQuery({ queryKey: ["admin", "stats"], queryFn: api.admin.stats });

  if (stats.isError) return <ErrorState onRetry={() => stats.refetch()} />;

  const data = stats.data;
  const cards = [
    { label: t.admin.stats.revenue, value: data && formatPrice(data.revenue, lang) },
    { label: t.admin.stats.orders, value: data && formatNumber(data.orders, lang) },
    { label: t.admin.stats.avgOrder, value: data && formatPrice(data.average_order, lang) },
    { label: t.admin.stats.customers, value: data && formatNumber(data.customers, lang) },
  ];
  const chart = data?.sales_by_day.map((day) => ({
    ...day,
    revenue: Number(day.revenue),
    label: new Date(`${day.date}T00:00:00`).toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", { month: "short", day: "numeric" }),
  }));
  const totalOrders = data ? Object.values(data.orders_by_status).reduce((a, b) => a + (b ?? 0), 0) : 0;

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title={t.admin.overview} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-5">
            <p className="text-sm text-muted">{card.label}</p>
            {card.value ? <p className="mt-2 font-display text-3xl text-burgundy">{card.value}</p> : <Skeleton className="mt-3 h-8 w-24" />}
          </div>
        ))}
      </div>

      <section className="card p-5">
        <h2 className="mb-4 font-semibold text-burgundy">{t.admin.stats.salesChart}</h2>
        <div className="h-72" dir="ltr">
          {chart ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ left: 0, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc466a" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#dc466a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ece4e7" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6f6468" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: "#6f6468" }} tickLine={false} axisLine={false} width={48}
                  tickFormatter={(value: number) => `$${value}`} />
                <Tooltip formatter={(value: number) => [formatPrice(value, lang), t.admin.stats.revenue]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #ece4e7" }} />
                <Area type="monotone" dataKey="revenue" stroke="#dc466a" strokeWidth={2} fill="url(#revenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <Skeleton className="size-full" />}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="card p-5">
          <h2 className="mb-4 font-semibold text-burgundy">{t.admin.stats.topProducts}</h2>
          <ol className="flex flex-col gap-3 text-sm">
            {data?.top_products.map((product, i) => (
              <li key={product.title} className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-blush text-xs font-semibold text-burgundy">{(i + 1).toLocaleString(lang)}</span>
                <span className="flex-1">{product.title}</span>
                <span className="text-muted">{fill(t.admin.stats.sold, product.sold.toLocaleString(lang))}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-semibold text-burgundy">{t.admin.stats.ordersByStatus}</h2>
          <ul className="flex flex-col gap-3">
            {STATUSES.map((status) => {
              const count = data?.orders_by_status[status] ?? 0;
              return (
                <li key={status} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <Link href={`${href(lang, "/admin/orders")}?status=${status}`}><StatusBadge status={status} /></Link>
                    <span className="text-muted">{count.toLocaleString(lang)}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-blush">
                    <div className="h-full rounded-full bg-burgundy" style={{ width: `${totalOrders ? (count / totalOrders) * 100 : 0}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-semibold text-burgundy">{t.admin.stats.lowStock}</h2>
          {data && data.low_stock.length === 0 && <p className="text-sm text-muted">{t.admin.stats.allGood}</p>}
          <ul className="flex flex-col gap-2 text-sm">
            {data?.low_stock.map((product) => (
              <li key={product.id}>
                <Link href={href(lang, `/admin/products/${product.slug}`)} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-blush">
                  <span>{product.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${product.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                    {product.stock.toLocaleString(lang)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
