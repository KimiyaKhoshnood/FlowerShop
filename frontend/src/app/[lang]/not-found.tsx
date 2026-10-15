"use client";
import { ButtonLink } from "@/components/ui/Button";
import { href, useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { lang, t } = useI18n();
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-5 py-16 text-center">
      <img src="/404.svg" alt="" width={360} height={194} className="max-w-full" />
      <h1 className="heading-display text-3xl">{t.notFound.title}</h1>
      <p className="text-muted">{t.notFound.text}</p>
      <ButtonLink href={href(lang, "/shop")}>{t.notFound.cta}</ButtonLink>
    </div>
  );
}
