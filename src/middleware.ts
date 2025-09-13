import { NextRequest, NextResponse } from "next/server";
import { Links } from "./constants/links";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const { pathname } = request.nextUrl;
  
    if (token && (pathname === Links.login || pathname === Links.register)) {
      const url = request.nextUrl.clone();
      url.pathname = Links.dashboard.base;
      return NextResponse.redirect(url);
    }
  
    if (!token && pathname.startsWith(Links.dashboard.base)) {
      const url = request.nextUrl.clone();
      url.pathname = Links.login;
      return NextResponse.redirect(url);
    }
  
    return NextResponse.next();
  }
  
  export const config = {
    matcher: [`${Links.dashboard.base}/:path*`, Links.login, Links.register]
  };
  