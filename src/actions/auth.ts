"use server";

import { getCookie, removeAuthCookie, setAuthCookie } from "@/helpers/storage";
import { HttpStatus } from "@/lib/constants";
import { httpClient } from "@/lib/http";
import {
  LoginReqBody,
  LoginResData,
  LogoutReqBody,
  RefreshTokenReqBody,
  RefreshTokenResData,
} from "@/types/auth";
import { HttpResponse } from "@/types/http";

const basePath = "/auth";

// Must be called from client-side only
export async function loginAction(body: LoginReqBody) {
  const response = await httpClient.post<LoginResData>(
    `${basePath}/login`,
    body,
    {
      useAuth: false,
    },
  );

  if (response.ok) {
    const { accessToken, refreshToken } = response.data;
    await setAuthCookie({ accessToken, refreshToken });
  }

  return response;
}

export async function logoutAction() {
  const refreshToken = await getCookie("refresh_token");
  const body: LogoutReqBody = {
    refreshToken: refreshToken ?? "",
  };

  const response = await httpClient.post(`${basePath}/logout`, body);
  await removeAuthCookie();

  return response;
}

export async function refreshTokenAction() {
  const refreshToken = await getCookie("refresh_token");
  const body: RefreshTokenReqBody = {
    refreshToken: refreshToken ?? "",
  };

  const response = await httpClient.post<RefreshTokenResData>(
    `${basePath}/refresh-token`,
    body,
    { useAuth: false },
  );

  if (response.ok) {
    const { accessToken, refreshToken } = response.data;
    await setAuthCookie({ accessToken, refreshToken });
  }

  return response;
}

export async function setTokensToCookieAction({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}): Promise<HttpResponse> {
  try {
    await setAuthCookie({ accessToken, refreshToken });

    return {
      ok: true,
      message: "Đăng nhập thành công.",
      data: { accessToken, refreshToken },
    };
  } catch (error) {
    return {
      ok: false,
      status: HttpStatus.InternalServerError,
      message: error instanceof Error ? error.message : "Đăng nhập thất bại.",
    };
  }
}
