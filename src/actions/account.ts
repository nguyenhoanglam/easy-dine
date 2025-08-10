"use server";

import { setAuthCookie } from "@/helpers/storage";
import { httpClient } from "@/lib/http";
import {
  Account,
  ChangePasswordReqBody,
  ChangePasswordResData,
  CreateEmployeeAccountReqBody,
  UpdateEmployeeAccountReqBody,
  UpdateProfileReqBody,
} from "@/types/account";

const basePath = "/accounts";

/*
 * Account actions
 */
export async function getAccountListAction() {
  return httpClient.get<Account[]>(basePath);
}

export async function getAccountProfileAction(id: number) {
  return httpClient.get<Account>(`${basePath}/detail/${id}`);
}

/*
 * Profile actions
 */
export async function getProfileAction() {
  return httpClient.get<Account>(`${basePath}/me`);
}

export async function updateProfileAction(body: UpdateProfileReqBody) {
  return httpClient.put<Account>(`${basePath}/me`, body);
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
  return httpClient.post<Account>(basePath, body);
}

export async function deleteEmployeeAccountAction(id: number) {
  return httpClient.delete(`${basePath}/detail/${id}`);
}

export async function updateEmployeeAccountAction(
  id: number,
  body: UpdateEmployeeAccountReqBody,
) {
  return httpClient.put<Account>(`${basePath}/detail/${id}`, body);
}
