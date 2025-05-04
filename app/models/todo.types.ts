import { z } from "zod";

export const TodoSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1, "タイトルは必須です").max(100),
  detail: z.string().max(1000).optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  doneAt: z.coerce.date().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Todo = z.infer<typeof TodoSchema>;

export const TodoInputSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(100),
  detail: z.string().max(1000).optional().nullable(),
  dueDate: z.string().optional().nullable(), // フォームからはstringで受け取る
});

export type TodoInput = z.infer<typeof TodoInputSchema>;
