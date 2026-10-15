"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ApiError, api } from "@/lib/api";
import { monthName } from "@/lib/format";
import { href, useI18n } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import type { Product, ProductInput } from "@/lib/types";
import { Button } from "../ui/Button";
import { Checkbox, Input, Select, Textarea } from "../ui/Field";
import { ConfirmDialog } from "../ui/misc";

type FormValues = Omit<ProductInput, "price" | "compare_at_price" | "category" | "stem_length_cm" | "head_size_cm"> & {
    price: string;
    compare_at_price: string;
    category: string;
    stem_length_cm: string;
    head_size_cm: string;
};

const EMPTY: FormValues = {
    title: "", title_fa: "", slug: "", description: "", description_fa: "", category: "", image: "/tulipSvg.svg",
    price: "", compare_at_price: "", stock: 0, is_active: true, is_featured: false, color: "", color_fa: "",
    stems_per_bunch: 10, vase_life_days: 7, stem_length_cm: "", head_size_cm: "", season_months: [],
};

const toForm = (product: Product): FormValues => ({
    ...EMPTY,
    ...product,
    category: product.category ?? "",
    compare_at_price: product.compare_at_price ?? "",
    stem_length_cm: product.stem_length_cm?.toString() ?? "",
    head_size_cm: product.head_size_cm?.toString() ?? "",
});

