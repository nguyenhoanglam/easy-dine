"use server";

import { httpClient } from "@/lib/http";
import { UpdateDishResData } from "@/types/dish";
import {
  CreateTableReqBody,
  CreateTableResData,
  GetTableDetailResData,
  GetTableListResData,
  UpdateTableReqBody,
} from "@/types/table";

const basePath = "/tables";

export async function getTableListAction() {
  return httpClient.get<GetTableListResData>(basePath);
}

export async function getTableDetailAction(number: number) {
  return httpClient.get<GetTableDetailResData>(`${basePath}/${number}`);
}

export async function createTableAction(body: CreateTableReqBody) {
  return httpClient.post<CreateTableResData>(basePath, body);
}

export async function updateTableAction(
  number: number,
  body: UpdateTableReqBody,
) {
  return httpClient.put<UpdateDishResData>(`${basePath}/${number}`, body);
}

export async function deleteTableAction(number: number) {
  return httpClient.delete(`${basePath}/${number}`);
}
