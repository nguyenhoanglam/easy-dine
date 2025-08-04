import z from "zod";

export const productSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, { error: "Tên sản phẩm không được để trống." })
    .max(256, {
      error: "Tên sản phẩm không được vượt quá 256 ký tự.",
    }),
  price: z.preprocess(
    // Fakes value type is number although it is a string
    (value: number) => {
      const trimmedValue = String(value)?.trim();

      /* If value is empty, return a string that Javascript can not convert it to number. e.g "$"
       * If we return `undefined`, `null` or empty string, it will be converted to `0` and the below `z.number()` will not raise error
       */
      if (trimmedValue === "") {
        return "$";
      }

      return Number(trimmedValue);
    },
    z
      .number({
        error: "Giá sản phẩm không được để trống",
      })
      .min(0, {
        error: "Giá sản phẩm không hợp lệ.",
      }),
  ),
  description: z.string().max(10000, {
    error: "Mô tả sản phẩm không được vượt quá 10,000 ký tự.",
  }),
  image: z.string().min(1, {
    error: "Hình ảnh sản phẩm không được để trống.",
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const addProductRequestSchema = productSchema.pick({
  name: true,
  price: true,
  description: true,
  image: true,
});

export const updateProductRequestSchema = addProductRequestSchema;
