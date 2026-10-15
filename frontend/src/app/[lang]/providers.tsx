"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { CartProvider } from "@/lib/cart";
import { FavoritesProvider } from "@/lib/favorites";
import { I18nProvider } from "@/lib/i18n";
import { SessionProvider } from "@/lib/session";
import { ToastProvider } from "@/lib/toast";
import type { Lang } from "@/lib/types";

export const Providers = ({ lang, dictionary, children }: { lang: Lang; dictionary: Dictionary; children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
    }));
    const [theme] = useState(() => createTheme({
        direction: lang === "fa" ? "rtl" : "ltr",
        palette: { primary: { main: "#dc466a" }, secondary: { main: "#4e0629" } },
        typography: { fontFamily: "inherit" },
        shape: { borderRadius: 12 },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <I18nProvider lang={lang} dictionary={dictionary}>
                    <SessionProvider>
                        <CartProvider>
                            <FavoritesProvider>
                                <ToastProvider>{children}</ToastProvider>
                            </FavoritesProvider>
                        </CartProvider>
                    </SessionProvider>
                </I18nProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
};
