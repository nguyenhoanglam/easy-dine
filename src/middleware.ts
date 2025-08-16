import { NextRequest, NextResponse } from "next/server";

import { SearchParamKey, StorageKey } from "@/lib/constants";

import { decodeToken } from "./lib/utils";

const AUTH_ROUTES = ["/login"];
const MANAGER_ROUTES = ["/manage"];
const GUEST_ROUTES = ["/guest"];
const PROTECTED_ROUTES = [...MANAGER_ROUTES, ...GUEST_ROUTES];

function getRouteRegex(route: string) {
  return new RegExp(`^${route}(\/|$)`);
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) => getRouteRegex(route).test(pathname));
}

function isManagerRoute(pathname: string) {
  return MANAGER_ROUTES.some((route) => getRouteRegex(route).test(pathname));
}

function isGuestRoute(pathname: string) {
  return GUEST_ROUTES.some((route) => getRouteRegex(route).test(pathname));
}

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some((route) => getRouteRegex(route).test(pathname));
}

function deleteCookieTokens(request: NextRequest) {
  request.cookies.delete(StorageKey.AccessToken);
  request.cookies.delete(StorageKey.RefreshToken);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(StorageKey.AccessToken)?.value ?? "";
  const refreshToken =
    request.cookies.get(StorageKey.RefreshToken)?.value ?? "";

  if (isProtectedRoute(pathname)) {
    if (!refreshToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set(SearchParamKey.ClearTokens, "true");
      return NextResponse.redirect(url);
    }

    if (!accessToken) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set(SearchParamKey.RefreshToken, refreshToken);
      url.searchParams.set(SearchParamKey.Redirect, pathname);

      return NextResponse.redirect(url);
    }
  }

  if (refreshToken) {
    if (isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isProtectedRoute(pathname) && !accessToken) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set(SearchParamKey.RefreshToken, refreshToken);
      url.searchParams.set(SearchParamKey.Redirect, pathname);

      return NextResponse.redirect(url);
    }

    const role = decodeToken(refreshToken)?.role;
    // Invalid tokenf
    if (!role) {
      deleteCookieTokens(request);
      const url = new URL("/login", request.url);
      url.searchParams.set(SearchParamKey.ClearTokens, "true");
      return NextResponse.redirect(url);
    }

    if (
      (role === "Guest" && isManagerRoute(pathname)) ||
      (role !== "Guest" && isGuestRoute(pathname))
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
