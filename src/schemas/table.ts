import z from "zod";

import { TableStatusValues } from "@/lib/constants";

export const tableNumberSchema = z.transform(Number).pipe(
  z.number({ error: "Số bàn không hợp lệ." }).positive({
    error: "Số bàn không hợp lệ.",
  }),
);

const capacitySchema = z.transform(Number).pipe(
  z
    .number({
      error: "Sức chứa không hợp lệ.",
    })
    .positive({
      message: "Sức chứa không được nhỏ hơn 1.",
    }),
);

const statusSchema = z.enum(TableStatusValues);

export const tableSchema = z.object({
  number: tableNumberSchema,
  capacity: capacitySchema,
  status: statusSchema,
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createTableSchema = z.object({
  number: tableNumberSchema,
  capacity: capacitySchema,
  status: statusSchema.optional(),
});

export const updateTableSchema = z.object({
  changeToken: z.boolean(),
  capacity: capacitySchema,
  status: statusSchema.optional(),
});
