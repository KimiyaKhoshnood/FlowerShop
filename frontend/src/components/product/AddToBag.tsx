"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { fill, href, useI18n } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import type { Product } from "@/lib/types";
import { Button, ButtonLink } from "../ui/Button";

export const QuantityStepper = ({ value, min = 1, max, onChange, size = "md" }:
    { value: number; min?: number; max: number; onChange: (value: number) => void; size?: "sm" | "md" }) => {
    const { lang } = useI18n();
    const box = size === "sm" ? "h-9 w-9" : "h-11 w-11";
    return (
        <div className="inline-flex items-center rounded-full border border-line bg-white" dir="ltr">
            <button type="button" aria-label="-1" disabled={value <= min} onClick={() => onChange(value - 1)}
                className={`${box} cursor-pointer rounded-full text-lg text-burgundy transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-30`}>−</button>
            <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{value.toLocaleString(lang)}</span>
            <button type="button" aria-label="+1" disabled={value >= max} onClick={() => onChange(value + 1)}
                className={`${box} cursor-pointer rounded-full text-lg text-burgundy transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-30`}>+</button>
        </div>
    );
};

export const AddToBag = ({ product, title }: { product: Product; title: string }) => {
    const { lang, t } = useI18n();
    const cart = useCart();
    const toast = useToast();
    const inBag = cart.qtyOf(product.id);
    const available = Math.max(0, product.stock - inBag);
    const [qty, setQty] = useState(1);

    if (!product.in_stock) {
        return <Button size="lg" disabled className="w-full sm:w-auto">{t.product.outOfStock}</Button>;
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
                <QuantityStepper value={Math.min(qty, Math.max(available, 1))} max={Math.max(available, 1)} onChange={setQty} />
                <Button size="lg" className="flex-1 sm:flex-none" disabled={available === 0}
                    onClick={() => {
                        cart.add(product.id, qty, product.stock);
                        toast.success(`${title} — ${t.product.added}`);
                        setQty(1);
                    }}>
                    {t.product.addToBag}
                </Button>
                {inBag > 0 && (
                    <ButtonLink href={href(lang, "/bag")} variant="outline" size="lg">
                        {t.nav.bag} ({inBag.toLocaleString(lang)})
                    </ButtonLink>
                )}
            </div>
            {product.stock <= 5 && (
                <p className="text-sm font-medium text-magenta">{fill(t.product.onlyLeft, product.stock.toLocaleString(lang))}</p>
            )}
        </div>
    );
};
