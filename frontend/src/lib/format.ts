import type { Category, Lang, OrderStatus, Product } from "./types";

const locale = (lang: Lang | string) => (lang === "fa" ? "fa-IR" : "en-US");

export const formatPrice = (value: string | number | null | undefined, lang: Lang | string) =>
    new Intl.NumberFormat(locale(lang), { style: "currency", currency: "USD" }).format(Number(value ?? 0));

export const formatNumber = (value: number, lang: Lang | string) => new Intl.NumberFormat(locale(lang)).format(value);

/** Dates like "2026-10-20" are local calendar days, so parse them without a UTC shift. */
const toDate = (value: string) => (/^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value));

export const formatDate = (value: string | null | undefined, lang: Lang | string, withTime = false) =>
    value
        ? toDate(value).toLocaleDateString(locale(lang), {
            year: "numeric", month: "short", day: "numeric",
            ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
        })
        : "—";

export const monthName = (month: number, lang: Lang | string) =>
    new Date(2024, month - 1, 1).toLocaleDateString(locale(lang), { month: "short" });

/** Pick the Persian field when browsing in Persian and it has been filled in. */
export const productTitle = (product: Pick<Product, "title" | "title_fa">, lang: Lang | string) =>
    (lang === "fa" && product.title_fa) || product.title;

export const productDescription = (product: Pick<Product, "description" | "description_fa">, lang: Lang | string) =>
    (lang === "fa" && product.description_fa) || product.description;

export const productCategoryName = (product: Pick<Product, "category_name" | "category_name_fa">, lang: Lang | string) =>
    (lang === "fa" && product.category_name_fa) || product.category_name || "";

export const categoryName = (category: Pick<Category, "name" | "name_fa">, lang: Lang | string) =>
    (lang === "fa" && category.name_fa) || category.name;

export const discountPercent = (product: Pick<Product, "price" | "compare_at_price">) =>
    product.compare_at_price
        ? Math.round((1 - Number(product.price) / Number(product.compare_at_price)) * 100)
        : 0;

export const STATUS_STYLES: Record<OrderStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    paid: "bg-sky-100 text-sky-800",
    shipped: "bg-violet-100 text-violet-800",
    delivered: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-neutral-200 text-neutral-600",
};

export const tomorrow = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return isoDay(date);
};

export const isoDay = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
