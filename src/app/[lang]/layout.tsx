import { Footer, Header } from "@/components/headerAndFooter";
import ContextProviderLayout from "@/context/context";
import { getDictionary } from "@/dictionaries/dictionaries";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { notFound } from "next/navigation";

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
    <div className="!min-h-screen flex flex-col" lang={resolvedParams.lang} dir={resolvedParams.lang === 'fa' ? 'rtl' : 'ltr'}>
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
