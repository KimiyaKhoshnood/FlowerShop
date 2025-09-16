import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/").filter(Boolean); 
  const lang = segments[0];
  const restPath = "/" + segments.slice(1).join("/");

  if (token && (restPath === "/login" || restPath === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}/dashboard`;
    return NextResponse.redirect(url);
  }

  if (!token && (restPath.startsWith("/dashboard") || restPath.startsWith("/bag"))) {
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}/login`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(fa|en)/dashboard/:path*", "/(fa|en)/(login|register|bag)"],
};