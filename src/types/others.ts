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
