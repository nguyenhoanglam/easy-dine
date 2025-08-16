import z from "zod";

import { createDishSchema, dishSchema, updateDishSchema } from "@/schemas/dish";

export type Dish = z.infer<typeof dishSchema>;

export type DishSnapshot = Dish & { dishId: number | null };

export type GetDishDetailResData = Dish;

export type UpdateDishResData = Dish;

export type GetDishListResData = Dish[];

export type CreateDishReqBody = z.infer<typeof createDishSchema>;

export type CreateDishResData = Dish;

export type UpdateDishReqBody = z.infer<typeof updateDishSchema>;

export type PaginatedDishListResData = {
  totalItem: number;
  totalPage: number;
  page: number;
  limit: number;
  items: Dish[];
};
