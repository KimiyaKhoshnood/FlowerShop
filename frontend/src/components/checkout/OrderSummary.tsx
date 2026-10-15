"use client";
import { useState } from "react";
import { ApiError, api } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_FROM } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { fill, useI18n } from "@/lib/i18n";
import type { Quote } from "@/lib/types";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Spinner";

const DiscountCodeForm = ({ subtotal }: { subtotal: string }) => {
    const { t } = useI18n();
    const { discountCode, setDiscountCode } = useCart();
    const [code, setCode] = useState("");
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);

    if (discountCode) {
        return (
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                <span className="font-semibold">{discountCode}</span>
                <button type="button" className="cursor-pointer text-xs underline" onClick={() => setDiscountCode("")}>{t.bag.code.remove}</button>
            </div>
        );
    }

    const apply = async () => {
        if (!code.trim()) return;
        setLoading(true);
        setError(undefined);
        try {
            const discount = await api.discounts.validate(code.trim(), subtotal);
            setDiscountCode(discount.code);
            setCode("");
        } catch (err) {
            setError(err instanceof ApiError ? err.message : t.common.error);
        } finally {
            setLoading(false);
        }
    };

    // Not a <form>: on the checkout page this sits inside the order form, and forms can't be nested.
    return (
        <div className="flex flex-col gap-1.5" role="group" aria-labelledby="discount-code-label">
            <label id="discount-code-label" htmlFor="discount-code" className="text-sm font-medium">{t.bag.code.label}</label>
            <div className="flex gap-2">
                <input id="discount-code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            apply();
                        }
                    }}
                    placeholder={t.bag.code.placeholder} dir="ltr"
                    className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-white px-3 text-sm uppercase focus:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/20" />
                <Button variant="outline" size="sm" className="!h-10" loading={loading} onClick={apply}>{t.bag.code.apply}</Button>
            </div>
            {error ? <p className="text-xs text-red-600">{error}</p> : <p className="text-xs text-muted">{t.bag.code.hint}</p>}
        </div>
    );
};

export const OrderSummary = ({ quote, loading, children }: { quote?: Quote; loading?: boolean; children?: React.ReactNode }) => {
    const { lang, t } = useI18n();
    const missingForFree = quote ? FREE_SHIPPING_FROM - Number(quote.subtotal) : 0;

    return (
        <aside className="card flex flex-col gap-5 p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl text-burgundy">{t.bag.summary}</h2>
            {!quote ? (
                <div className="flex flex-col gap-3"><Skeleton className="h-5" /><Skeleton className="h-5" /><Skeleton className="h-8" /></div>
            ) : (
                <>
                    <dl className={`flex flex-col gap-2.5 text-sm transition-opacity ${loading ? "opacity-50" : ""}`}>
                        <div className="flex justify-between"><dt className="text-muted">{t.bag.subtotal}</dt><dd>{formatPrice(quote.subtotal, lang)}</dd></div>
                        {quote.discount_code && (
                            <div className="flex justify-between text-emerald-700">
                                <dt>{fill(t.bag.discount, quote.discount_code)}</dt>
                                <dd>−{formatPrice(quote.discount_amount, lang)}</dd>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <dt className="text-muted">{t.bag.shipping}</dt>
                            <dd>{Number(quote.shipping_fee) === 0 ? t.bag.free : formatPrice(quote.shipping_fee, lang)}</dd>
                        </div>
                        <div className="mt-2 flex justify-between border-t border-line pt-4 text-base font-semibold">
                            <dt>{t.bag.total}</dt><dd className="text-burgundy">{formatPrice(quote.total, lang)}</dd>
                        </div>
                    </dl>

                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-muted">
                            {missingForFree > 0 ? fill(t.bag.freeShippingHint, formatPrice(missingForFree, lang)) : t.bag.freeShippingDone}
                        </p>
                        <div className="h-1.5 overflow-hidden rounded-full bg-blush">
                            <div className="h-full rounded-full bg-magenta transition-all"
                                style={{ width: `${Math.min(100, (Number(quote.subtotal) / FREE_SHIPPING_FROM) * 100)}%` }} />
                        </div>
                    </div>

                    <DiscountCodeForm subtotal={quote.subtotal} />
                </>
            )}
            {children}
        </aside>
    );
};
