"use client";
import { useFavorites } from "@/lib/favorites";
import { useI18n } from "@/lib/i18n";

export const HeartIcon = ({ filled, className = "size-5" }: { filled?: boolean; className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor"
        strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />
    </svg>
);

export const FavoriteButton = ({ productId, title, className = "" }: { productId: number; title: string; className?: string }) => {
    const { t } = useI18n();
    const { has, toggle, hydrated } = useFavorites();
    const active = hydrated && has(productId);
    return (
        <button type="button" onClick={() => toggle(productId)} aria-pressed={active}
            aria-label={`${active ? t.favorites.remove : t.favorites.add}: ${title}`}
            className={`relative z-10 flex cursor-pointer items-center justify-center rounded-full transition hover:scale-110 ${active ? "text-magenta" : "text-ink/45 hover:text-magenta"} ${className}`}>
            <HeartIcon filled={active} />
        </button>
    );
};
