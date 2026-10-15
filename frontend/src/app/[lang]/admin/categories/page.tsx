"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AdminHeader } from "@/components/admin/AdminNav";
import { FormDialog } from "@/components/admin/FormDialog";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { ConfirmDialog, ErrorState } from "@/components/ui/misc";
import { Skeleton } from "@/components/ui/Spinner";
import { ApiError, api } from "@/lib/api";
import { href, useI18n } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import type { Category } from "@/lib/types";

type FormValues = Pick<Category, "name" | "name_fa" | "slug" | "description" | "description_fa">;
const EMPTY: FormValues = { name: "", name_fa: "", slug: "", description: "", description_fa: "" };

export default function AdminCategoriesPage() {
  const { lang, t } = useI18n();
  const f = t.admin.categoryForm;
  const toast = useToast();
  const queryClient = useQueryClient();
  const categories = useQuery({ queryKey: ["categories"], queryFn: api.categories.list });
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const form = useForm<FormValues>({ defaultValues: EMPTY });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["categories"] });

  const open = (category: Category | "new") => {
    form.reset(category === "new" ? EMPTY : category);
    setEditing(category);
  };

  const save = form.handleSubmit(async (values) => {
    try {
      if (editing === "new") await api.categories.create(values);
      else if (editing) await api.categories.update(editing.slug, values);
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
    mutationFn: (slug: string) => api.categories.remove(slug),
    onSuccess: () => { toast.success(t.common.deleted); setDeleting(null); refresh(); },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : t.common.error),
  });

  const required = { required: t.common.required };

  return (
    <div>
      <AdminHeader title={t.admin.categories} action={<Button onClick={() => open("new")}>+ {f.new}</Button>} />

      {categories.isError ? <ErrorState onRetry={() => categories.refetch()} /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-line bg-blush/40 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 text-start font-medium">{f.name}</th>
                <th className="px-4 py-3 text-start font-medium">{f.slug}</th>
                <th className="px-4 py-3 text-start font-medium">{f.products}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {categories.isPending && [1, 2, 3].map((i) => <tr key={i}><td colSpan={4} className="px-4 py-3"><Skeleton className="h-6" /></td></tr>)}
              {categories.data?.map((category) => (
                <tr key={category.id} className="hover:bg-blush/30">
                  <td className="px-4 py-3">
                    <span className="font-medium">{category.name}</span>
                    {category.name_fa && <span className="ms-2 text-muted">{category.name_fa}</span>}
                  </td>
                  <td className="px-4 py-3 text-muted" dir="ltr">{category.slug}</td>
                  <td className="px-4 py-3">
                    <Link href={`${href(lang, "/shop")}?category=${category.slug}`} className="hover:text-magenta">
                      {(category.product_count ?? 0).toLocaleString(lang)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Button size="sm" variant="ghost" onClick={() => open(category)}>{t.common.edit}</Button>
                    <Button size="sm" variant="ghost" className="!text-red-600" onClick={() => setDeleting(category)}>{t.common.delete}</Button>
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
          <Input label={f.name} error={form.formState.errors.name?.message} {...form.register("name", required)} />
          <Input label={f.nameFa} dir="rtl" {...form.register("name_fa")} />
          <Input label={f.slug} dir="ltr" containerClassName="sm:col-span-2" error={form.formState.errors.slug?.message}
            {...form.register("slug", { ...required, pattern: { value: /^[a-z0-9-]+$/, message: t.admin.productForm.slugHint } })} />
          <Textarea label={f.description} {...form.register("description")} />
          <Textarea label={f.descriptionFa} dir="rtl" {...form.register("description_fa")} />
        </div>
      </FormDialog>

      <ConfirmDialog open={deleting !== null} title={f.deleteTitle} text={f.deleteText} confirmLabel={t.common.delete}
        loading={remove.isPending} onConfirm={() => deleting && remove.mutate(deleting.slug)} onClose={() => setDeleting(null)} />
    </div>
  );
}
