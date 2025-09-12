import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";
import { Role, SearchParamKey, StorageKey } from "@/lib/constants";

import { decodeToken } from "./lib/utils";

const BASE_ROUTES = {
  auth: ["/login"],
  manager: ["/manage"],
  owner: ["/manage/accounts"],
  guest: ["/guest"],
} as const;

const AUTH_ROUTES = withLocales(BASE_ROUTES.auth);
const MANAGER_ROUTES = withLocales(BASE_ROUTES.manager);
const OWNER_ROUTES = withLocales(BASE_ROUTES.owner);
const GUEST_ROUTES = withLocales(BASE_ROUTES.guest);
const PROTECTED_ROUTES = [...MANAGER_ROUTES, ...GUEST_ROUTES];

function withLocales(routes: readonly string[]) {
  return routes.flatMap((route) => [
    route,
    ...routing.locales.map((locale) => `/${locale}${route}`),
  ]);
}

function getRouteRegex(route: string) {
  return new RegExp(`^${route}(\/|$)`);
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) => getRouteRegex(route).test(pathname));
}

function isManagerRoute(pathname: string) {
  return MANAGER_ROUTES.some((route) => getRouteRegex(route).test(pathname));
}

function isOwnerRoute(pathname: string) {
  return OWNER_ROUTES.some((route) => getRouteRegex(route).test(pathname));
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

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(StorageKey.AccessToken)?.value ?? "";
  const refreshToken =
    request.cookies.get(StorageKey.RefreshToken)?.value ?? "";

  if (isProtectedRoute(pathname)) {
    if (!refreshToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set(SearchParamKey.Token_Expired, "true");
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

    const role = decodeToken(refreshToken)?.role;
    // Invalid token
    if (!role) {
      deleteCookieTokens(request);
      const url = new URL("/login", request.url);
      url.searchParams.set(SearchParamKey.Token_Expired, "true");
      return NextResponse.redirect(url);
    }

    if (
      (role === Role.Guest && isManagerRoute(pathname)) ||
      (role !== Role.Guest && isGuestRoute(pathname)) ||
      (role !== Role.Owner && isOwnerRoute(pathname))
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // i18n routing
  const handleI18nRouting = createMiddleware(routing);
  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
