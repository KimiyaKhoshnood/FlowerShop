"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { href, useI18n } from "@/lib/i18n";

export const AdminNav = () => {
    const { lang, t } = useI18n();
    const pathname = usePathname();
    const base = href(lang, "/admin");
    const links = [
        { href: base, label: t.admin.overview, icon: "📊" },
        { href: `${base}/orders`, label: t.admin.orders, icon: "🧾" },
        { href: `${base}/products`, label: t.admin.products, icon: "🌷" },
        { href: `${base}/categories`, label: t.admin.categories, icon: "🗂️" },
        { href: `${base}/discounts`, label: t.admin.discounts, icon: "🏷️" },
    ];
    const isActive = (link: string) => (link === base ? pathname === base : pathname.startsWith(link));

    return (
        <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow mb-3">{t.admin.title}</p>
            <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
                {links.map((link) => (
                    <Link key={link.href} href={link.href}
                        className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive(link.href) ? "bg-burgundy text-white" : "text-ink/80 hover:bg-blush"}`}>
                        <span aria-hidden="true">{link.icon}</span>{link.label}
                    </Link>
                ))}
                <Link href={href(lang, "/shop")} className="mt-0 shrink-0 rounded-xl px-3 py-2.5 text-sm text-muted hover:text-magenta lg:mt-4">
                    <span className="inline-block rtl:-scale-x-100">←</span> {t.admin.backToShop}
                </Link>
            </nav>
        </aside>
    );
};

export const AdminHeader = ({ title, action }: { title: string; action?: React.ReactNode }) => (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="heading-display text-3xl">{title}</h1>
        {action}
    </div>
);
