import { NextRequest, NextResponse } from "next/server";

const LANGS = ["en", "fa"];
const PROTECTED = ["/account", "/checkout", "/admin"];
const GUEST_ONLY = ["/login", "/register"];

/** Read a JWT payload without verifying it — only used to route; the API enforces access. */
const claims = (token?: string): { is_staff?: boolean; exp?: number } | null => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

const preferredLang = (request: NextRequest) =>
  request.headers.get("accept-language")?.toLowerCase().startsWith("fa") ? "fa" : "en";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const [, first, ...rest] = pathname.split("/");

  // Every page lives under /en or /fa.
  if (!LANGS.includes(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLang(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const lang = first;
  const path = `/${rest.join("/")}`;
  const redirectTo = (target: string) => {
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}${target}`;
    url.search = "";
    return url;
  };

  // Old links from the first version of the shop.
  if (path.startsWith("/dashboard")) return NextResponse.redirect(redirectTo("/account"));
  if (path === "/store" || path.startsWith("/store/")) return NextResponse.redirect(redirectTo("/shop"));

  const access = request.cookies.get("accessToken")?.value;
  const refresh = request.cookies.get("refreshToken")?.value;
  const signedIn = Boolean(access || refresh);

  if (PROTECTED.some((prefix) => path === prefix || path.startsWith(`${prefix}/`)) && !signedIn) {
    const url = redirectTo("/login");
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  if (path.startsWith("/admin") && !claims(access ?? refresh)?.is_staff) {
    return NextResponse.redirect(redirectTo("/account"));
  }

  if (GUEST_ONLY.includes(path) && signedIn) {
    return NextResponse.redirect(redirectTo("/account"));
  }

  return NextResponse.next();
}

export const config = {
  // Skip API routes, Next internals and files with an extension (images, fonts, manifest…).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
