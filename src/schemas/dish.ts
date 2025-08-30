import z from "zod";

import { DishStatusValues } from "@/lib/constants";
import { priceSchema } from "@/schemas/common";

const nameSchema = z
  .string()
  .trim()
  .min(2, { error: "Tên món ăn phải có ít nhất 2 ký tự." })
  .max(256, { error: "Tên món ăn không được quá 256 ký tự." });

const imageSchema = z.url({ error: "Ảnh món ăn không hợp lệ." });

const descriptionSchema = z
  .string()
  .trim()
  .min(1, { error: "Mô tả món ăn không được để trống." })
  .max(10000, { error: "Mô tả món ăn không được quá 10000 ký tự." });

export const dishSchema = z.object({
  id: z.number(),
  name: nameSchema,
  price: priceSchema,
  description: descriptionSchema,
  image: imageSchema,
  status: z.enum(DishStatusValues),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createDishSchema = z.object({
  name: nameSchema,
  price: priceSchema,
  description: descriptionSchema,
  image: imageSchema,
  status: z.enum(DishStatusValues).optional(),
});

export const updateDishSchema = createDishSchema;
