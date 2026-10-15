"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart";

/** Server-calculated prices for whatever is in the bag right now. */
export const useQuote = () => {
    const { items, discountCode, hydrated } = useCart();
    return useQuery({
        queryKey: ["quote", items, discountCode],
        queryFn: () => api.orders.quote(items, discountCode),
        enabled: hydrated && items.length > 0,
        placeholderData: keepPreviousData,
    });
};
