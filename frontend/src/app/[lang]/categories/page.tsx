import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import { categoryName } from "@/lib/format";
import { fetchCategories } from "@/lib/server-api";
import { fill, href } from "@/lib/text";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getDictionary((await params).lang);
  return { title: t.categories.title, description: t.categories.subtitle };
}

export default async function CategoriesPage({ params }: Props) {
  const { lang } = await params;
  const [t, categories] = await Promise.all([getDictionary(lang), fetchCategories()]);

  return (
    <div className="container-page py-10">
      <header className="mb-10 border-b border-line pb-8">
        <h1 className="heading-display text-4xl sm:text-5xl">{t.categories.title}</h1>
        <p className="mt-3 text-muted">{t.categories.subtitle}</p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.filter((category) => (category.product_count ?? 0) > 0).map((category) => (
          <Link key={category.slug} href={`${href(lang, "/shop")}?category=${category.slug}`}
            className="group flex items-center gap-5 rounded-(--radius-card) border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-(--shadow-soft)">
            <span className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-blush">
              {category.image && <img src={category.image} alt="" loading="lazy" className="size-4/5 object-contain transition duration-500 group-hover:scale-110" />}
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-2xl text-burgundy">{categoryName(category, lang)}</span>
              <span className="text-sm text-muted">{(lang === "fa" && category.description_fa) || category.description}</span>
              <span className="mt-1 text-xs font-medium text-magenta">
                {fill(t.categories.count, (category.product_count ?? 0).toLocaleString(lang))} <span className="inline-block rtl:-scale-x-100">→</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
