import { Footer, Header } from "@/components/headerAndFooter";
import ContextProviderLayout from "@/context/context";
import { getDictionary } from "@/i18n/dictionaries";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flower Shop",
  manifest: "/manifest.json",
};

const iranSans = localFont({
  src: "../../../public/fonts/MbSansFont_Medium.ttf",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function Layout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>
}>) {
  const resolvedParams = await params

  if (!['fa', 'en'].includes(resolvedParams.lang)) {
    notFound();
  }


  const dictionary = await getDictionary(resolvedParams.lang)

  return (
    <div className={`${resolvedParams.lang == 'fa' ? iranSans.className : (geistSans.variable, geistMono.variable)} antialiased !min-h-screen flex flex-col`} lang={resolvedParams.lang} dir={resolvedParams.lang === 'fa' ? 'rtl' : 'ltr'}>
      <ContextProviderLayout>
        <LanguageProvider dictionary={dictionary} lang={resolvedParams.lang}>
          <Header />
          <div className="flex-1 h-full grow-1">{children}</div>
          <hr className="text-gray-300 w-full" />
          <Footer />
        </LanguageProvider>
      </ContextProviderLayout>
    </div>
  );
}
