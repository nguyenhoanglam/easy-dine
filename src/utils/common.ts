import currency from "currency.js";
import jwt from "jsonwebtoken";
import { Metadata } from "next";

import { env } from "@/lib/env";
import { PageMetadata } from "@/types/others";

export function decodeJWT<T = { exp: number; iat: number }>(token: string) {
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

export function createUniqueRunning<
  T extends (...args: unknown[]) => ReturnType<T>,
>(fn: T): T {
  let running = false;

  return ((...args: Parameters<T>) => {
    if (running) {
      return;
    }

    try {
      running = true;
      fn(...args);
    } finally {
      running = false;
    }
  }) as unknown as T;
}
