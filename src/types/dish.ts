import z from "zod";

import { createDishSchema, dishSchema, updateDishSchema } from "@/schemas/dish";

export type Dish = z.infer<typeof dishSchema>;

export type CreateDishReqBody = z.infer<typeof createDishSchema>;

export type UpdateDishReqBody = z.infer<typeof updateDishSchema>;

export type DishListResData = {
  totalItem: number;
  totalPage: number;
  page: number;
  limit: number;
  items: Dish[];
};
