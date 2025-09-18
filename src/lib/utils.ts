import { UseQueryResult } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import currency from "currency.js";
import { format } from "date-fns";
import { convert } from "html-to-text";
import { decodeJwt } from "jose";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { Metadata } from "next";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { defaultLocale } from "@/i18n/config";
import {
  DishStatus,
  HttpStatus,
  OrderStatus,
  TableStatus,
} from "@/lib/constants";
import { env } from "@/lib/env";
import { HttpError, HttpResponse } from "@/types/http";
import { TokenPayload } from "@/types/jwt";
import { DateFormatPattern, PageMetadata, PaginatedData } from "@/types/others";

/*
 * UI
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showResponseSuccess(response: HttpResponse) {
  toast.success(response.message, { richColors: true });
}

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

/*
 * Metadata can be generated only in server components
 */
export function createMetadata({
  title,
  description,
  imageUrl,
  pathname,
  robots,
}: PageMetadata): Metadata {
  const url = `${env.NEXT_PUBLIC_APP_URL}${pathname}`;

  return {
    title,
    description,
    openGraph: {
      title,
      ...(description
        ? { description: htmlToDescriptionText(description) }
        : undefined),
      images: imageUrl
        ? [{ url: imageUrl }]
        : [{ url: `${env.NEXT_PUBLIC_APP_URL}/banner.jpg` }],
      url,
      siteName: "Easy Dine",
      locale: "vi_VN",
      alternateLocale: ["en_US"],
      type: "website",
    },
    alternates: {
      canonical: url,
    },
    ...(robots && { robots }),
  };
}

export function decodeToken(token: string) {
  try {
    return decodeJwt<TokenPayload>(token);
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}

export function formatCurrency(value: number) {
  return currency(value, {
    pattern: "# !",
    decimal: ".",
    precision: 0,
    symbol: "đ",
  }).format();
}

export const removeDiacritics = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

export const matchesSearchQuery = (
  fullText: string,
  searchText: string | null | undefined,
) => {
  if (
    searchText === null ||
    searchText === undefined ||
    searchText.trim() === ""
  ) {
    return true;
  }

  const fullTextLower = removeDiacritics(fullText.toLowerCase());
  const searchTextLower = removeDiacritics(searchText.trim().toLowerCase());

  return fullTextLower.includes(searchTextLower);
};

/*
 * Return data from query result for tables
 * If the query result is successful, it returns the data array.
 * If the query result is not successful, it returns an empty array.
 */
export function getTableQueryResult<T>(
  queryResult: UseQueryResult<HttpResponse<T[]>>,
): { data: T[]; totalItem: number } {
  if (queryResult.data && queryResult.data.ok) {
    const { data } = queryResult.data;
    return { data, totalItem: data.length };
  }

  return { data: [], totalItem: 0 };
}

export function getQueryResult<T>(
  queryResult: UseQueryResult<HttpResponse<T>>,
): T | null {
  if (queryResult.data && queryResult.data.ok) {
    return queryResult.data.data;
  }

  return null;
}

/*
 * Return paginated data from query result for tables
 * If the query result is successful, it returns the paginated data.
 * If the query result is not successful, it returns an empty paginated data.
 */
export function getTablePaginatedQueryData<T>(
  queryResult: UseQueryResult<HttpResponse<PaginatedData<T>>>,
): PaginatedData<T> {
  if (queryResult.data && queryResult.data.ok) {
    const { items, limit, page, totalItem, totalPage } = queryResult.data.data;

    return {
      items,
      limit,
      page,
      totalItem,
      totalPage,
    };
  }

  return {
    items: [],
    limit: 0,
    page: 0,
    totalItem: 0,
    totalPage: 0,
  };
}

export function getVietnameseDishStatus(
  status: (typeof DishStatus)[keyof typeof DishStatus],
) {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
}

export function getVietnameseOrderStatus(
  status: (typeof OrderStatus)[keyof typeof OrderStatus],
) {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    default:
      return "Từ chối";
  }
}

export function getVietnameseTableStatus(
  status: (typeof TableStatus)[keyof typeof TableStatus],
) {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
}

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};

export const formatDate = (
  date: string | Date,
  pattern: DateFormatPattern = "HH:mm:ss dd/MM/yyyy",
) => {
  return format(date instanceof Date ? date : new Date(date), pattern);
};

export function createQueryString(
  params: Record<string, string | number | boolean | null | undefined>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function getTableLink({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) {
  return (
    env.NEXT_PUBLIC_APP_URL +
    `/${defaultLocale}/tables/` +
    tableNumber +
    "?token=" +
    token
  );
}

export function getGoogleOauthUrl() {
  const url = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: env.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(options);
  return `${url}?${qs.toString()}`;
}

export function generateSlugUrl({ name, id }: { name: string; id: number }) {
  return `${slugify(name)}-i.${id}`;
}

export function parseIdFromSlugUrl(slug: string) {
  return Number(slug.split("-i.").pop());
}

export function htmlToDescriptionText(html: string) {
  return convert(html, {
    limits: { maxInputLength: 140 },
  });
}
