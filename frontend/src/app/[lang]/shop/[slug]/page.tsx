import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToBag } from "@/components/product/AddToBag";
import { Price } from "@/components/product/Price";
import { ProductRail } from "@/components/product/ProductRail";
import { Reviews } from "@/components/product/Reviews";
import { Stars } from "@/components/ui/Stars";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/config";
import { discountPercent, monthName, productCategoryName, productDescription, productTitle } from "@/lib/format";
import { fetchProduct, fetchProducts, fetchReviews } from "@/lib/server-api";
import { fill, href } from "@/lib/text";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return {};
  const title = productTitle(product, lang);
  return {
    title,
    description: productDescription(product, lang),
    alternates: { canonical: href(lang, `/shop/${slug}`), languages: { en: `/en/shop/${slug}`, fa: `/fa/shop/${slug}` } },
    openGraph: { title, description: productDescription(product, lang), images: [product.image] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { lang, slug } = await params;
  const [t, product] = await Promise.all([getDictionary(lang), fetchProduct(slug)]);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    fetchReviews(slug),
    product.category ? fetchProducts({ category: product.category, page_size: "9" }) : Promise.resolve(null),
  ]);
  const title = productTitle(product, lang);
  const category = productCategoryName(product, lang);
  const currentMonth = new Date().getMonth() + 1;

  const specs = [
    { label: t.product.details.color, value: (lang === "fa" && product.color_fa) || product.color },
    { label: t.product.details.stems, value: product.stems_per_bunch.toLocaleString(lang) },
    { label: t.product.details.vaseLife, value: fill(t.product.details.days, product.vase_life_days.toLocaleString(lang)) },
    product.stem_length_cm && { label: t.product.details.stemLength, value: fill(t.product.details.cm, product.stem_length_cm.toLocaleString(lang)) },
    product.head_size_cm && { label: t.product.details.headSize, value: fill(t.product.details.cm, product.head_size_cm.toLocaleString(lang)) },
  ].filter(Boolean) as { label: string; value: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: `${SITE_URL}${product.image}`,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.review_count > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.review_count },
    }),
  };

  return (
    <div className="container-page py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <Link href={href(lang)} className="hover:text-magenta">{t.nav.home}</Link>
        <span>/</span>
        <Link href={href(lang, "/shop")} className="hover:text-magenta">{t.nav.shop}</Link>
        {product.category && (<>
          <span>/</span>
          <Link href={`${href(lang, "/shop")}?category=${product.category}`} className="hover:text-magenta">{category}</Link>
        </>)}
        <span>/</span>
        <span className="text-ink">{title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-line bg-white">
          <img src={product.image} alt={title} className="size-4/5 object-contain" />
          {product.on_sale && (
            <span className="absolute start-5 top-5 rounded-full bg-magenta px-3 py-1.5 text-sm font-semibold text-white">
              {fill(t.product.off, discountPercent(product))}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            {category && <p className="eyebrow">{category}</p>}
            <h1 className="heading-display mt-2 text-4xl sm:text-5xl">{title}</h1>
            {product.review_count > 0 && (
              <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm text-muted hover:text-magenta">
                <Stars value={product.rating} />
                {fill(t.product.reviews.count, product.review_count.toLocaleString(lang))}
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <Price price={product.price} compareAt={product.compare_at_price} className="text-3xl" />
            <span className="text-sm text-muted">{fill(t.product.perBunch, product.stems_per_bunch.toLocaleString(lang))}</span>
          </div>

          <p className="leading-relaxed text-ink/80">{productDescription(product, lang)}</p>

          <AddToBag product={product} title={title} />

          <div className="card divide-y divide-line">
            <h2 className="px-5 py-4 font-semibold text-burgundy">{t.product.details.title}</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 px-5 py-4 text-sm">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-muted">{spec.label}</dt>
                  <dd className="font-medium text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
            {product.season_months.length > 0 && (
              <div className="px-5 py-4">
                <p className="mb-3 text-sm text-muted">{t.product.details.season}</p>
                <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <span key={month}
                      className={`rounded-md py-1 text-center text-[11px] ${product.season_months.includes(month) ? "bg-burgundy text-white" : "bg-blush text-burgundy/50"} ${month === currentMonth ? "ring-2 ring-magenta ring-offset-1" : ""}`}>
                      {monthName(month, lang)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <details className="card group px-5 py-4" open>
            <summary className="cursor-pointer font-semibold text-burgundy">{t.product.care.title}</summary>
            <ul className="mt-3 list-disc space-y-2 ps-5 text-sm text-ink/80">
              {t.product.care.tips.map((tip) => <li key={tip}>{tip}</li>)}
            </ul>
          </details>
        </div>
      </div>

      <div className="mt-24">
        <Reviews slug={slug} initialReviews={reviews} rating={product.rating} count={product.review_count} />
      </div>

      {related && related.results.filter((p) => p.id !== product.id).length > 0 && (
        <section className="mt-24">
          <h2 className="heading-display mb-8 text-3xl">{t.product.related}</h2>
          <ProductRail products={related.results.filter((p) => p.id !== product.id)} />
        </section>
      )}
    </div>
  );
}
