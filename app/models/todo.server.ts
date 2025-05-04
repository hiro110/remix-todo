import { db } from "~/utils/db.server";
import { randomUUID } from "crypto";
import type { Todo, TodoInput } from "./todo.types";

export async function getTodosByUser(userId: string): Promise<Todo[]> {
  const res = await db.query(
    `SELECT id, user_id, title, detail, due_date, done_at, created_at, updated_at
     FROM todos WHERE user_id = $1 ORDER BY due_date NULLS LAST, created_at DESC`,
    [userId]
  );
  return res.rows.map(rowToTodo);
}

export async function getTodoById(id: string, userId: string): Promise<Todo | null> {
  const res = await db.query(
    `SELECT id, user_id, title, detail, due_date, done_at, created_at, updated_at
     FROM todos WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  if (!res.rowCount) return null;
  return rowToTodo(res.rows[0]);
}

export async function createTodo(input: TodoInput, userId: string): Promise<Todo> {
  const now = new Date();
  const id = randomUUID();
  const dueDate = input.dueDate ? new Date(input.dueDate) : null;
  await db.query(
    `INSERT INTO todos (id, user_id, title, detail, due_date, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $6)`,
    [id, userId, input.title, input.detail ?? null, dueDate, now]
  );
  return {
    id,
    userId,
    title: input.title,
    detail: input.detail ?? null,
    dueDate,
    doneAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateTodo(
  id: string,
  userId: string,
  input: TodoInput
): Promise<Todo | null> {
  const now = new Date();
  const dueDate = input.dueDate ? new Date(input.dueDate) : null;
  const res = await db.query(
    `UPDATE todos SET title = $1, detail = $2, due_date = $3, updated_at = $4
     WHERE id = $5 AND user_id = $6 RETURNING *`,
    [input.title, input.detail ?? null, dueDate, now, id, userId]
  );
  if (!res.rowCount) return null;
  return rowToTodo(res.rows[0]);
}

export async function deleteTodo(id: string, userId: string): Promise<boolean> {
  const res = await db.query(
    `DELETE FROM todos WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return res.rowCount > 0;
}

export async function toggleTodoDone(id: string, userId: string): Promise<Todo | null> {
  // 現在のdone_atを取得
  const todo = await getTodoById(id, userId);
  if (!todo) return null;
  const newDoneAt = todo.doneAt ? null : new Date();
  const res = await db.query(
    `UPDATE todos SET done_at = $1, updated_at = $2 WHERE id = $3 AND user_id = $4 RETURNING *`,
    [newDoneAt, new Date(), id, userId]
  );
  if (!res.rowCount) return null;
  return rowToTodo(res.rows[0]);
}

function rowToTodo(row: any): Todo {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    detail: row.detail,
    dueDate: row.due_date,
    doneAt: row.done_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
