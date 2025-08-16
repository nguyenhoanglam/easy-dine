"use server";

import { setAuthCookie } from "@/helpers/storage";
import { httpClient } from "@/lib/http";
import {
  ChangePasswordReqBody,
  ChangePasswordResData,
  CreateEmployeeAccountReqBody,
  CreateEmployeeAccountResData,
  GetAccountListResData,
  GetAccountProfileResData,
  GetProfileResData,
  UpdateEmployeeAccountReqBody,
  UpdateEmployeeAccountResData,
  UpdateProfileReqBody,
  UpdateProfileResData,
} from "@/types/account";

const basePath = "/accounts";

/*
 * Account actions
 */
export async function getAccountListAction() {
  return httpClient.get<GetAccountListResData>(basePath);
}

export async function getAccountProfileAction(id: number) {
  return httpClient.get<GetAccountProfileResData>(`${basePath}/detail/${id}`);
}

/*
 * Profile actions
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
 * Employee actions
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
