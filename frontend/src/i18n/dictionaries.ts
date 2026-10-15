import "server-only";
import type en from "./en.json";
import type { Lang } from "@/lib/types";

export type Dictionary = typeof en;

const dictionaries: Record<Lang, () => Promise<Dictionary>> = {
    en: () => import("./en.json").then((module) => module.default),
    fa: () => import("./fa.json").then((module) => module.default as Dictionary),
};

export const isLang = (value: string): value is Lang => value === "en" || value === "fa";

export const getDictionary = (lang: string) => dictionaries[isLang(lang) ? lang : "en"]();
