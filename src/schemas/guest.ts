import z from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, {
    error: "Tên khách hàng phải có ít nhất 2 ký tự.",
  })
  .max(50, {
    error: "Tên khách hàng không được nhiều hơn 50 ký tự.",
  });

export const guestLoginSchema = z
  .object({
    name: nameSchema,
    tableNumber: z
      .number({
        error: "Số bàn không hợp lệ.",
      })
      .min(1, {
        error: "Số bàn không hợp lệ",
      }),
    token: z.string().min(1, {
      error: "Token không được để trống.",
    }),
  })
  .strict();

export const createGuestOrdersSchema = z.array(
  z.object({
    dishId: z.number(),
    quantity: z.number(),
  }),
);
