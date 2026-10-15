"use client";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/format";
import { fill, href, useI18n } from "@/lib/i18n";
import type { Order } from "@/lib/types";
import { StatusBadge } from "../ui/misc";

const STEP_INDEX = { pending: 0, paid: 1, shipped: 2, delivered: 3, cancelled: -1 } as const;

const Timeline = ({ order }: { order: Order }) => {
    const { t } = useI18n();
    const current = STEP_INDEX[order.status];
    if (current < 0) return null;
    return (
        <ol className="grid grid-cols-4 gap-2">
            {t.order.steps.map((step, i) => (
                <li key={step} className="flex flex-col gap-2">
                    <span className={`h-1.5 rounded-full ${i <= current ? "bg-magenta" : "bg-blush"}`} />
                    <span className={`text-xs ${i <= current ? "font-medium text-burgundy" : "text-muted"}`}>{step}</span>
                </li>
            ))}
        </ol>
    );
};

/** Everything about one order. `actions` holds the cancel button or the admin status controls. */
export const OrderDetail = ({ order, actions }: { order: Order; actions?: React.ReactNode }) => {
    const { lang, t } = useI18n();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="heading-display text-3xl" dir="ltr">{fill(t.order.number, order.number)}</h1>
                    <p className="mt-1 text-sm text-muted">{fill(t.order.placedOn, formatDate(order.created_at, lang, true))}</p>
                </div>
                <div className="flex items-center gap-3"><StatusBadge status={order.status} />{actions}</div>
            </div>

            <Timeline order={order} />

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <section className="card overflow-hidden">
                    <h2 className="border-b border-line px-5 py-4 font-semibold text-burgundy">{t.order.items}</h2>
                    <ul className="divide-y divide-line">
                        {order.items.map((item) => (
                            <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-blush">
                                    {item.product_image && <img src={item.product_image} alt="" className="size-4/5 object-contain" />}
                                </span>
                                <div className="flex-1">
                                    {item.product_slug
                                        ? <Link href={href(lang, `/shop/${item.product_slug}`)} className="font-medium hover:text-magenta">{item.product_title}</Link>
                                        : <span className="font-medium">{item.product_title}</span>}
                                    <p className="text-sm text-muted">{item.qty.toLocaleString(lang)} × {formatPrice(item.unit_price, lang)}</p>
                                </div>
                                <span className="font-medium">{formatPrice(item.line_total, lang)}</span>
                            </li>
                        ))}
                    </ul>
                    <dl className="flex flex-col gap-2 border-t border-line px-5 py-4 text-sm">
                        <div className="flex justify-between"><dt className="text-muted">{t.bag.subtotal}</dt><dd>{formatPrice(order.subtotal, lang)}</dd></div>
                        {order.discount_percent > 0 && (
                            <div className="flex justify-between text-emerald-700">
                                <dt>{fill(t.bag.discount, `${order.discount_code ?? ""} ${order.discount_percent}%`.trim())}</dt>
                                <dd>−{formatPrice(order.discount_amount, lang)}</dd>
                            </div>
                        )}
                        <div className="flex justify-between"><dt className="text-muted">{t.bag.shipping}</dt>
                            <dd>{Number(order.shipping_fee) === 0 ? t.bag.free : formatPrice(order.shipping_fee, lang)}</dd></div>
                        <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
                            <dt>{t.bag.total}</dt><dd className="text-burgundy">{formatPrice(order.total, lang)}</dd></div>
                    </dl>
                </section>

                <div className="flex flex-col gap-4">
                    <section className="card p-5 text-sm">
                        <h2 className="mb-3 font-semibold text-burgundy">{t.order.shipTo}</h2>
                        <p className="font-medium">{order.recipient_name}</p>
                        <p className="text-muted">{order.address}</p>
                        <p className="text-muted">{[order.city, order.postal_code].filter(Boolean).join(" · ")}</p>
                        <p className="text-muted" dir="ltr">{order.phone}</p>
                        {order.note && <p className="mt-3 rounded-lg bg-blush/60 p-3 text-burgundy">“{order.note}”</p>}
                    </section>
                    <section className="card grid grid-cols-2 gap-4 p-5 text-sm">
                        <div>
                            <h2 className="text-muted">{t.order.deliveryDate}</h2>
                            <p className="font-medium">{formatDate(order.delivery_date, lang)}</p>
                        </div>
                        <div>
                            <h2 className="text-muted">{t.order.payment}</h2>
                            <p className="font-medium">{t.checkout.methods[order.payment_method]}</p>
                        </div>
                    </section>
                    {order.customer && (
                        <section className="card p-5 text-sm">
                            <h2 className="mb-2 font-semibold text-burgundy">{t.admin.orderList.customer}</h2>
                            <p className="font-medium">{order.customer.name || order.customer.username}</p>
                            <p className="text-muted" dir="ltr">{order.customer.email}</p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
