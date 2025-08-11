"use server";

import { httpClient } from "@/lib/http";
import { CreateTableReqBody, Table, UpdateTableReqBody } from "@/types/table";

const basePath = "/tables";

export async function getTableListAction() {
  return httpClient.get<Table[]>(basePath);
}

export async function createTableAction(body: CreateTableReqBody) {
  return httpClient.post<Table>(basePath, body);
}

export async function getTableDetailAction(number: number) {
  return httpClient.get<Table>(`${basePath}/${number}`);
}

export async function updateTableAction(
  number: number,
  body: UpdateTableReqBody,
) {
  return httpClient.put<Table>(`${basePath}/${number}`, body);
}

export async function deleteTableAction(number: number) {
  return httpClient.delete(`${basePath}/${number}`);
}
