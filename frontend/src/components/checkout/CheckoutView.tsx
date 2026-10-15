"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ApiError, api } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { formatPrice, isoDay, productTitle, tomorrow } from "@/lib/format";
import { fill, href, useI18n } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import type { CheckoutInput, PaymentMethod } from "@/lib/types";
import { Button, ButtonLink } from "../ui/Button";
import { Input, Textarea } from "../ui/Field";
import { EmptyState } from "../ui/misc";
import { PageSpinner } from "../ui/Spinner";
import { OrderSummary } from "./OrderSummary";
import { useQuote } from "./useQuote";

type Form = Omit<CheckoutInput, "items" | "discount_code">;

// Simple line icons (no brand logos) so the three options read as one set.
const PAYMENT_METHODS: { value: PaymentMethod; icon: string }[] = [
    { value: "card", icon: "M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5v-9ZM3 10h18M7 14.5h3" },
    { value: "paypal", icon: "M5 19 8 5h6.5a4 4 0 0 1 0 8H10l-1.2 6H5Zm5-6 .8-4" },
    { value: "snapppay", icon: "M12 3a9 9 0 1 0 9 9M12 3v9h9M12 3a9 9 0 0 1 9 9" },
];

const latestDeliveryDay = () => {
    const date = new Date();
    date.setDate(date.getDate() + 60);
    return isoDay(date);
};

export const CheckoutView = () => {
    const { lang, t } = useI18n();
    const cart = useCart();
    const quote = useQuote();
    const toast = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();
    const profile = useQuery({ queryKey: ["me"], queryFn: api.auth.me });

    const { register, handleSubmit, setError, setValue, watch, getValues, formState: { errors, isSubmitting } } = useForm<Form>({
        defaultValues: { payment_method: "card", delivery_date: tomorrow(), recipient_name: "", phone: "", city: "", address: "" },
    });

    useEffect(() => {
        const name = profile.data ? `${profile.data.first_name} ${profile.data.last_name}`.trim() : "";
        if (name && !getValues("recipient_name")) setValue("recipient_name", name);
    }, [profile.data, getValues, setValue]);

    const onSubmit = handleSubmit(async (form) => {
        try {
            const order = await api.orders.create({ ...form, items: cart.items, discount_code: cart.discountCode });
            cart.clear();
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            router.push(`${href(lang, `/account/orders/${order.id}`)}?placed=1`);
        } catch (error) {
            if (error instanceof ApiError) {
                Object.entries(error.fields).forEach(([field, message]) => {
                    if (field in form) setError(field as keyof Form, { message });
                });
                toast.error(error.message);
                if (error.fields.discount_code) cart.setDiscountCode("");
                quote.refetch();
            } else {
                toast.error(t.common.error);
            }
        }
    });

    if (!cart.hydrated) return <PageSpinner />;
    if (cart.items.length === 0) {
        return (
            <div className="container-page py-10">
                <EmptyState title={t.checkout.emptyBag} action={<ButtonLink href={href(lang, "/shop")}>{t.bag.emptyCta}</ButtonLink>} />
            </div>
        );
    }

    const required = { required: t.common.required };
    const method = watch("payment_method");

    return (
        <div className="container-page py-10">
            <h1 className="heading-display mb-8 text-4xl">{t.checkout.title}</h1>
            <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_380px]">
                <div className="flex flex-col gap-8">
                    <section className="card p-6">
                        <h2 className="mb-5 font-display text-xl text-burgundy">{t.checkout.shipping}</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input label={t.checkout.recipient} autoComplete="name" error={errors.recipient_name?.message}
                                {...register("recipient_name", required)} />
                            <Input label={t.checkout.phone} type="tel" autoComplete="tel" dir="ltr" error={errors.phone?.message}
                                {...register("phone", { ...required, pattern: { value: /^\+?[0-9 ()-]{7,20}$/, message: t.checkout.phoneInvalid } })} />
                            <Input label={t.checkout.city} autoComplete="address-level2" error={errors.city?.message}
                                {...register("city", required)} />
                            <Input label={t.checkout.postalCode} autoComplete="postal-code" dir="ltr" error={errors.postal_code?.message}
                                {...register("postal_code")} />
                            <Input label={t.checkout.address} autoComplete="street-address" containerClassName="sm:col-span-2"
                                error={errors.address?.message} {...register("address", required)} />
                            <Textarea label={t.checkout.note} containerClassName="sm:col-span-2" maxLength={500} {...register("note")} />
                        </div>
                    </section>

                    <section className="card p-6">
                        <h2 className="mb-5 font-display text-xl text-burgundy">{t.checkout.delivery}</h2>
                        <Input type="date" min={tomorrow()} max={latestDeliveryDay()} hint={t.checkout.deliveryHint}
                            containerClassName="max-w-xs" error={errors.delivery_date?.message}
                            {...register("delivery_date", required)} />
                    </section>

                    <section className="card p-6">
                        <h2 className="mb-5 font-display text-xl text-burgundy">{t.checkout.payment}</h2>
                        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup">
                            {PAYMENT_METHODS.map(({ value, icon }) => (
                                <label key={value}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${method === value ? "border-burgundy bg-blush/40 ring-1 ring-burgundy" : "border-line hover:border-burgundy/40"}`}>
                                    <input type="radio" value={value} className="sr-only" {...register("payment_method")} />
                                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${method === value ? "bg-burgundy text-white" : "bg-blush text-burgundy"}`}>
                                        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7"
                                            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icon} /></svg>
                                    </span>
                                    <span className="flex flex-col">
                                        <span className="font-medium">{t.checkout.methods[value]}</span>
                                        <span className="text-xs text-muted">{t.checkout.methodHints[value]}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                        <p className="mt-4 rounded-xl bg-blush/60 px-4 py-3 text-xs text-burgundy">{t.checkout.mockNotice}</p>
                    </section>
                </div>

                <OrderSummary quote={quote.data} loading={quote.isFetching}>
                    {quote.data && (
                        <ul className="flex flex-col gap-3 border-t border-line pt-4 text-sm">
                            {quote.data.lines.map((line) => (
                                <li key={line.product} className="flex items-center gap-3">
                                    <span className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-blush">
                                        <img src={line.image} alt="" className="size-4/5 object-contain" />
                                        <span className="absolute -end-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-burgundy text-[10px] text-white">
                                            {line.qty.toLocaleString(lang)}
                                        </span>
                                    </span>
                                    <span className="flex-1">{productTitle(line, lang)}</span>
                                    <span>{formatPrice(line.line_total, lang)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Button type="submit" size="lg" className="w-full" loading={isSubmitting}
                        disabled={!quote.data || quote.data.problems.length > 0}>
                        {isSubmitting ? t.checkout.placing : fill(t.checkout.place, formatPrice(quote.data?.total ?? 0, lang))}
                    </Button>
                </OrderSummary>
            </form>
        </div>
    );
};
