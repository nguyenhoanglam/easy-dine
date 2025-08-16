"use server";

import { getCookie, setAuthCookie } from "@/helpers/storage";
import { httpClient } from "@/lib/http";
import {
  GuestCreateOrdersReqBody,
  GuestCreateOrdersResData,
  GuestGetOrderListResData,
  GuestLoginReqBody,
  GuestLoginResData,
  GuestLogoutReqBody,
  GuestRefreshTokenReqBody,
  GuestRefreshTokenResData,
} from "@/types/guest";

const basePath = "/guest";

export async function guestLoginAction(body: GuestLoginReqBody) {
  const response = await httpClient.post<GuestLoginResData>(
    `${basePath}/auth/login`,
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

export async function guestLogoutAction(body: GuestLogoutReqBody) {
  return httpClient.post<void>(`${basePath}/auth/logout`, body, {
    useAuth: false,
  });
}

export async function guestRefreshTokenAction() {
  const refreshToken = await getCookie("refresh_token");
  const body: GuestRefreshTokenReqBody = {
    refreshToken: refreshToken ?? "",
  };

  const response = await httpClient.post<GuestRefreshTokenResData>(
    `${basePath}/auth/refresh-token`,
    body,
    { useAuth: false },
  );

  if (response.ok) {
    const { accessToken, refreshToken } = response.data;
    await setAuthCookie({ accessToken, refreshToken });
  }

  return response;
}

export async function guestGetOrderListAction() {
  return httpClient.get<GuestGetOrderListResData>(`${basePath}/orders`);
}

export async function guestCreateOrdersAction(body: GuestCreateOrdersReqBody) {
  return httpClient.post<GuestCreateOrdersResData>(`${basePath}/orders`, body);
}
