import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/text";
import type { Product } from "@/lib/types";
import { ProductCard } from "../product/ProductCard";
import { ButtonLink } from "../ui/Button";

const TulipIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21v-8" />
    <path d="M12 13c-3.5 0-5.5-2.5-5.5-6.5L9 8l3-4 3 4 2.5-1.5c0 4-2 6.5-5.5 6.5Z" />
    <path d="M12 18c-1.8-1.6-3.6-2-5-1.6M12 18c1.8-1.6 3.6-2 5-1.6" />
  </svg>
);

/**
 * Minimal Persian home hero: a short headline next to three real products,
 * on the plain page background.
 */
export const HeroMosaic = ({ products, lang, t }: { products: Product[]; lang: string; t: Dictionary }) => (
  <section className="container-page grid items-center gap-12 py-14 lg:min-h-[72vh] lg:grid-cols-[1fr_1.35fr] lg:py-20">
    <div className="flex flex-col items-start gap-5">
      <span className="flex items-center gap-2.5 text-sm text-magenta">
        <span className="h-px w-8 bg-magenta/40" />
        <TulipIcon className="size-4" />
        {t.home.hero.eyebrow}
        <span className="h-px w-8 bg-magenta/40" />
      </span>
      <h1 className="heading-display hero-title">{t.home.hero.title}</h1>
      {t.home.hero.subtitle && <p className="text-base text-muted">{t.home.hero.subtitle}</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        <ButtonLink href={href(lang, "/shop")} size="lg" variant="secondary" className="min-w-36">
          {t.home.hero.cta}
          <span className="inline-block rtl:-scale-x-100" aria-hidden="true">→</span>
        </ButtonLink>
        <ButtonLink href={href(lang, "/categories")} size="lg" variant="outline" className="min-w-36">
          {t.home.hero.secondary}
        </ButtonLink>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {products.slice(0, 3).map((product, i) => (
        <div key={product.id} className={i === 2 ? "hidden sm:block" : ""}>
          <ProductCard product={product} priority />
        </div>
      ))}
    </div>
  </section>
);
