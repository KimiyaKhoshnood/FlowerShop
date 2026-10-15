"use client";
import { Drawer } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { href, useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";

const Icon = ({ d, className = "size-6" }: { d: string; className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
        strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
);

const ICONS = {
    bag: "M6 7h12l1 13H5L6 7Zm3 0V6a3 3 0 0 1 6 0v1",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-4.3-4.3",
    menu: "M4 7h16M4 12h16M4 17h16",
    close: "M6 6l12 12M18 6 6 18",
    heart: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z",
    globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z",
};

/** Swap the language segment and keep the rest of the URL (path + query). */
const useOtherLanguageUrl = () => {
    const { lang } = useI18n();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const other = lang === "fa" ? "en" : "fa";
    const query = searchParams.toString();
    return pathname.replace(/^\/(en|fa)(?=\/|$)/, `/${other}`) + (query ? `?${query}` : "");
};

const SearchBox = ({ onDone, autoFocus }: { onDone?: () => void; autoFocus?: boolean }) => {
    const { lang, t } = useI18n();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [q, setQ] = useState(searchParams.get("q") ?? "");

    return (
        <form role="search" className="relative w-full"
            onSubmit={(event) => {
                event.preventDefault();
                router.push(`${href(lang, "/shop")}${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
                onDone?.();
            }}>
            <Icon d={ICONS.search} className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input type="search" value={q} onChange={(event) => setQ(event.target.value)} autoFocus={autoFocus}
                placeholder={t.nav.searchPlaceholder} aria-label={t.common.search}
                className="h-10 w-full rounded-full border border-line bg-white ps-9 pe-4 text-sm focus:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/20" />
        </form>
    );
};

export const Header = () => {
    const { lang, t } = useI18n();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, ready, signOut } = useSession();
    const { count, hydrated } = useCart();
    const favorites = useFavorites();
    const otherLanguageUrl = useOtherLanguageUrl();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => setMenuOpen(false), [pathname]);

    const links = [
        { href: href(lang, "/shop"), label: t.nav.shop },
        { href: href(lang, "/categories"), label: t.nav.categories },
        { href: `${href(lang, "/shop")}?on_sale=1`, label: t.home.sale.title },
    ];
    const onSale = searchParams.get("on_sale") === "1";
    const isActive = (link: string) =>
        pathname === link.split("?")[0] && link.includes("on_sale=1") === onSale;

    const logout = () => {
        signOut();
        window.location.assign(href(lang));
    };

    return (
        <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur-md">
            <div className="bg-burgundy py-1.5 text-center text-xs text-blush">{t.nav.announcement}</div>
            <div className="container-page flex h-16 items-center gap-4">
                <button type="button" className="-ms-2 rounded-full p-2 text-burgundy md:hidden" aria-label={t.nav.menu}
                    onClick={() => setMenuOpen(true)}>
                    <Icon d={ICONS.menu} />
                </button>

                <Link href={href(lang)} className="shrink-0" aria-label="Flower Shop">
                    <img src="/Logo.svg" alt="Flower Shop" className="h-8 w-auto" />
                </Link>

                <nav className="ms-6 hidden items-center gap-6 md:flex" aria-label="Main">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href}
                            className={`text-sm font-medium transition hover:text-magenta ${isActive(link.href) ? "text-magenta" : "text-ink"}`}>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="ms-auto hidden max-w-xs flex-1 lg:block"><SearchBox /></div>

                <div className="ms-auto flex items-center gap-1 lg:ms-2">
                    {/* A short code instead of the full language name, so the two scripts don't clash in one line. */}
                    <Link href={otherLanguageUrl} aria-label={t.nav.language} title={t.nav.language}
                        className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-burgundy transition hover:border-burgundy/40 hover:bg-blush sm:inline-flex">
                        <Icon d={ICONS.globe} className="size-4" />
                        <span dir="ltr">{lang === "fa" ? "EN" : "فا"}</span>
                    </Link>
                    {ready && user?.is_staff && (
                        <Link href={href(lang, "/admin")} className="hidden rounded-full px-3 py-2 text-sm font-medium text-burgundy hover:bg-blush md:block">
                            {t.nav.admin}
                        </Link>
                    )}
                    <Link href={href(lang, "/favorites")} className="relative hidden rounded-full p-2 text-burgundy hover:bg-blush sm:block"
                        aria-label={t.nav.favorites}>
                        <Icon d={ICONS.heart} />
                        {favorites.hydrated && favorites.ids.length > 0 && (
                            <span className="absolute end-1 top-1 size-2 rounded-full bg-magenta" aria-hidden="true" />
                        )}
                    </Link>
                    <Link href={href(lang, user ? "/account" : "/login")} className="rounded-full p-2 text-burgundy hover:bg-blush"
                        aria-label={user ? t.nav.account : t.nav.login}>
                        <Icon d={ICONS.user} />
                    </Link>
                    <Link href={href(lang, "/bag")} className="relative rounded-full p-2 text-burgundy hover:bg-blush" aria-label={t.nav.bag}>
                        <Icon d={ICONS.bag} />
                        {hydrated && count > 0 && (
                            <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-magenta px-1 text-[11px] font-semibold text-white">
                                {count.toLocaleString(lang)}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            <Drawer anchor={lang === "fa" ? "right" : "left"} open={menuOpen} onClose={() => setMenuOpen(false)}>
                <div className="flex w-80 max-w-[85vw] flex-col gap-6 p-5" dir={lang === "fa" ? "rtl" : "ltr"}>
                    <div className="flex items-center justify-between">
                        <img src="/Logo.svg" alt="Flower Shop" className="h-7 w-auto" />
                        <button type="button" className="rounded-full p-2 text-burgundy" aria-label={t.common.close}
                            onClick={() => setMenuOpen(false)}><Icon d={ICONS.close} /></button>
                    </div>
                    <SearchBox onDone={() => setMenuOpen(false)} />
                    <nav className="flex flex-col" aria-label="Mobile">
                        {[{ href: href(lang), label: t.nav.home }, ...links,
                        { href: href(lang, "/favorites"), label: t.nav.favorites },
                        user ? { href: href(lang, "/account"), label: t.nav.account } : { href: href(lang, "/login"), label: t.nav.login },
                        ...(user?.is_staff ? [{ href: href(lang, "/admin"), label: t.nav.admin }] : []),
                        ].map((link) => (
                            <Link key={link.href} href={link.href} className="border-b border-line py-3 font-medium text-ink">{link.label}</Link>
                        ))}
                        <Link href={otherLanguageUrl} className="border-b border-line py-3 font-medium text-burgundy">{t.nav.language}</Link>
                        {user && (
                            <button type="button" onClick={logout} className="py-3 text-start font-medium text-muted">{t.nav.logout}</button>
                        )}
                    </nav>
                </div>
            </Drawer>
        </header>
    );
};
