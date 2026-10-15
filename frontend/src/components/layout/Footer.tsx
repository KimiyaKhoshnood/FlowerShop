import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill, href } from "@/lib/text";

export const Footer = ({ lang, t }: { lang: string; t: Dictionary }) => (
    <footer className="mt-24 border-t border-line bg-white">
        <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-4 lg:col-span-2">
                <img src="/Logo.svg" alt="Flower Shop" className="h-9 w-fit" />
                <p className="max-w-sm text-sm text-muted">{t.footer.tagline}</p>
            </div>
            <div>
                <h3 className="mb-3 text-sm font-semibold text-burgundy">{t.footer.shop}</h3>
                <ul className="flex flex-col gap-2 text-sm text-muted">
                    <li><Link className="hover:text-magenta" href={href(lang, "/shop")}>{t.nav.shop}</Link></li>
                    <li><Link className="hover:text-magenta" href={href(lang, "/categories")}>{t.nav.categories}</Link></li>
                    <li><Link className="hover:text-magenta" href={`${href(lang, "/shop")}?on_sale=1`}>{t.home.sale.title}</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="mb-3 text-sm font-semibold text-burgundy">{t.footer.help}</h3>
                <ul className="flex flex-col gap-2 text-sm text-muted">
                    <li><Link className="hover:text-magenta" href={href(lang, "/account")}>{t.nav.account}</Link></li>
                    <li><span>{t.footer.delivery}</span></li>
                    <li><span>{t.footer.care}</span></li>
                    <li><a className="hover:text-magenta" href="mailto:hello@flowershop.example">{t.footer.contact}</a></li>
                </ul>
            </div>
        </div>
        <div className="border-t border-line">
            <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:justify-between">
                <span>{fill(t.footer.rights, new Date().getFullYear())}</span>
                <span>{t.footer.demo}</span>
            </div>
        </div>
    </footer>
);
