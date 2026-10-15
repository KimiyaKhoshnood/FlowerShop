import "server-only";
/**
 * Public catalogue reads for Server Components. Results are cached for a
 * minute, so pages stay fast while stock and prices remain fresh.
 */
import { API_URL } from "./config";

// Inside Docker the Next.js server reaches Django by its service name, not via localhost.
const SERVER_API_URL = (process.env.INTERNAL_API_URL || API_URL).replace(/\/$/, "");
import type { Category, Paginated, Product, ProductQuery, Review } from "./types";

const REVALIDATE_SECONDS = 60;

async function request<T>(path: string, init?: { allow404?: boolean }): Promise<T | null> {
    const res = await fetch(`${SERVER_API_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (res.status === 404 && init?.allow404) return null;
    if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
    return res.json();
}

const toQuery = (query: ProductQuery) => {
    const params = new URLSearchParams(
        Object.entries(query).filter(([, v]) => v !== undefined && v !== "") as [string, string][],
    );
    const str = params.toString();
    return str ? `?${str}` : "";
};

export const fetchProducts = async (query: ProductQuery = {}) =>
    (await request<Paginated<Product>>(`/api/products/${toQuery(query)}`))!;

export const fetchProduct = (slug: string) =>
    request<Product>(`/api/products/${encodeURIComponent(slug)}/`, { allow404: true });

export const fetchReviews = async (slug: string) =>
    (await request<Review[]>(`/api/products/${encodeURIComponent(slug)}/reviews/`)) ?? [];

export const fetchCategories = async () => (await request<Category[]>("/api/categories/"))!;
