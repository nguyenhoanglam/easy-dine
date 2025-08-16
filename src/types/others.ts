import { Role } from "@/lib/constants";

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
  title?: string;
  description?: string;
  imageUrl?: string;
  pathname: string;
};
