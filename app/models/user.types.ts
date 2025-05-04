import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(20),
  passwordHash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
export type SafeUser = Omit<User, "passwordHash">;

export const RegisterSchema = z.object({
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  username: z
    .string()
    .min(3, { message: "ユーザー名は3文字以上で入力してください" })
    .max(20, { message: "ユーザー名は20文字以下で入力してください" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で入力してください" })
    .regex(/[A-Z]/, { message: "パスワードには大文字を含めてください" })
    .regex(/[a-z]/, { message: "パスワードには小文字を含めてください" })
    .regex(/[0-9]/, { message: "パスワードには数字を含めてください" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "パスワードと確認用パスワードが一致しません",
  path: ["confirmPassword"],
});
export type RegisterFormData = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string().min(1, { message: "パスワードを入力してください" }),
});
export type LoginFormData = z.infer<typeof LoginSchema>;
