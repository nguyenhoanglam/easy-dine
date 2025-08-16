export type EntityError = {
  field: string;
  message: string;
};

export interface HttpRequestOptions extends RequestInit {
  baseURL?: string;
  useAuth?: boolean;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export type HttpSuccessRaw<T, E> = {
  ok: true;
  status: number;
  data: { message: string; data: T } & E;
  [key: string]: unknown;
};

export type HttpSuccess<T, E> = {
  ok: true;
  message: string;
  data: T;
} & E;

export type HttpError = {
  ok: false;
  status: number;
  message: string;
  errors?: EntityError[];
  [key: string]: unknown;
};

export type HttpResponse<T = unknown, E = unknown> =
  | HttpSuccess<T, E>
  | HttpError;
