"use client";
import Link from "next/link";
import { useEffect } from "react";
import { ApiError } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { formatPrice, productTitle } from "@/lib/format";
import { href, useI18n } from "@/lib/i18n";
import { QuantityStepper } from "../product/AddToBag";
import { ButtonLink } from "../ui/Button";
import { EmptyState, ErrorState } from "../ui/misc";
import { PageSpinner } from "../ui/Spinner";
import { OrderSummary } from "./OrderSummary";
import { useQuote } from "./useQuote";

export const BagView = () => {
    const { lang, t } = useI18n();
    const cart = useCart();
    const quote = useQuote();

    // A code that stopped working (expired, minimum no longer met…) is dropped quietly.
    useEffect(() => {
        if (quote.error instanceof ApiError && quote.error.fields.discount_code) cart.setDiscountCode("");
    }, [quote.error, cart]);

    // Products that were removed from the shop can't be bought; take them out of the bag.
    useEffect(() => {
        if (!quote.data || quote.isPlaceholderData) return;
        cart.items
            .filter((item) => !quote.data.lines.some((line) => line.product === item.product))
            .forEach((item) => cart.remove(item.product));
    }, [quote.data, quote.isPlaceholderData, cart]);

    if (!cart.hydrated) return <PageSpinner />;

    if (cart.items.length === 0) {
        return (
            <div className="container-page py-10">
                <EmptyState title={t.bag.empty} text={t.bag.emptyHint}
                    action={<ButtonLink href={href(lang, "/shop")}>{t.bag.emptyCta}</ButtonLink>} />
            </div>
        );
    }

    const lines = quote.data?.lines ?? [];

    return (
        <div className="container-page py-10">
            <h1 className="heading-display mb-8 text-4xl">{t.bag.title}</h1>
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
                <div>
                    {quote.isError && !quote.data && <ErrorState onRetry={() => quote.refetch()} />}
                    {quote.data && quote.data.problems.length > 0 && (
                        <div className="mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                            <p className="font-medium">{t.bag.problems}</p>
                            <ul className="mt-1 list-disc ps-5">{quote.data.problems.map((p) => <li key={p}>{p}</li>)}</ul>
                        </div>
                    )}
                    <ul className="flex flex-col divide-y divide-line border-y border-line">
                        {lines.map((line) => {
                            const title = productTitle(line, lang);
                            return (
                                <li key={line.product} className="flex gap-4 py-5">
                                    <Link href={href(lang, `/shop/${line.slug}`)} className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-blush sm:size-28">
                                        <img src={line.image} alt={title} className="size-4/5 object-contain" />
                                    </Link>
                                    <div className="flex flex-1 flex-col gap-2">
                                        <div className="flex items-start justify-between gap-3">
                                            <Link href={href(lang, `/shop/${line.slug}`)} className="font-display text-lg text-ink hover:text-magenta">{title}</Link>
                                            <span className="font-semibold text-burgundy">{formatPrice(line.line_total, lang)}</span>
                                        </div>
                                        <span className="text-sm text-muted">{formatPrice(line.unit_price, lang)}</span>
                                        <div className="mt-auto flex items-center justify-between gap-3">
                                            <QuantityStepper size="sm" value={line.qty} min={1} max={Math.max(line.stock, 1)}
                                                onChange={(qty) => cart.setQty(line.product, qty)} />
                                            <button type="button" onClick={() => cart.remove(line.product)}
                                                className="cursor-pointer text-sm text-muted underline-offset-4 hover:text-red-600 hover:underline">
                                                {t.bag.remove}
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <Link href={href(lang, "/shop")} className="mt-6 inline-block text-sm font-medium text-magenta hover:underline"><span className="inline-block rtl:-scale-x-100">←</span> {t.bag.continue}</Link>
                </div>

                <OrderSummary quote={quote.data} loading={quote.isFetching}>
                    <ButtonLink href={href(lang, "/checkout")} size="lg" className="w-full"
                        aria-disabled={!quote.data || quote.data.problems.length > 0}
                        style={!quote.data || quote.data.problems.length > 0 ? { pointerEvents: "none", opacity: 0.5 } : undefined}>
                        {t.bag.checkout}
                    </ButtonLink>
                </OrderSummary>
            </div>
        </div>
    );
};
