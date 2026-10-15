"use client";
import { Drawer } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { categoryName } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import { Button } from "../ui/Button";
import { Checkbox, Input, Select } from "../ui/Field";
import { Spinner } from "../ui/Spinner";

const SORTS = ["newest", "popular", "rating", "price", "-price", "title"] as const;

/** Updates the URL; the server component re-renders the results. */
const useQueryUpdater = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [pending, startTransition] = useTransition();

    const update = (changes: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(changes).forEach(([key, value]) => (value ? params.set(key, value) : params.delete(key)));
        params.delete("page");
        startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
    };
    return { update, pending, searchParams };
};

export const SortSelect = () => {
    const { t } = useI18n();
    const { update, pending, searchParams } = useQueryUpdater();
    return (
        <div className="flex items-center gap-2">
            {pending && <Spinner className="size-4 text-magenta" />}
            <Select aria-label={t.shop.sort.label} value={searchParams.get("sort") ?? "newest"} className="!py-2"
                onChange={(event) => update({ sort: event.target.value === "newest" ? null : event.target.value })}>
                {SORTS.map((sort) => <option key={sort} value={sort}>{t.shop.sort[sort]}</option>)}
            </Select>
        </div>
    );
};

const FilterPanel = ({ categories, onApplied }: { categories: Category[]; onApplied?: () => void }) => {
    const { lang, t } = useI18n();
    const { update, searchParams } = useQueryUpdater();
    const active = searchParams.get("category") ?? "";
    const [minPrice, setMinPrice] = useState(searchParams.get("min_price") ?? "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") ?? "");

    useEffect(() => {
        setMinPrice(searchParams.get("min_price") ?? "");
        setMaxPrice(searchParams.get("max_price") ?? "");
    }, [searchParams]);

    const apply = (changes: Record<string, string | null>) => {
        update(changes);
        onApplied?.();
    };

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h3 className="mb-3 text-sm font-semibold text-burgundy">{t.shop.category}</h3>
                <ul className="flex flex-col gap-1">
                    {[{ slug: "", label: t.shop.allCategories, count: undefined as number | undefined },
                    ...categories.filter((c) => (c.product_count ?? 0) > 0 || c.slug === active).map((c) => ({ slug: c.slug, label: categoryName(c, lang), count: c.product_count }))].map((item) => (
                        <li key={item.slug}>
                            <button type="button" onClick={() => apply({ category: item.slug || null })}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition ${active === item.slug ? "bg-blush font-semibold text-burgundy" : "text-ink/80 hover:bg-blush/60"}`}>
                                <span>{item.label}</span>
                                {item.count !== undefined && <span className="text-xs text-muted">{item.count.toLocaleString(lang)}</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={(event) => { event.preventDefault(); apply({ min_price: minPrice || null, max_price: maxPrice || null }); }}>
                <h3 className="mb-3 text-sm font-semibold text-burgundy">{t.shop.price}</h3>
                <div className="flex items-end gap-2">
                    <Input type="number" min={0} step="0.5" inputMode="decimal" placeholder={t.shop.min} aria-label={t.shop.min}
                        value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
                    <span className="pb-3 text-muted">–</span>
                    <Input type="number" min={0} step="0.5" inputMode="decimal" placeholder={t.shop.max} aria-label={t.shop.max}
                        value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
                    <Button type="submit" size="sm" variant="outline" className="!h-[42px] shrink-0" aria-label={t.shop.price}>
                        <span className="inline-block rtl:-scale-x-100">→</span>
                    </Button>
                </div>
            </form>

            <div className="flex flex-col gap-3">
                <Checkbox label={t.shop.inStockOnly} checked={searchParams.get("in_stock") === "1"}
                    onChange={(event) => apply({ in_stock: event.target.checked ? "1" : null })} />
                <Checkbox label={t.shop.onSaleOnly} checked={searchParams.get("on_sale") === "1"}
                    onChange={(event) => apply({ on_sale: event.target.checked ? "1" : null })} />
            </div>

            <Button variant="ghost" size="sm" className="self-start"
                onClick={() => apply({ category: null, min_price: null, max_price: null, in_stock: null, on_sale: null, q: null })}>
                {t.shop.clear}
            </Button>
        </div>
    );
};

export const ShopFilters = ({ categories }: { categories: Category[] }) => {
    const { t, lang } = useI18n();
    const [open, setOpen] = useState(false);
    return (
        <>
            <aside className="hidden lg:block"><FilterPanel categories={categories} /></aside>
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setOpen(true)}>{t.shop.filters}</Button>
            <Drawer anchor={lang === "fa" ? "right" : "left"} open={open} onClose={() => setOpen(false)}>
                <div className="w-80 max-w-[85vw] p-6" dir={lang === "fa" ? "rtl" : "ltr"}>
                    <h2 className="mb-6 font-display text-2xl text-burgundy">{t.shop.filters}</h2>
                    <FilterPanel categories={categories} onApplied={() => setOpen(false)} />
                </div>
            </Drawer>
        </>
    );
};
