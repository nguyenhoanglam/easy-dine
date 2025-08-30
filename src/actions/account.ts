"use server";

import { setAuthCookie } from "@/helpers/storage";
import { httpClient } from "@/lib/http";
import { createQueryString } from "@/lib/utils";
import {
  ChangePasswordReqBody,
  ChangePasswordResData,
  CreateEmployeeAccountReqBody,
  CreateEmployeeAccountResData,
  CreateGuestAccountReqBody,
  CreateGuestAccountResData,
  GetAccountListResData,
  GetAccountProfileResData,
  GetGuestListResData,
  GetProfileResData,
  GuestListQueryParams,
  UpdateEmployeeAccountReqBody,
  UpdateEmployeeAccountResData,
  UpdateProfileReqBody,
  UpdateProfileResData,
} from "@/types/account";

const basePath = "/accounts";

/*
 * Account
 */
export async function getAccountListAction() {
  return httpClient.get<GetAccountListResData>(basePath);
}

export async function getAccountProfileAction(id: number) {
  return httpClient.get<GetAccountProfileResData>(`${basePath}/detail/${id}`);
}

/*
 * Profile
 */
export async function getProfileAction() {
  return httpClient.get<GetProfileResData>(`${basePath}/me`);
}

export async function updateProfileAction(body: UpdateProfileReqBody) {
  return httpClient.put<UpdateProfileResData>(`${basePath}/me`, body);
}

export async function changePasswordAction(body: ChangePasswordReqBody) {
  const response = await httpClient.put<ChangePasswordResData>(
    `${basePath}/change-password-v2`,
    body,
  );

  if (response.ok) {
    const { accessToken, refreshToken } = response.data;
    setAuthCookie({ accessToken, refreshToken });
  }

  return response;
}

/*
 * Employee
 */
export async function createEmployeeAccountAction(
  body: CreateEmployeeAccountReqBody,
) {
  return httpClient.post<CreateEmployeeAccountResData>(basePath, body);
}

export async function deleteEmployeeAccountAction(id: number) {
  return httpClient.delete(`${basePath}/detail/${id}`);
}

export async function updateEmployeeAccountAction(
  id: number,
  body: UpdateEmployeeAccountReqBody,
) {
  return httpClient.put<UpdateEmployeeAccountResData>(
    `${basePath}/detail/${id}`,
    body,
  );
}

/*
 * Guest
 */
export async function createGuestAccountAction(
  body: CreateGuestAccountReqBody,
) {
  return httpClient.post<CreateGuestAccountResData>(`${basePath}/guests`, body);
}

export async function getGuestListAction(params?: GuestListQueryParams) {
  const queryString = createQueryString({
    fromDate: params?.fromDate?.toISOString(),
    toDate: params?.toDate?.toISOString(),
  });

  return httpClient.get<GetGuestListResData>(
    `${basePath}/guests${queryString}`,
  );
}
