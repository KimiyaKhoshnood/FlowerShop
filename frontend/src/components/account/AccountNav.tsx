"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fill, href, useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { Button } from "../ui/Button";

export const AccountNav = () => {
    const { lang, t } = useI18n();
    const pathname = usePathname();
    const { user, signOut } = useSession();

    const tabs = [
        { href: href(lang, "/account"), label: t.account.orders, active: pathname === href(lang, "/account") || pathname.includes("/account/orders") },
        { href: href(lang, "/account/profile"), label: t.account.profile, active: pathname.endsWith("/account/profile") },
    ];

    return (
        <div className="flex flex-col gap-6 border-b border-line pb-0">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="eyebrow">{t.account.title}</p>
                    <h1 className="heading-display mt-1 text-4xl">{user?.username ? fill(t.account.hello, user.username) : t.account.title}</h1>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { signOut(); window.location.assign(href(lang)); }}>
                    {t.nav.logout}
                </Button>
            </div>
            <nav className="-mb-px flex gap-6">
                {tabs.map((tab) => (
                    <Link key={tab.href} href={tab.href}
                        className={`border-b-2 pb-3 text-sm font-medium transition ${tab.active ? "border-magenta text-burgundy" : "border-transparent text-muted hover:text-ink"}`}>
                        {tab.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
};
