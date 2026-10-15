"use client";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Price = ({ price, compareAt, className = "text-lg" }:
    { price: string | number; compareAt?: string | number | null; className?: string }) => {
    const { lang } = useI18n();
    return (
        <span className="inline-flex flex-wrap items-baseline gap-2">
            <span className={`font-semibold text-burgundy ${className}`}>{formatPrice(price, lang)}</span>
            {compareAt && Number(compareAt) > Number(price) && (
                <span className="text-sm text-muted line-through">{formatPrice(compareAt, lang)}</span>
            )}
        </span>
    );
};
