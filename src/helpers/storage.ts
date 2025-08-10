import { StorageKey } from "@/lib/constants";
import { decodeJWT } from "@/lib/utils";

type TStorageKey = (typeof StorageKey)[keyof typeof StorageKey];

export const isClient = typeof window !== "undefined";

export const isServer = typeof window === "undefined";

/*
 * Cookie
 * These functions are only available on the server-side.
 */
export async function getCookie(key: TStorageKey) {
  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    return cookieStore.get(key)?.value ?? null;
  }

  return null;
}

export async function setCookie(
  key: TStorageKey,
  value: string,
  options?: { httpOnly?: boolean; expires?: number | Date },
) {
  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    const { httpOnly = true, expires } = options || {};
    cookieStore.set({
      name: key,
      value,
      path: "/",
      httpOnly,
      sameSite: "lax",
      secure: true,
      expires,
    });
  }
}

export async function removeCookie(key: TStorageKey) {
  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.set({
      name: key,
      value: "",
      httpOnly: true,
      expires: new Date(0),
    });
  }
}

export async function setAuthCookie({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const accessTokenExpiry = decodeJWT(accessToken)?.exp;
  const refreshTokenExpiry = decodeJWT(refreshToken)?.exp;

  await setCookie("access_token", accessToken, {
    expires: accessTokenExpiry ? accessTokenExpiry * 1000 : undefined,
  });

  await setCookie("refresh_token", refreshToken, {
    expires: refreshTokenExpiry ? refreshTokenExpiry * 1000 : undefined,
  });
}

export async function removeAuthCookie() {
  await removeCookie("access_token");
  await removeCookie("refresh_token");
}

/*
 * Local storage
 * These functions are only available on the client-side.
 */
export function getLocalStorage(key: TStorageKey) {
  if (isClient) {
    return localStorage.getItem(key);
  }

  return null;
}

export function setLocalStorage(key: TStorageKey, value: string) {
  if (isClient) {
    localStorage.setItem(key, value);
  }
}

export function removeLocalStorage(key: TStorageKey) {
  if (isClient) {
    localStorage.removeItem(key);
  }
}

export function setAuthLocalStorage({
  accessToken,
  refreshToken,
  account,
}: {
  accessToken: string;
  refreshToken: string;
  account?: Record<string, unknown>;
}) {
  setLocalStorage("access_token", accessToken);
  setLocalStorage("refresh_token", refreshToken);

  if (account) {
    setLocalStorage("account", JSON.stringify(account));
  }
}

export function removeAuthLocalStorage() {
  removeLocalStorage("access_token");
  removeLocalStorage("refresh_token");
  removeLocalStorage("account");
}
