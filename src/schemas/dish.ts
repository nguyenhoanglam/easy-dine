import z from "zod";

import { DishStatusValues } from "@/lib/constants";

const priceSchema = z.preprocess(
  (value: number) => {
    const trimmedValue = String(value)?.trim();

    if (trimmedValue === "") {
      return "$";
    }

    return Number(trimmedValue);
  },
  z
    .number({
      error: "Giá món ăn không được để trống",
    })
    .min(0, {
      error: "Giá món ăn không hợp lệ.",
    }),
);

export const dishSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: priceSchema,
  description: z.string(),
  image: z.string(),
  status: z.enum(DishStatusValues),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createDishSchema = z.object({
  name: z
    .string()
    .min(1, {
      error: "Tên món ăn không được để trống.",
    })
    .max(256, {
      error: "Tên món ăn không được vượt quá 256 ký tự.",
    }),
  price: priceSchema,
  description: z.string().max(10000),
  image: z.url(),
  status: z.enum(DishStatusValues).optional(),
});

export const dishQueryParamsSchema = z.object({
  id: z.coerce.number(),
});

export const updateDishSchema = createDishSchema;

export const dishPaginationParamsSchema = z.object({
  page: z.coerce.number().positive().lte(10000).default(1),
  limit: z.coerce.number().positive().lte(10000).default(10),
});

export const DishListWithPaginationRes = z.object({
  data: z.object({
    totalItem: z.number(),
    totalPage: z.number(),
    page: z.number(),
    limit: z.number(),
    items: z.array(dishSchema),
  }),
  message: z.string(),
});
