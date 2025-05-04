import bcrypt from "bcrypt";
import { db } from "~/utils/db.server";
import { randomUUID } from "crypto";
import {
  SafeUser,
  RegisterFormData,
} from "./user.types";

// パスワードハッシュ化関数
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// パスワード検証関数
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ユーザー作成関数
export async function createUser(data: RegisterFormData): Promise<SafeUser> {
  // メールアドレス・ユーザー名の一意性チェック
  const exists = await db.query(
    "SELECT 1 FROM users WHERE email = $1 OR username = $2 LIMIT 1",
    [data.email, data.username]
  );
  if (exists.rowCount) {
    throw new Error("このメールアドレスまたはユーザー名は既に使用されています");
  }
  const now = new Date();
  const passwordHash = await hashPassword(data.password);
  const id = randomUUID();
  await db.query(
    `INSERT INTO users (id, email, username, password_hash, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, data.email, data.username, passwordHash, now, now]
  );
  return { id, email: data.email, username: data.username, createdAt: now, updatedAt: now };
}

// ユーザー認証関数
export async function authenticateUser(
  email: string,
  password: string
): Promise<SafeUser | null> {
  const res = await db.query(
    `SELECT id, email, username, password_hash, created_at, updated_at FROM users WHERE email = $1`,
    [email]
  );
  if (!res.rowCount) return null;
  const user = res.rows[0];
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) return null;
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

// IDによるユーザー検索
export async function getUserById(id: string): Promise<SafeUser | null> {
  const res = await db.query(
    `SELECT id, email, username, created_at, updated_at FROM users WHERE id = $1`,
    [id]
  );
  if (!res.rowCount) return null;
  const user = res.rows[0];
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}