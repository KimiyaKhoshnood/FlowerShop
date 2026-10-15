/** Where the Django API lives. Used both in the browser and on the Next.js server. */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

/** Public URL of this site, for canonical links and the sitemap. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const LANGS = ["en", "fa"] as const;
export const DEFAULT_LANG = "en";

export const FREE_SHIPPING_FROM = 50;
