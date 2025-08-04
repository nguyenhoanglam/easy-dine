import { type ClassValue, clsx } from "clsx";
import currency from "currency.js";
import jwt from "jsonwebtoken";
import { Metadata } from "next";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { HttpStatus, StorageKey } from "@/lib/constants";
import { env } from "@/lib/env";
import { HttpError, HttpResponse } from "@/types/http";
import { PageMetadata } from "@/types/others";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
 * Check if the code is running in a client or server environment.
 */
export function isClient() {
  return typeof window !== "undefined";
}

export function isServer() {
  return typeof window === "undefined";
}

/*
 * Show success and error messages based on the HTTP response.
 */
export function showResponseError<T extends FieldValues>(
  response: HttpError,
  options?: {
    showToast?: boolean;
    setFormError?: UseFormSetError<T>;
  },
) {
  const { showToast = true, setFormError } = options || {};

  if (showToast) {
    toast.error(response.message, { richColors: true });
  }

  if (response.status === HttpStatus.UnprocessableEntity && setFormError) {
    response.errors?.forEach((err) => {
      setFormError(err.field as FieldPath<T>, {
        type: "server",
        message: err.message,
      });
    });
  }
}

export function showResponseSuccess(response: HttpResponse) {
  toast.success(response.message, { richColors: true });
}

/*
 * Local storage and cookie.
 */
type TStorageKey = (typeof StorageKey)[keyof typeof StorageKey];

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

/*
 * Decode JWT token.
 */
export function decodeJWT<T = { exp: number }>(token: string) {
  try {
    return jwt.decode(token) as T;
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}

/*
 * Create metadata for the page.
 */
export function createMetadata({
  title,
  description,
  imageUrl,
  pathname,
}: PageMetadata): Metadata {
  const url = `${env.NEXT_PUBLIC_APP_URL}${pathname}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
      url,
      siteName: "Table Tap",
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: url,
    },
    robots: { index: false, follow: false },
  };
}

export async function formatCurrency(value: number) {
  return currency(value, {
    pattern: "# !",
    decimal: ".",
    precision: 0,
    symbol: "đ",
  }).format();
}
