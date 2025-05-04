import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { getUserById } from "~/models/user.server";

// セッションシークレットの設定（実運用環境では環境変数から取得することを推奨）
const sessionSecret = process.env.SESSION_SECRET || "DEFAULT_SECRET_CHANGE_ME";

// セッションストレージの作成
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__remix_todo_session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1週間
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

// ユーザーセッションの取得
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// ユーザーIDをセッションに保存
export async function createUserSession({
  request,
  userId,
  redirectTo,
}: {
  request: Request;
  userId: string;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// ログアウト処理
export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

// 現在ログインしているユーザーを取得
export async function getUser(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  if (!userId) return null;

  try {
    return await getUserById(userId);
  } catch {
    // セッションが無効な場合はnullを返す
    return null;
  }
}

// 未認証ユーザーをリダイレクト
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const user = await getUser(request);
  if (!user) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return user.id;
}