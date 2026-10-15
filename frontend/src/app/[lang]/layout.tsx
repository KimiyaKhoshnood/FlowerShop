import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display, Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getDictionary, isLang } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/config";
import { Providers } from "./providers";

const body = Geist({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const heading = Playfair_Display({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
// Vazirmatn: the clean, widely used Persian UI typeface.
const persian = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-persian", display: "swap" });

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = await getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: `%s | ${lang === "fa" ? "گل‌فروشی" : "Flower Shop"}` },
    description: t.meta.description,
    manifest: "/manifest.json",
    alternates: { languages: { en: "/en", fa: "/fa" } },
    openGraph: { type: "website", siteName: "Flower Shop", locale: lang === "fa" ? "fa_IR" : "en_US" },
  };
}

export const viewport: Viewport = { themeColor: "#4e0629" };

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dictionary = await getDictionary(lang);
  const fonts = lang === "fa"
    ? `${persian.variable} [--font-body:var(--font-persian)] [--font-heading:var(--font-persian)]`
    : `${body.variable} ${heading.variable}`;

  return (
    <html lang={lang} dir={lang === "fa" ? "rtl" : "ltr"} className={fonts}>
      <body className="flex min-h-screen flex-col">
        <Providers lang={lang} dictionary={dictionary}>
          <Suspense>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer lang={lang} t={dictionary} />
        </Providers>
      </body>
    </html>
  );
}
