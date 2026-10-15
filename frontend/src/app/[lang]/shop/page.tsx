import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductCard";
import { ShopFilters, SortSelect } from "@/components/shop/ShopFilters";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/misc";
import { getDictionary } from "@/i18n/dictionaries";
import { categoryName } from "@/lib/format";
import { fetchCategories, fetchProducts } from "@/lib/server-api";
import { fill, href } from "@/lib/text";
import type { ProductQuery } from "@/lib/types";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | undefined>> };

const PAGE_SIZE = 12;
const FILTER_KEYS = ["q", "category", "min_price", "max_price", "in_stock", "on_sale", "sort", "page"] as const;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  const [t, categories] = await Promise.all([getDictionary(lang), fetchCategories()]);
  const category = categories.find((c) => c.slug === query.category);
  return {
    title: query.q ? fill(t.shop.searchFor, query.q) : category ? categoryName(category, lang) : t.shop.title,
    description: t.shop.subtitle,
    alternates: { canonical: href(lang, "/shop") },
  };
}

export default async function ShopPage({ params, searchParams }: Props) {
  const [{ lang }, rawQuery] = await Promise.all([params, searchParams]);
  const t = await getDictionary(lang);
  const query: ProductQuery = Object.fromEntries(
    FILTER_KEYS.filter((key) => rawQuery[key]).map((key) => [key, rawQuery[key]]),
  );
  const [products, categories] = await Promise.all([
    fetchProducts({ ...query, page_size: String(PAGE_SIZE) }),
    fetchCategories(),
  ]);

  const page = Number(query.page ?? 1);
  const pages = Math.max(1, Math.ceil(products.count / PAGE_SIZE));
  const activeCategory = categories.find((category) => category.slug === query.category);
  const pageHref = (target: number) => {
    const params = new URLSearchParams(query as Record<string, string>);
    if (target > 1) params.set("page", String(target)); else params.delete("page");
    const str = params.toString();
    return `${href(lang, "/shop")}${str ? `?${str}` : ""}`;
  };

  return (
    <div className="container-page py-10">
      <header className="mb-10 border-b border-line pb-8">
        <h1 className="heading-display text-4xl sm:text-5xl">
          {query.q ? fill(t.shop.searchFor, query.q) : activeCategory ? categoryName(activeCategory, lang) : t.shop.title}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          {activeCategory ? ((lang === "fa" && activeCategory.description_fa) || activeCategory.description) : t.shop.subtitle}
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <Suspense>
          <ShopFilters categories={categories} />
        </Suspense>

        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-muted">{fill(t.shop.results, products.count.toLocaleString(lang))}</p>
            <Suspense><SortSelect /></Suspense>
          </div>

          {products.results.length === 0 ? (
            <EmptyState title={t.shop.empty} text={t.shop.emptyHint} />
          ) : (
            <ProductGrid products={products.results} />
          )}

          {pages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((target) => (
                <Link key={target} href={pageHref(target)} aria-current={target === page ? "page" : undefined}
                  className={buttonClasses({ variant: target === page ? "secondary" : "outline", size: "sm", className: "!w-9 !px-0" })}>
                  {target.toLocaleString(lang)}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