const slugify = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const ProductForm = ({ product }: { product?: Product }) => {
    const { lang, t } = useI18n();
    const f = t.admin.productForm;
    const router = useRouter();
    const toast = useToast();
    const queryClient = useQueryClient();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const categories = useQuery({ queryKey: ["categories"], queryFn: api.categories.list });

    const { register, handleSubmit, control, setValue, getValues, watch, setError, formState: { errors, isSubmitting, dirtyFields } } =
        useForm<FormValues>({ defaultValues: product ? toForm(product) : EMPTY });

    const onSubmit = handleSubmit(async (values) => {
        const payload: Partial<ProductInput> = {
            ...values,
            category: values.category || null,
            compare_at_price: values.compare_at_price || null,
            stem_length_cm: values.stem_length_cm ? Number(values.stem_length_cm) : null,
            head_size_cm: values.head_size_cm ? Number(values.head_size_cm) : null,
            stock: Number(values.stock),
            stems_per_bunch: Number(values.stems_per_bunch),
            vase_life_days: Number(values.vase_life_days),
        };
        try {
            const saved = product ? await api.products.update(product.slug, payload) : await api.products.create(payload);
            queryClient.invalidateQueries({ queryKey: ["admin"] });
            toast.success(product ? t.common.saved : t.common.created);
            router.push(href(lang, `/admin/products/${saved.slug}`));
            router.refresh();
        } catch (error) {
            if (error instanceof ApiError) {
                Object.entries(error.fields).forEach(([field, message]) => setError(field as keyof FormValues, { message }));
                toast.error(error.message);
            } else toast.error(t.common.error);
        }
    });

    const remove = useMutation({
        mutationFn: () => api.products.remove(product!.slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin"] });
            toast.success(t.common.deleted);
            router.push(href(lang, "/admin/products"));
        },
        onError: (error) => toast.error(error instanceof ApiError ? error.message : t.common.error),
    });

    const required = { required: t.common.required };
    const image = watch("image");

    return (
        <form onSubmit={onSubmit} noValidate className="grid gap-6 xl:grid-cols-[1fr_300px]">
            <div className="flex flex-col gap-6">
                <section className="card grid gap-4 p-6 sm:grid-cols-2">
                    <Input label={f.title} error={errors.title?.message}
                        {...register("title", { ...required, onChange: (event) => { if (!product && !dirtyFields.slug) setValue("slug", slugify(event.target.value)); } })} />
                    <Input label={f.titleFa} dir="rtl" error={errors.title_fa?.message} {...register("title_fa")} />
                    <Input label={f.slug} hint={f.slugHint} dir="ltr" error={errors.slug?.message} containerClassName="sm:col-span-2"
                        {...register("slug", { ...required, pattern: { value: /^[a-z0-9-]+$/, message: f.slugHint } })} />
                    <Textarea label={f.description} rows={4} error={errors.description?.message} {...register("description")} />
                    <Textarea label={f.descriptionFa} rows={4} dir="rtl" error={errors.description_fa?.message} {...register("description_fa")} />
                </section>

                <section className="card grid gap-4 p-6 sm:grid-cols-3">
                    <Input label={f.price} type="number" step="0.01" min="0.01" dir="ltr" error={errors.price?.message} {...register("price", required)} />
                    <Input label={f.compareAt} type="number" step="0.01" min="0" dir="ltr" hint={f.compareAtHint}
                        error={errors.compare_at_price?.message} {...register("compare_at_price")} />
                    <Input label={f.stock} type="number" min="0" dir="ltr" error={errors.stock?.message} {...register("stock", required)} />
                </section>

                <section className="card grid gap-4 p-6 sm:grid-cols-2">
                    <Input label={f.color} error={errors.color?.message} {...register("color")} />
                    <Input label={f.colorFa} dir="rtl" error={errors.color_fa?.message} {...register("color_fa")} />
                    <Input label={f.stems} type="number" min="1" dir="ltr" error={errors.stems_per_bunch?.message} {...register("stems_per_bunch")} />
                    <Input label={f.vaseLife} type="number" min="1" dir="ltr" error={errors.vase_life_days?.message} {...register("vase_life_days")} />
                    <Input label={f.stemLength} type="number" min="1" dir="ltr" error={errors.stem_length_cm?.message} {...register("stem_length_cm")} />
                    <Input label={f.headSize} type="number" min="1" dir="ltr" error={errors.head_size_cm?.message} {...register("head_size_cm")} />
                    <div className="sm:col-span-2">
                        <p className="mb-2 text-sm font-medium">{f.season}</p>
                        <Controller control={control} name="season_months" render={({ field }) => (
                            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                                    const on = field.value.includes(month);
                                    return (
                                        <button key={month} type="button" aria-pressed={on}
                                            onClick={() => field.onChange(on ? field.value.filter((m) => m !== month) : [...field.value, month].sort((a, b) => a - b))}
                                            className={`cursor-pointer rounded-md py-1.5 text-xs transition ${on ? "bg-burgundy text-white" : "bg-blush text-burgundy/60 hover:bg-blush-200"}`}>
                                            {monthName(month, lang)}
                                        </button>
                                    );
                                })}
                            </div>
                        )} />
                    </div>
                </section>
            </div>

            <div className="flex flex-col gap-6">
                <section className="card flex flex-col gap-4 p-6">
                    <div className="flex aspect-square items-center justify-center rounded-2xl bg-blush">
                        {image && <img src={image} alt="" className="size-4/5 object-contain" />}
                    </div>
                    <Input label={f.image} dir="ltr" error={errors.image?.message} {...register("image", required)} />
                    <Select label={f.category} error={errors.category?.message} {...register("category")}>
                        <option value="">{f.noCategory}</option>
                        {categories.data?.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
                    </Select>
                    <Checkbox label={f.active} {...register("is_active")} />
                    <Checkbox label={f.featured} {...register("is_featured")} />
                </section>

                <div className="flex flex-col gap-2">
                    <Button type="submit" size="lg" loading={isSubmitting}>{t.common.save}</Button>
                    {product && (
                        <>
                            <a href={href(lang, `/shop/${getValues("slug")}`)} target="_blank" rel="noreferrer"
                                className="text-center text-sm text-muted hover:text-magenta">↗ {t.nav.shop}</a>
                            <Button variant="ghost" className="!text-red-600" onClick={() => setConfirmDelete(true)}>{t.common.delete}</Button>
                        </>
                    )}
                </div>
            </div>

            <ConfirmDialog open={confirmDelete} title={f.deleteTitle} text={f.deleteText} confirmLabel={t.common.delete}
                loading={remove.isPending} onConfirm={() => remove.mutate()} onClose={() => setConfirmDelete(false)} />
        </form>
    );
};
