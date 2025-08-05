"use server";

import { httpClient } from "@/lib/http";
import {
  ChangePasswordReqBody,
  ChangePasswordResData,
  GetProfileResData,
  UpdateProfileReqBody,
  UpdateProfileResData,
} from "@/types/account";
import { decodeJWT } from "@/utils/common";
import { setCookie } from "@/utils/storage";

const BASE_PATH = "/accounts";

export async function getProfileAction() {
  return httpClient.get<GetProfileResData>(`${BASE_PATH}/me`);
}

export async function updateProfileAction(body: UpdateProfileReqBody) {
  return httpClient.put<UpdateProfileResData>(`${BASE_PATH}/me`, body);
}

export async function changePasswordAction(body: ChangePasswordReqBody) {
  const response = await httpClient.put<ChangePasswordResData>(
    `${BASE_PATH}/change-password-v2`,
    body,
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
