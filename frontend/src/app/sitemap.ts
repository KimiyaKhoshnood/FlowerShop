import type { MetadataRoute } from "next";
import { API_URL, LANGS, SITE_URL } from "@/lib/config";
import type { Paginated, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/shop", "/categories"];
  let products: Product[] = [];
  try {
    const res = await fetch(`${process.env.INTERNAL_API_URL || API_URL}/api/products/?page_size=100`, { next: { revalidate: 3600 } });
    if (res.ok) products = ((await res.json()) as Paginated<Product>).results;
  } catch {
    // Without the API the sitemap still lists the static pages.
  }

  return LANGS.flatMap((lang) => [
    ...pages.map((page) => ({ url: `${SITE_URL}/${lang}${page}`, changeFrequency: "daily" as const })),
    ...products.map((product) => ({
      url: `${SITE_URL}/${lang}/shop/${product.slug}`,
      lastModified: product.updated_at,
      changeFrequency: "weekly" as const,
    })),
  ]);
}
