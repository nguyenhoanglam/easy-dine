import chalk from "chalk";
import { redirect } from "next/navigation";

import { getCookie } from "@/helpers/storage";
import { HttpStatus, SearchParamKey } from "@/lib/constants";
import { env } from "@/lib/env";
import {
  EntityError,
  HttpError,
  HttpRequestOptions,
  HttpResponse,
  HttpSuccess,
  HttpSuccessRaw,
} from "@/types/http";

const IGNORE_UNAUTHORIZED_PATHS = ["/auth/logout"];

/*
 * HttpClient must be called only from server-side because it uses cookies.
 * Client-side should call server action instead.
 */
class HttpClient {
  private getURL(endpoint: string, baseURL?: string) {
    // Use endpoint as is if it starts with "http" or if baseURL is empty
    if (endpoint.startsWith("http") || baseURL === "") {
      return endpoint;
    }

    let finalBaseURL = baseURL || env.NEXT_PUBLIC_API_URL;

    if (finalBaseURL.endsWith("/")) {
      finalBaseURL = finalBaseURL.slice(0, -1);
    }

    if (endpoint.startsWith("/")) {
      return `${finalBaseURL}${endpoint}`;
    }

    return `${finalBaseURL}/${endpoint}`;
  }

  private async getHeaders(options: HttpRequestOptions) {
    const { body, headers: _headers, withAuth = true } = options;

    const headers: Record<string, unknown> = {
      ..._headers,
    };

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (withAuth) {
      const accessToken = await getCookie("access_token");

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return headers as HeadersInit;
  }

  private getBody(data: unknown): BodyInit {
    if (data instanceof FormData) {
      return data as FormData;
    }

    return JSON.stringify(data || {});
  }

  private createAbortController(timeout: number): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private parseNetworkError(error: unknown): HttpError {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Request timed out";
      } else if (error.message === "Failed to fetch") {
        errorMessage = "Network error, please check your connection";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      ok: false,
      status: HttpStatus.NetworkError,
      message: errorMessage,
    };
  }

  private log({
    method = "GET",
    endpoint,
    status,
  }: {
    method?: string;
    endpoint: string;
    status: number;
  }) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `${method} ${endpoint} ${status >= 400 ? chalk.red(status) : chalk.green(status)}`,
      );
    }
  }

  private flattenSuccessResponse<T, E extends object>(
    res: HttpSuccessRaw<T, E>,
  ): HttpSuccess<T, E> {
    const { message: outerMessage, data: outerData, ...outerRest } = res;

    if (outerData && typeof outerData === "object" && "data" in outerData) {
      const {
        message: innerMessage,
        data: innerData,
        ...extras
      } = outerData as { message: string; data: T } & E;

      return {
        ...outerRest,
        ...extras,
        message: innerMessage || outerMessage,
        data: innerData,
      } as unknown as HttpSuccess<T, E>;
    }

    return {
      ...outerRest,
      message: outerMessage,
      data: outerData as T,
    } as unknown as HttpSuccess<T, E>;
  }

  private async parseResponse<T, E>(
    response: Response,
    options: HttpRequestOptions,
  ): Promise<HttpResponse<T, E>> {
    const { withAuth = true } = options;

    let data: unknown;

    try {
      data = await response.json();
    } catch {
      return {
        ok: false,
        status: HttpStatus.InternalServerError,
        message: "Invalid response format",
      };
    }
    console.log(1111);
    console.log(response);
    if (!response.ok) {
      // Don't redirect for `/auth/logout` endpoint or public endpoints
      // This allows request caller can handle the response and implement logout fllow
      if (response.status === HttpStatus.Unauthorized) {
        const { pathname } = new URL(response.url);

        this.log({
          method: options.method,
          endpoint: response.url,
          status: response.status,
        });

        if (!IGNORE_UNAUTHORIZED_PATHS.includes(pathname) && withAuth) {
          throw new Error("UNAUTHORIZED");
        }
      }

      if (data && typeof data === "object") {
        const { message, errors } = data as Record<string, unknown>;

        return {
          ok: false,
          status: response.status,
          message: message as string,
          ...(errors && Array.isArray(errors)
            ? { errors: errors as EntityError[] }
            : {}),
        };
      }

      return {
        ok: false,
        status: response.status,
        message: String(data),
      };
    }

    const {
      message: _message,
      data: _data,
      ...fields
    } = data as Record<string, unknown>;

    if (typeof _data !== "object") {
      return {
        ok: true,
        status: response.status,
        message: _message as string,
        data: _data as T,
      } as unknown as HttpSuccess<T, E>;
    }

    return this.flattenSuccessResponse({
      ok: true,
      status: response.status,
      data: {
        message: _message as string,
        data: _data as T,
        ...(fields as E),
      },
    });
  }

  private async makeRequest<T, E>(
    endpoint: string,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T, E>> {
    const {
      baseURL,
      timeout = 10000,
      retries = 0,
      retryDelay = 1000,
      ...requestOptions
    } = options;

    const url = this.getURL(endpoint, baseURL);
    const headers = await this.getHeaders(options);
    const controller = this.createAbortController(timeout);

    const requestConfig: RequestInit = {
      ...requestOptions,
      headers,
      signal: controller.signal,
    };

    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const fetchResponse = await fetch(url, requestConfig);
        const response = await this.parseResponse<T, E>(fetchResponse, options);

        this.log({
          method: requestConfig.method,
          endpoint: url,
          status: fetchResponse.status,
        });

        return response;
      } catch (error: unknown) {
        // Unauthorized error
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
          const refreshToken = await getCookie("refresh_token");
          redirect(`/logout?${SearchParamKey.RefreshToken}=${refreshToken}`);
        }

        // Network error
        lastError = error;
        if (attempt < retries) {
          await this.sleep(retryDelay * Math.pow(2, attempt));
        }
      }
    }

    return this.parseNetworkError(lastError);
  }

  async get<T, E = object>(
    endpoint: string,
    options: Omit<HttpRequestOptions, "method" | "body"> = {},
  ): Promise<HttpResponse<T, E>> {
    return this.makeRequest<T, E>(endpoint, { ...options, method: "GET" });
  }

  async post<T, E = object>(
    endpoint: string,
    data?: unknown,
    options: Omit<HttpRequestOptions, "method"> = {},
  ): Promise<HttpResponse<T, E>> {
    return this.makeRequest<T, E>(endpoint, {
      ...options,
      method: "POST",
      body: this.getBody(data),
    });
  }

  async put<T, E = object>(
    endpoint: string,
    data?: unknown,
    options: Omit<HttpRequestOptions, "method"> = {},
  ): Promise<HttpResponse<T, E>> {
    return this.makeRequest<T, E>(endpoint, {
      ...options,
      method: "PUT",
      body: this.getBody(data),
    });
  }

  async patch<T, E = object>(
    endpoint: string,
    data?: unknown,
    options: Omit<HttpRequestOptions, "method"> = {},
  ): Promise<HttpResponse<T, E>> {
    return this.makeRequest<T, E>(endpoint, {
      ...options,
      method: "PATCH",
      body: this.getBody(data),
    });
  }

  async delete<T, E = object>(
    endpoint: string,
    options: Omit<HttpRequestOptions, "method" | "body"> = {},
  ): Promise<HttpResponse<T, E>> {
    return this.makeRequest<T, E>(endpoint, { ...options, method: "DELETE" });
  }
}

export const httpClient = new HttpClient();
