import z from "zod";

import { addProductRequestSchema, productSchema } from "@/schemas/product";

export type Product = z.infer<typeof productSchema>;

export type GetProductListResData = Product[];

export type GetProductDetailResData = Product;

export type AddProductReqBody = z.infer<typeof addProductRequestSchema>;

export type AddProductResData = object;

export type UpdateProductReqBody = AddProductReqBody;

export type UpdateProductResData = AddProductResData;
