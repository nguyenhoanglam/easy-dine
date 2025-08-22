"use server";

import { revalidateTag } from "next/cache";
import queryString from "query-string";

import { httpClient } from "@/lib/http";
import {
  CreateDishReqBody,
  CreateDishResData,
  GetDishDetailResData,
  GetDishListResData,
  PaginatedDishListResData,
  UpdateDishReqBody,
  UpdateDishResData,
} from "@/types/dish";
import { PaginationParams } from "@/types/others";

const Tags = {
  Dishes: "dishes",
};

const basePath = "/dishes";

export async function getDishListAction() {
  return httpClient.get<GetDishListResData>(basePath, {
    useAuth: false,
    next: { tags: [Tags.Dishes] },
  });
}

export async function getPaginatedDishListAction(params: PaginationParams) {
  return httpClient.get<PaginatedDishListResData>(
    `${basePath}/pagination?${queryString.stringify(params)}`,
  );
}

export async function createDishAction(body: CreateDishReqBody) {
  const response = await httpClient.post<CreateDishResData>(basePath, body);

  if (response.ok) {
    revalidateTag(Tags.Dishes);
  }

  return response;
}

export async function getDishDetailAction(id: number) {
  return httpClient.get<GetDishDetailResData>(`${basePath}/${id}`);
}

export async function updateDishAction(id: number, body: UpdateDishReqBody) {
  const response = await httpClient.put<UpdateDishResData>(
    `${basePath}/${id}`,
    body,
  );

  if (response.ok) {
    revalidateTag(Tags.Dishes);
  }

  return response;
}

export async function deleteDishAction(id: number) {
  const response = await httpClient.delete(`${basePath}/${id}`);

  if (response.ok) {
    revalidateTag(Tags.Dishes);
  }

  return response;
}
