"use server";

import { httpClient } from "@/lib/http";
import {
  LoginReqBody,
  LoginResData,
  LogoutReqBody,
  RefreshTokenReqBody,
  RefreshTokenResData,
} from "@/types/auth";
import { decodeJWT } from "@/utils/common";
import { getCookie, removeCookie, setCookie } from "@/utils/storage";

const BASE_PATH = "/auth";

async function setTokenCookies({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const accessTokenExpires = decodeJWT(accessToken)!.exp * 1000;
  const refreshTokenExpires = decodeJWT(refreshToken)!.exp * 1000;

  await setCookie("access_token", accessToken, {
    expires: accessTokenExpires,
  });
  await setCookie("refresh_token", refreshToken, {
    expires: refreshTokenExpires,
  });
}

// Must be called from client-side only
export async function loginAction(body: LoginReqBody) {
  const response = await httpClient.post<LoginResData>(
    `${BASE_PATH}/login`,
    body,
    {
      withAuth: false,
    },
  );

  if (response.ok) {
    const { accessToken, refreshToken } = response.data;

    await setTokenCookies({
      accessToken,
      refreshToken,
    });
  }

  return response;
}

export async function logoutAction() {
  const refreshToken = await getCookie("refresh_token");
  const body: LogoutReqBody = {
    refreshToken: refreshToken ?? "",
  };

  const response = await httpClient.post(`${BASE_PATH}/logout`, body);

  await removeCookie("access_token");
  await removeCookie("refresh_token");

  return response;
}

export async function refreshTokenAction() {
  const refreshToken = await getCookie("refresh_token");

  const body: RefreshTokenReqBody = {
    refreshToken: refreshToken ?? "",
  };

  const response = await httpClient.post<RefreshTokenResData>(
    `${BASE_PATH}/refresh-token`,
    body,
  );

  if (response.ok) {
    const { accessToken, refreshToken } = response.data;

    await setTokenCookies({
      accessToken,
      refreshToken,
    });
  }

  return response;
}
