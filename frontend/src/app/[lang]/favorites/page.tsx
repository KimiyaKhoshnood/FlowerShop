"use client";
import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, ErrorState } from "@/components/ui/misc";
import { PageSpinner } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { useFavorites } from "@/lib/favorites";
import { href, useI18n } from "@/lib/i18n";

export default function FavoritesPage() {
  const { lang, t } = useI18n();
  const { ids, hydrated } = useFavorites();
  const products = useQuery({
    queryKey: ["favorites", ids],
    queryFn: () => api.products.list({ ids: ids.join(","), page_size: "100" }),
    enabled: hydrated && ids.length > 0,
  });

  // Keep the order in which flowers were saved (newest first).
  const saved = (products.data?.results ?? [])
    .slice()
    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

  return (
    <div className="container-page py-10">
      <h1 className="heading-display mb-8 text-4xl">{t.favorites.title}</h1>
      {!hydrated || (ids.length > 0 && products.isPending) ? <PageSpinner />
        : products.isError ? <ErrorState onRetry={() => products.refetch()} />
          : ids.length === 0 || saved.length === 0 ? (
            <EmptyState title={t.favorites.empty} text={t.favorites.emptyHint}
              action={<ButtonLink href={href(lang, "/shop")}>{t.bag.emptyCta}</ButtonLink>} />
          ) : <ProductGrid products={saved} />}
    </div>
  );
}
