"use server";

import { httpClient } from "@/lib/http";
import { CreateDishReqBody, Dish, UpdateDishReqBody } from "@/types/dish";

const basePath = "/dishes";

export async function getDishListAction() {
  return httpClient.get<Dish[]>(basePath);
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
