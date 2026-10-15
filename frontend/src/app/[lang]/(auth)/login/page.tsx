import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/account/AuthForms";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const t = await getDictionary((await params).lang);
  return { title: t.auth.login, robots: { index: false } };
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
