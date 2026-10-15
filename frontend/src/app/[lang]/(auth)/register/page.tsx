import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/account/AuthForms";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const t = await getDictionary((await params).lang);
  return { title: t.auth.register, robots: { index: false } };
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}
