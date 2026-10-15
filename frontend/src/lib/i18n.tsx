"use client";
import { createContext, useContext } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Lang } from "./types";

type I18n = { lang: Lang; t: Dictionary; dir: "ltr" | "rtl" };

const I18nContext = createContext<I18n | null>(null);

export const I18nProvider = ({ lang, dictionary, children }: { lang: Lang; dictionary: Dictionary; children: React.ReactNode }) => (
    <I18nContext.Provider value={{ lang, t: dictionary, dir: lang === "fa" ? "rtl" : "ltr" }}>
        {children}
    </I18nContext.Provider>
);

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) throw new Error("useI18n must be used inside <I18nProvider>");
    return context;
};

// Server Components must import these from "@/lib/text" directly.
export { fill, href } from "./text";
