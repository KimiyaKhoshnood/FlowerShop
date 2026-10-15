"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "./types";

const STORAGE_KEY = "flowershop.cart.v2";
const LEGACY_KEY = "shoppingItems";

type Cart = {
    items: CartItem[];
    /** Total number of bunches in the bag. */
    count: number;
    discountCode: string;
    hydrated: boolean;
    qtyOf: (productId: number) => number;
    add: (productId: number, qty?: number, max?: number) => void;
    setQty: (productId: number, qty: number) => void;
    remove: (productId: number) => void;
    clear: () => void;
    setDiscountCode: (code: string) => void;
};

const CartContext = createContext<Cart | null>(null);

type Stored = { items: CartItem[]; discountCode: string };

const load = (): Stored => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
        // Carry over bags saved by the first version of the shop.
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
            const items = (JSON.parse(legacy) as { id: string; qty: number }[])
                .map((item) => ({ product: Number(item.id), qty: item.qty }))
                .filter((item) => item.product > 0 && item.qty > 0);
            localStorage.removeItem(LEGACY_KEY);
            return { items, discountCode: "" };
        }
    } catch {
        // Unreadable or blocked storage simply means an empty bag.
    }
    return { items: [], discountCode: "" };
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [discountCode, setDiscountCode] = useState("");
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const stored = load();
        setItems(stored.items);
        setDiscountCode(stored.discountCode);
        setHydrated(true);

        // Keep several open tabs in sync.
        const onStorage = (event: StorageEvent) => {
            if (event.key !== STORAGE_KEY) return;
            const next = load();
            setItems(next.items);
            setDiscountCode(next.discountCode);
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, discountCode }));
        } catch { }
    }, [items, discountCode, hydrated]);

    const setQty = useCallback((productId: number, qty: number) => {
        setItems((current) => {
            if (qty <= 0) return current.filter((item) => item.product !== productId);
            if (!current.some((item) => item.product === productId)) return [...current, { product: productId, qty }];
            return current.map((item) => (item.product === productId ? { ...item, qty } : item));
        });
    }, []);

    const add = useCallback((productId: number, qty = 1, max = Infinity) => {
        setItems((current) => {
            const existing = current.find((item) => item.product === productId);
            const nextQty = Math.min((existing?.qty ?? 0) + qty, max);
            if (nextQty <= 0) return current;
            return existing
                ? current.map((item) => (item.product === productId ? { ...item, qty: nextQty } : item))
                : [...current, { product: productId, qty: nextQty }];
        });
    }, []);

    const value = useMemo<Cart>(() => ({
        items,
        count: items.reduce((total, item) => total + item.qty, 0),
        discountCode,
        hydrated,
        qtyOf: (productId) => items.find((item) => item.product === productId)?.qty ?? 0,
        add,
        setQty,
        remove: (productId) => setQty(productId, 0),
        clear: () => {
            setItems([]);
            setDiscountCode("");
        },
        setDiscountCode,
    }), [items, discountCode, hydrated, add, setQty]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside <CartProvider>");
    return context;
};
