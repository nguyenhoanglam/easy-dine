import z from "zod";

import {
  createTableSchema,
  tableSchema,
  updateTableSchema,
} from "@/schemas/table";

export type Table = z.infer<typeof tableSchema>;

export type CreateTableReqBody = z.TypeOf<typeof createTableSchema>;

export type UpdateTableReqBody = z.TypeOf<typeof updateTableSchema>;
