"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { discountPercent, productTitle } from "@/lib/format";
import { fill, href, useI18n } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import type { Product } from "@/lib/types";
import { Stars } from "../ui/Stars";
import { FavoriteButton } from "./FavoriteButton";
import { Price } from "./Price";

const BagPlusIcon = () => (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 7h12l1 13H5L6 7Zm3 0V6a3 3 0 0 1 6 0v1M12 11v5M9.5 13.5h5" />
    </svg>
);

/** A quiet, white product card: photo, hairline, name, price and two small actions. */
export const ProductCard = ({ product, priority }: { product: Product; priority?: boolean }) => {
    const { lang, t } = useI18n();
    const cart = useCart();
    const toast = useToast();
    const title = productTitle(product, lang);
    const url = href(lang, `/shop/${product.slug}`);
    const inBag = cart.qtyOf(product.id);
    const canAdd = product.in_stock && inBag < product.stock;

    return (
        <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-3 transition hover:border-burgundy/20 hover:shadow-(--shadow-soft)">
            <Link href={url} className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-white">
                <img src={product.image} alt={title} loading={priority ? "eager" : "lazy"}
                    className={`size-full object-contain p-5 transition duration-500 group-hover:scale-105 ${product.in_stock ? "" : "opacity-50 grayscale"}`} />
                {product.on_sale && (
                    <span className="absolute start-2 top-2 rounded-full bg-magenta/10 px-2 py-0.5 text-[11px] font-semibold text-magenta">
                        {fill(t.product.off, discountPercent(product))}
                    </span>
                )}
                {!product.in_stock && (
                    <span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-full bg-ink/75 px-2.5 py-0.5 text-[11px] text-white">
                        {t.product.outOfStock}
                    </span>
                )}
            </Link>

            <div className="flex flex-1 flex-col gap-1 border-t border-line px-1 pt-3">
                <h3 className="text-[15px] font-medium leading-snug text-ink">
                    <Link href={url} className="after:absolute after:inset-0 after:content-['']">{title}</Link>
                </h3>
                {product.review_count > 0 && <Stars value={product.rating} className="size-3" />}
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <Price price={product.price} compareAt={product.compare_at_price} className="text-[15px]" />
                    <div className="flex items-center gap-0.5">
                        <FavoriteButton productId={product.id} title={title} className="size-8" />
                        <button
                            type="button"
                            disabled={!canAdd}
                            onClick={() => {
                                cart.add(product.id, 1, product.stock);
                                toast.success(`${title} — ${t.product.added}`);
                            }}
                            aria-label={`${t.product.addToBag}: ${title}`}
                            className="relative z-10 flex size-8 cursor-pointer items-center justify-center rounded-full text-burgundy transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            {inBag > 0
                                ? <span className="text-xs font-semibold">{inBag.toLocaleString(lang)}</span>
                                : <BagPlusIcon />}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export const ProductGrid = ({ products }: { products: Product[] }) => (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product, i) => <ProductCard key={product.id} product={product} priority={i < 4} />)}
    </div>
);
