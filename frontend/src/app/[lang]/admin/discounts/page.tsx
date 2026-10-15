"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AdminHeader } from "@/components/admin/AdminNav";
import { FormDialog } from "@/components/admin/FormDialog";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input } from "@/components/ui/Field";
import { ConfirmDialog, ErrorState } from "@/components/ui/misc";
import { Skeleton } from "@/components/ui/Spinner";
import { ApiError, api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import type { Discount } from "@/lib/types";

type FormValues = { code: string; percent: string; is_active: boolean; valid_until: string; min_order_amount: string; max_uses: string };
const EMPTY: FormValues = { code: "", percent: "10", is_active: true, valid_until: "", min_order_amount: "0", max_uses: "" };

const toForm = (discount: Discount): FormValues => ({
  code: discount.code,
  percent: String(discount.percent),
  is_active: discount.is_active,
  valid_until: discount.valid_until?.slice(0, 10) ?? "",
  min_order_amount: discount.min_order_amount,
  max_uses: discount.max_uses?.toString() ?? "",
});

export default function AdminDiscountsPage() {
  const { lang, t } = useI18n();
  const f = t.admin.discountForm;
  const toast = useToast();
  const queryClient = useQueryClient();
  const discounts = useQuery({ queryKey: ["admin", "discounts"], queryFn: api.discounts.list });
  const [editing, setEditing] = useState<Discount | "new" | null>(null);
  const [deleting, setDeleting] = useState<Discount | null>(null);
  const form = useForm<FormValues>({ defaultValues: EMPTY });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "discounts"] });

  const open = (discount: Discount | "new") => {
    form.reset(discount === "new" ? EMPTY : toForm(discount));
    setEditing(discount);
  };

  const save = form.handleSubmit(async (values) => {
    const payload = {
      code: values.code,
      percent: Number(values.percent),
      is_active: values.is_active,
      // End of the chosen day, in the shop's time zone.
      valid_until: values.valid_until ? `${values.valid_until}T23:59:59` : null,
      min_order_amount: values.min_order_amount || "0",
      max_uses: values.max_uses ? Number(values.max_uses) : null,
    };
    try {
      if (editing === "new") await api.discounts.create(payload);
      else if (editing) await api.discounts.update(editing.id, payload);
      toast.success(t.common.saved);
      setEditing(null);
      refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        Object.entries(error.fields).forEach(([field, message]) => form.setError(field as keyof FormValues, { message }));
      } else toast.error(t.common.error);
    }
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.discounts.remove(id),
    onSuccess: () => { toast.success(t.common.deleted); setDeleting(null); refresh(); },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : t.common.error),
  });

  const { errors } = form.formState;

  return (
    <div>
      <AdminHeader title={t.admin.discounts} action={<Button onClick={() => open("new")}>+ {f.new}</Button>} />

      {discounts.isError ? <ErrorState onRetry={() => discounts.refetch()} /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line bg-blush/40 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 text-start font-medium">{f.code}</th>
                <th className="px-4 py-3 text-start font-medium">{f.percent}</th>
                <th className="px-4 py-3 text-start font-medium">{f.minOrder}</th>
                <th className="px-4 py-3 text-start font-medium">{f.used}</th>
                <th className="px-4 py-3 text-start font-medium">{f.validUntil}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {discounts.isPending && [1, 2, 3].map((i) => <tr key={i}><td colSpan={6} className="px-4 py-3"><Skeleton className="h-6" /></td></tr>)}
              {discounts.data?.map((discount) => (
                <tr key={discount.id} className={`hover:bg-blush/30 ${discount.is_active ? "" : "opacity-50"}`}>
                  <td className="px-4 py-3 font-mono font-semibold" dir="ltr">{discount.code}</td>
                  <td className="px-4 py-3">{discount.percent.toLocaleString(lang)}{lang === "fa" ? "٪" : "%"}</td>
                  <td className="px-4 py-3">{formatPrice(discount.min_order_amount, lang)}</td>
                  <td className="px-4 py-3">
                    {discount.used_count.toLocaleString(lang)} / {discount.max_uses?.toLocaleString(lang) ?? f.unlimited}
                  </td>
                  <td className="px-4 py-3 text-muted">{discount.valid_until ? formatDate(discount.valid_until, lang) : f.never}</td>
                  <td className="px-4 py-3 text-end">
                    <Button size="sm" variant="ghost" onClick={() => open(discount)}>{t.common.edit}</Button>
                    <Button size="sm" variant="ghost" className="!text-red-600" onClick={() => setDeleting(discount)}>{t.common.delete}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FormDialog open={editing !== null} title={editing === "new" ? f.new : t.common.edit} onClose={() => setEditing(null)}
        onSubmit={save} submitting={form.formState.isSubmitting}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={f.code} dir="ltr" className="font-mono uppercase" error={errors.code?.message}
            {...form.register("code", { required: t.common.required })} />
          <Input label={f.percent} type="number" min="1" max="100" dir="ltr" error={errors.percent?.message}
            {...form.register("percent", { required: t.common.required })} />
          <Input label={f.minOrder} type="number" min="0" step="0.01" dir="ltr" error={errors.min_order_amount?.message}
            {...form.register("min_order_amount")} />
          <Input label={f.maxUses} type="number" min="1" dir="ltr" hint={f.unlimited} error={errors.max_uses?.message}
            {...form.register("max_uses")} />
          <Input label={f.validUntil} type="date" hint={f.never} error={errors.valid_until?.message} {...form.register("valid_until")} />
          <Checkbox label={f.active} className="self-end pb-3" {...form.register("is_active")} />
        </div>
      </FormDialog>

      <ConfirmDialog open={deleting !== null} title={f.deleteTitle} text={f.deleteText} confirmLabel={t.common.delete}
        loading={remove.isPending} onConfirm={() => deleting && remove.mutate(deleting.id)} onClose={() => setDeleting(null)} />
    </div>
  );
}
