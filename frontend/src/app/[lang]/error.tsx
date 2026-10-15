"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <img src="/tulipSvg.svg" alt="" className="size-16 opacity-60" />
      <h1 className="heading-display text-3xl">{t.errorPage.title}</h1>
      <p className="max-w-md text-muted">{t.errorPage.text}</p>
      <Button onClick={reset}>{t.common.retry}</Button>
    </div>
  );
}
