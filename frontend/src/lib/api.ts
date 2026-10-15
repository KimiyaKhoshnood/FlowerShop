"use client";
/**
 * Browser-side API client. Attaches the JWT, refreshes it once when it has
 * expired and turns DRF error bodies into readable messages.
 */
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "./auth";
import { API_URL } from "./config";
import type {
    CartItem, Category, CheckoutInput, Discount, Order, OrderStatus, Paginated, Product, ProductInput,
    ProductQuery, Profile, Quote, Review, Stats,
} from "./types";

export class ApiError extends Error {
    constructor(message: string, public status: number, public fields: Record<string, string> = {}) {
        super(message);
    }
}

/** Flatten a DRF error body ({field: ["msg"]}, {detail: "msg"}, ["msg"]) into a message + per-field map. */
const parseError = (data: unknown, fallback: string) => {
    const fields: Record<string, string> = {};
    const messages: string[] = [];
    const visit = (value: unknown, key?: string) => {
        if (typeof value === "string") {
            messages.push(value);
            if (key && !fields[key]) fields[key] = value;
        } else if (Array.isArray(value)) {
            value.forEach((v) => visit(v, key));
        } else if (value && typeof value === "object") {
            Object.entries(value).forEach(([k, v]) => visit(v, k === "detail" || k === "non_field_errors" ? key : k));
        }
    };
    visit(data);
    return { message: messages[0] ?? fallback, fields };
};

const http = axios.create({ baseURL: API_URL, timeout: 15000 });

http.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let refreshing: Promise<string | null> | null = null;

const refreshAccessToken = () => {
    refreshing ??= (async () => {
        const refresh = getRefreshToken();
        if (!refresh) return null;
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/token/refresh/`, { refresh });
            saveTokens({ access: data.access, refresh: data.refresh });
            return data.access as string;
        } catch {
            clearTokens();
            return null;
        } finally {
            setTimeout(() => (refreshing = null), 0);
        }
    })();
    return refreshing;
};

http.interceptors.response.use(undefined, async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retried?: boolean };
    if (error.response?.status === 401 && original && !original._retried && getRefreshToken()) {
        original._retried = true;
        const access = await refreshAccessToken();
        if (access) {
            original.headers = { ...original.headers, Authorization: `Bearer ${access}` };
            return http(original);
        }
    }
    if (!error.response) {
        throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
    }
    const { message, fields } = parseError(error.response.data, "Something went wrong.");
    throw new ApiError(message, error.response.status, fields);
});

const get = async <T>(url: string, params?: object) => (await http.get<T>(url, { params })).data;
const post = async <T>(url: string, body?: unknown) => (await http.post<T>(url, body)).data;
const patch = async <T>(url: string, body: unknown) => (await http.patch<T>(url, body)).data;
const del = async (url: string) => { await http.delete(url); };

/** Drop empty values so they don't end up in the query string. */
const clean = (query: object) => Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined && v !== ""));

export const api = {
    auth: {
        login: (username: string, password: string) =>
            post<{ access: string; refresh: string }>("/api/auth/token/", { username, password }),
        register: (data: { username: string; email: string; password: string; password2: string; first_name: string; last_name: string }) =>
            post<Profile>("/api/auth/register/", data),
        me: () => get<Profile>("/api/auth/me/"),
        updateMe: (data: Partial<Profile>) => patch<Profile>("/api/auth/me/", data),
        changePassword: (current_password: string, new_password: string) =>
            post<void>("/api/auth/password/", { current_password, new_password }),
    },
    products: {
        list: (query: ProductQuery = {}) => get<Paginated<Product>>("/api/products/", clean(query)),
        get: (slug: string) => get<Product>(`/api/products/${slug}/`),
        create: (data: Partial<ProductInput>) => post<Product>("/api/products/", data),
        update: (slug: string, data: Partial<ProductInput>) => patch<Product>(`/api/products/${slug}/`, data),
        remove: (slug: string) => del(`/api/products/${slug}/`),
        reviews: (slug: string) => get<Review[]>(`/api/products/${slug}/reviews/`),
        review: (slug: string, data: { rating: number; comment: string }) =>
            post<Review>(`/api/products/${slug}/reviews/`, data),
    },
    categories: {
        list: () => get<Category[]>("/api/categories/"),
        create: (data: Partial<Category>) => post<Category>("/api/categories/", data),
        update: (slug: string, data: Partial<Category>) => patch<Category>(`/api/categories/${slug}/`, data),
        remove: (slug: string) => del(`/api/categories/${slug}/`),
    },
    discounts: {
        validate: (code: string, subtotal: string) =>
            post<{ code: string; percent: number }>("/api/discounts/validate/", { code, subtotal }),
        list: () => get<Discount[]>("/api/discounts/"),
        create: (data: Partial<Discount>) => post<Discount>("/api/discounts/", data),
        update: (id: number, data: Partial<Discount>) => patch<Discount>(`/api/discounts/${id}/`, data),
        remove: (id: number) => del(`/api/discounts/${id}/`),
    },
    orders: {
        quote: (items: CartItem[], discount_code?: string) =>
            post<Quote>("/api/orders/quote/", { items, discount_code: discount_code || "" }),
        list: (page = 1) => get<Paginated<Order>>("/api/orders/", { page }),
        get: (id: string) => get<Order>(`/api/orders/${id}/`),
        create: (data: CheckoutInput) => post<Order>("/api/orders/", data),
        cancel: (id: string) => post<Order>(`/api/orders/${id}/cancel/`),
    },
    admin: {
        stats: () => get<Stats>("/api/admin/stats/"),
        orders: (query: { page?: number; status?: string; q?: string }) =>
            get<Paginated<Order>>("/api/admin/orders/", clean(query)),
        order: (id: string) => get<Order>(`/api/admin/orders/${id}/`),
        setOrderStatus: (id: string, status: OrderStatus) => patch<Order>(`/api/admin/orders/${id}/`, { status }),
    },
};
