import z from "zod";

export const accoutnNameSchema = z
  .string()
  .trim()
  .min(2, { error: "Tên tài khoản phải có ít nhất 2 ký tự." })
  .max(256, { error: "Tên tài khoản không được quá 256 ký tự." });

export const emailSchema = z.email({
  error: "invalidEmail",
});

export const avatarSchema = z.string().nullable();

export const passwordSchema = z
  .string()
  .min(6, { error: "invalidPassword" })
  .max(100, { error: "invalidPassword" });

export const confirmPasswordSchema = z
  .string()
  .min(6, { error: "Mật khẩu phải có ít nhất 6 ký tự." })
  .max(100, { error: "Mật khẩu không được quá 100 ký tự." });

export const priceSchema = z.transform(Number).pipe(
  z
    .number({
      error: "Giá tiền không hợp lệ.",
    })
    .positive({ error: "Giá tiền không được nhỏ hơn 0." }),
);

export const dateSchema = z.date();
