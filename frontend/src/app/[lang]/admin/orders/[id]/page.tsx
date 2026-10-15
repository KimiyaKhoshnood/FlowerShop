"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OrderDetail } from "@/components/account/OrderDetail";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/misc";
import { PageSpinner } from "@/components/ui/Spinner";
import { ApiError, api } from "@/lib/api";
import { href, useI18n } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import type { OrderStatus } from "@/lib/types";

// Mirrors Order.TRANSITIONS on the backend.
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export default function AdminOrderPage() {
  const { lang, t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const order = useQuery({ queryKey: ["admin", "order", id], queryFn: () => api.admin.order(id) });
  const setStatus = useMutation({
    mutationFn: (status: OrderStatus) => api.admin.setOrderStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin", "order", id], updated);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success(`${t.common.saved}: ${t.order.status[updated.status]}`);
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : t.common.error),
  });

  if (order.isPending) return <PageSpinner />;
  if (order.isError) return <ErrorState onRetry={() => order.refetch()} />;

  const next = NEXT_STATUSES[order.data.status];

  return (
    <div className="flex flex-col gap-6">
      <Link href={href(lang, "/admin/orders")} className="text-sm text-muted hover:text-magenta"><span className="inline-block rtl:-scale-x-100">←</span> {t.admin.orders}</Link>
      <OrderDetail order={order.data} actions={next.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{t.admin.orderList.moveTo}</span>
          {next.map((status) => (
            <Button key={status} size="sm" variant={status === "cancelled" ? "outline" : "secondary"}
              loading={setStatus.isPending && setStatus.variables === status} onClick={() => setStatus.mutate(status)}>
              {t.order.status[status]}
            </Button>
          ))}
        </div>
      )} />
    </div>
  );
}
