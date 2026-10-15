import type { Metadata } from "next";
import { BagView } from "@/components/checkout/BagView";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const t = await getDictionary((await params).lang);
  return { title: t.bag.title, robots: { index: false } };
}

export default function BagPage() {
  return <BagView />;
}
