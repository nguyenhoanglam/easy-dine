import { Robots } from "next/dist/lib/metadata/types/metadata-types";

import { Locale } from "@/i18n/config";
import { Role } from "@/lib/constants";

import enTranslation from "../../messages/en.json";

export type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
  modal?: React.ReactNode | null;
};

export type PageProps<T extends object = object> = {
  params: Promise<{ locale: string } & T>;
};

export type I18nSchemaKeys = keyof typeof enTranslation.Schema;

export type I18nNavItemsKeys = keyof typeof enTranslation.NavItems;

export type I18nNavLinksKeys = keyof typeof enTranslation.NavLinks;

export type Role = (typeof Role)[keyof typeof Role];

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedData<T> = {
  items: T[];
  limit: number;
  page: number;
  totalPage: number;
  totalItem: number;
};

export type PageMetadata = {
  title: string;
  description?: string;
  imageUrl?: string;
  pathname?: string;
  robots?: Robots | string | null | undefined;
};

export type DateFormatPattern =
  | "HH:mm:ss dd/MM/yyyy"
  | "HH:mm:ss"
  | "yyyy-MM-dd'T'HH:mm"
  | "dd";
