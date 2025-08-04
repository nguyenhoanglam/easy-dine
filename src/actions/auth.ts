"use server";

import { httpClient } from "@/lib/http";
import { decodeJWT, getCookie, removeCookie, setCookie } from "@/lib/utils";
import { LoginReqBody, LoginResData, LogoutReqBody } from "@/types/auth";

const BASE_PATH = "/auth";

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
    const accessTokenExpiry = decodeJWT(accessToken)?.exp;
    const refreshTokenExpiry = decodeJWT(refreshToken)?.exp;

    await setCookie("access_token", accessToken, {
      expires: accessTokenExpiry ? accessTokenExpiry * 1000 : undefined,
    });
    await setCookie("refresh_token", refreshToken, {
      expires: refreshTokenExpiry ? refreshTokenExpiry * 1000 : undefined,
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
