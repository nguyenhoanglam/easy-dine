"use server";

import { httpClient } from "@/lib/http";
import {
  CreateDishReqBody,
  Dish,
  DishListResData,
  UpdateDishReqBody,
} from "@/types/dish";
import { PaginationParams } from "@/types/others";

const basePath = "/dishes";

export async function getDishListAction({ page, limit }: PaginationParams) {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return httpClient.get<DishListResData>(
    `${basePath}/pagination?${searchParams.toString()}`,
  );
}

export async function createDishAction(body: CreateDishReqBody) {
  return httpClient.post<Dish>(basePath, body);
}

export async function getDishDetailAction(id: number) {
  return httpClient.get<Dish>(`${basePath}/${id}`);
}

export async function updateDishAction(id: number, body: UpdateDishReqBody) {
  return httpClient.put<Dish>(`${basePath}/${id}`, body);
}

export async function deleteDishAction(id: number) {
  return httpClient.delete(`${basePath}/${id}`);
}
