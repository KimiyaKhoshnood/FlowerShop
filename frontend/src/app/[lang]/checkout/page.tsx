import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const t = await getDictionary((await params).lang);
  return { title: t.checkout.title, robots: { index: false } };
}

export default function CheckoutPage() {
  return <CheckoutView />;
}
