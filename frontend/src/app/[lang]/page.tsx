import Link from "next/link";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { HeroMosaic } from "@/components/home/HeroMosaic";
import { ProductRail } from "@/components/product/ProductRail";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/misc";
import { getDictionary } from "@/i18n/dictionaries";
import { fetchCategories, fetchProducts } from "@/lib/server-api";
import { href } from "@/lib/text";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getDictionary(lang);
  const [featured, onSale, categories] = await Promise.all([
    fetchProducts({ featured: "1", page_size: "12" }),
    fetchProducts({ on_sale: "1", page_size: "12" }),
    fetchCategories(),
  ]);

  return (
    <>
      {/* Hero — Persian shows flowers instead of a long headline */}
      {lang === "fa" ? <HeroMosaic products={featured.results} lang={lang} t={t} /> : (
        <section className="relative overflow-hidden bg-blush">
          <div className="absolute inset-0 bg-[url(/VerticalHeroBg.svg)] bg-cover bg-center opacity-60 md:bg-[url(/HeroBg.svg)] md:bg-bottom" />
          <div className="container-page relative flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
            <span className="eyebrow">{t.home.hero.eyebrow}</span>
            <h1 className="heading-display max-w-3xl text-5xl leading-tight sm:text-6xl lg:text-7xl">{t.home.hero.title}</h1>
            <p className="max-w-xl text-lg text-ink/70">{t.home.hero.subtitle}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <ButtonLink href={href(lang, "/shop")} size="lg">{t.home.hero.cta}</ButtonLink>
              <ButtonLink href={href(lang, "/categories")} size="lg" variant="outline" className="bg-white/70">{t.home.hero.secondary}</ButtonLink>
            </div>
          </div>
        </section>
      )}

      {/* Promises */}
      <section className={`container-page relative z-10 ${lang === "fa" ? "" : "-mt-14"}`}>
        <div className={`card grid grid-cols-2 gap-6 p-6 lg:grid-cols-4 lg:divide-x lg:divide-line rtl:lg:divide-x-reverse ${lang === "fa" ? "" : "shadow-(--shadow-soft)"}`}>
          {t.home.features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-start lg:px-4">
              <img src={`/${feature.icon}`} alt="" className="size-12 shrink-0" />
              <div>
                <h3 className="font-semibold text-burgundy">{feature.title}</h3>
                <p className="hidden text-sm text-muted sm:block">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-page mt-24">
        <SectionHeading title={t.home.featured.title} subtitle={t.home.featured.subtitle}
          action={<Link href={href(lang, "/shop")} className="text-sm font-medium text-magenta hover:underline">{t.home.featured.cta} <span className="inline-block rtl:-scale-x-100">→</span></Link>} />
        <ProductRail products={featured.results} />
      </section>

      {/* Categories */}
      <section className="container-page mt-24">
        <SectionHeading title={t.home.categories.title} subtitle={t.home.categories.subtitle}
          action={<Link href={href(lang, "/categories")} className="text-sm font-medium text-magenta hover:underline">{t.home.categories.cta} <span className="inline-block rtl:-scale-x-100">→</span></Link>} />
        <CategoryTiles categories={categories.slice(0, 6)} lang={lang} t={t} />
      </section>

      {/* Promo */}
      <section className="container-page mt-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-burgundy px-8 py-14 text-center text-white sm:px-16 lg:text-start">
          <div className="absolute -end-16 -top-16 size-64 rounded-full bg-magenta/30 blur-2xl" />
          <div className="absolute -bottom-20 start-10 size-56 rounded-full bg-blush/10 blur-2xl" />
          <div className="relative flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blush/80">{t.home.promo.eyebrow}</span>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">{t.home.promo.title}</h2>
              <p className="mt-3 text-blush/80">{t.home.promo.text}</p>
            </div>
            <ButtonLink href={href(lang, "/shop")} size="lg" className="bg-white !text-burgundy hover:!bg-blush">{t.home.promo.cta}</ButtonLink>
          </div>
        </div>
      </section>

      {/* On sale */}
      {onSale.results.length > 0 && (
        <section className="container-page mt-24">
          <SectionHeading title={t.home.sale.title} subtitle={t.home.sale.subtitle}
            action={<Link href={`${href(lang, "/shop")}?on_sale=1`} className="text-sm font-medium text-magenta hover:underline">{t.home.sale.cta} <span className="inline-block rtl:-scale-x-100">→</span></Link>} />
          <ProductRail products={onSale.results} />
        </section>
      )}
    </>
  );
}
