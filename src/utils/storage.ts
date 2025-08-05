import { StorageKey } from "@/lib/constants";

type TStorageKey = (typeof StorageKey)[keyof typeof StorageKey];

export function isClient() {
  return typeof window !== "undefined";
}

export function isServer() {
  return typeof window === "undefined";
}

export async function getCookie(key: TStorageKey) {
  if (isServer()) {
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
  if (isServer()) {
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
  if (isServer()) {
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

export function getLocalStorage(key: TStorageKey) {
  if (isClient()) {
    return localStorage.getItem(key);
  }

  return null;
}

export function setLocalStorage(key: TStorageKey, value: string) {
  if (isClient()) {
    localStorage.setItem(key, value);
  }
}

export function removeLocalStorage(key: TStorageKey) {
  if (isClient()) {
    localStorage.removeItem(key);
  }
}
