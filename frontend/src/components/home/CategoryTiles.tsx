import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import { categoryName } from "@/lib/format";
import { fill, href } from "@/lib/text";
import type { Category } from "@/lib/types";

export const CategoryTiles = ({ categories, lang, t }: { categories: Category[]; lang: string; t: Dictionary }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
    {categories.map((category) => (
      <Link key={category.slug} href={`${href(lang, "/shop")}?category=${category.slug}`}
        className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-white p-3 text-center transition hover:border-burgundy/20 hover:shadow-(--shadow-soft)">
        <span className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white">
          {category.image && (
            <img src={category.image} alt="" loading="lazy" className="size-4/5 object-contain transition duration-500 group-hover:scale-110" />
          )}
        </span>
        <span className="font-medium text-ink">{categoryName(category, lang)}</span>
        <span className="-mt-2 text-xs text-muted">{fill(t.categories.count, (category.product_count ?? 0).toLocaleString(lang))}</span>
      </Link>
    ))}
  </div>
);
