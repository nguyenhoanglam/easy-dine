import { UseQueryResult } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import currency from "currency.js";
import jwt from "jsonwebtoken";
import { Metadata } from "next";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import {
  DishStatus,
  HttpStatus,
  OrderStatus,
  TableStatus,
} from "@/lib/constants";
import { env } from "@/lib/env";
import { HttpError, HttpResponse } from "@/types/http";
import { TokenPayload } from "@/types/jwt";
import { PageMetadata, PaginatedData, Role } from "@/types/others";

/*
 * UI
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function showResponseSuccess(response: HttpResponse) {
  toast.success(response.message, { richColors: true });
}

export function decodeToken(token: string) {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}

/*
 * Metadata
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

/*
 * Return data from query result for tables
 * If the query result is successful, it returns the data array.
 * If the query result is not successful, it returns an empty array.
 */
export function getTableQueryData<T>(
  queryResult: UseQueryResult<HttpResponse<T[]>>,
): T[] {
  if (queryResult.data && queryResult.data.ok) {
    return queryResult.data.data;
  }

  return [];
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

export function getTableLink({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) {
  return env.NEXT_PUBLIC_APP_URL + "/tables/" + tableNumber + "?token=" + token;
}
