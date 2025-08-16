import z from "zod";

import {
  createTableSchema,
  tableSchema,
  updateTableSchema,
} from "@/schemas/table";

export type Table = z.infer<typeof tableSchema>;

export type GetTableListResData = Table[];

export type GetTableDetailResData = Table;

export type CreateTableReqBody = z.TypeOf<typeof createTableSchema>;

export type CreateTableResData = Table;

export type UpdateTableReqBody = z.TypeOf<typeof updateTableSchema>;

export type UpdateTableResData = Table;
