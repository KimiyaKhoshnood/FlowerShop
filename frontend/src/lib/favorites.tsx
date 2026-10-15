"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "flowershop.favorites.v1";

type Favorites = {
    ids: number[];
    hydrated: boolean;
    has: (productId: number) => boolean;
    toggle: (productId: number) => void;
};

const FavoritesContext = createContext<Favorites | null>(null);

/** Saved flowers. Kept in the browser, like the bag, so guests can use them too. */
export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const [ids, setIds] = useState<number[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
            if (Array.isArray(stored)) setIds(stored.filter((id) => Number.isInteger(id)));
        } catch { }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch { }
    }, [ids, hydrated]);

    const toggle = useCallback((productId: number) => {
        setIds((current) => current.includes(productId)
            ? current.filter((id) => id !== productId)
            : [productId, ...current]);
    }, []);

    const value = useMemo<Favorites>(() => ({
        ids, hydrated, toggle, has: (productId) => ids.includes(productId),
    }), [ids, hydrated, toggle]);

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) throw new Error("useFavorites must be used inside <FavoritesProvider>");
    return context;
};
