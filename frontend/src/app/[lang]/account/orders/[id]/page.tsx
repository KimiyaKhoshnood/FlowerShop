"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OrderDetail } from "@/components/account/OrderDetail";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog, ErrorState } from "@/components/ui/misc";
import { PageSpinner } from "@/components/ui/Spinner";
import { ApiError, api } from "@/lib/api";
import { href, useI18n } from "@/lib/i18n";
import { useToast } from "@/lib/toast";

export default function AccountOrderPage() {
  const { lang, t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const justPlaced = useSearchParams().get("placed") === "1";
  const toast = useToast();
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const order = useQuery({ queryKey: ["orders", "detail", id], queryFn: () => api.orders.get(id) });
  const cancel = useMutation({
    mutationFn: () => api.orders.cancel(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["orders", "detail", id], updated);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setConfirming(false);
      toast.success(t.order.cancelled);
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : t.common.error),
  });

  if (order.isPending) return <PageSpinner />;
  if (order.isError) return <ErrorState message={order.error instanceof ApiError ? order.error.message : undefined} onRetry={() => order.refetch()} />;

  return (
    <div className="flex flex-col gap-6">
      <Link href={href(lang, "/account")} className="text-sm text-muted hover:text-magenta"><span className="inline-block rtl:-scale-x-100">←</span> {t.account.orders}</Link>

      {justPlaced && order.data.status !== "cancelled" && (
        <div className="flex items-center gap-4 rounded-(--radius-card) bg-emerald-50 p-5 text-emerald-900">
          <span className="text-3xl" aria-hidden="true">💐</span>
          <div>
            <p className="font-display text-xl">{t.order.thankYou}</p>
            <p className="text-sm">{t.order.thankYouText}</p>
          </div>
        </div>
      )}

      <OrderDetail order={order.data} actions={order.data.can_cancel && (
        <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>{t.order.cancel}</Button>
      )} />

      <ConfirmDialog open={confirming} title={t.order.cancelTitle} text={t.order.cancelText} confirmLabel={t.order.cancel}
        loading={cancel.isPending} onConfirm={() => cancel.mutate()} onClose={() => setConfirming(false)} />
    </div>
  );
}
