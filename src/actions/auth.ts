"use server";

import { getCookie, removeAuthCookie, setAuthCookie } from "@/helpers/storage";
import { httpClient } from "@/lib/http";
import {
  LoginReqBody,
  LoginResData,
  LogoutReqBody,
  RefreshTokenReqBody,
  RefreshTokenResData,
} from "@/types/auth";

const basePath = "/auth";

// Must be called from client-side only
export async function loginAction(body: LoginReqBody) {
  const response = await httpClient.post<LoginResData>(
    `${basePath}/login`,
    body,
    {
      withAuth: false,
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
  );

  if (response.ok) {
    const { accessToken, refreshToken } = response.data;
    await setAuthCookie({ accessToken, refreshToken });
  }

  return response;
}
