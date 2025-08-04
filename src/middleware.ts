import { NextRequest, NextResponse } from "next/server";

import { StorageKey } from "@/lib/constants";

const AUTH_ROUTES = ["/login"];
const PRIVATE_ROUTES = [
  "/manage/dashboard",
  "/manage/settings",
  "/settings",
  "/orders",
];

const PRIVATE_ROUTE_REGEXES = [/^\/orders\/\d+/];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.includes(pathname);
}

function isPrivateRoute(pathname: string) {
  if (PRIVATE_ROUTES.includes(pathname)) {
    return true;
  }

  return PRIVATE_ROUTE_REGEXES.some((regex) => pathname.match(regex));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(StorageKey.AccessToken)?.value ?? "";
  const refreshToken =
    request.cookies.get(StorageKey.RefreshToken)?.value ?? "";

  if (isPrivateRoute(pathname)) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!accessToken) {
      const url = new URL("/logout", request.url);
      url.searchParams.set(StorageKey.RefreshToken, refreshToken);

      return NextResponse.redirect(url);
    }
  }

  if (isAuthRoute(pathname) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
