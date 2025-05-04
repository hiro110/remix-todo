import { Link, useLoaderData, Form } from "@remix-run/react";
import type { SafeUser } from "~/models/user.types";

export function Header() {
  // ルートレベルのloaderからユーザー情報を取得
  const data = useLoaderData<{ user: SafeUser | null }>();
  const user = data?.user;

  return (
    <header className="w-full bg-white shadow mb-6">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="font-bold text-xl text-blue-700">Remix Todo</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700">{user.username} さん</span>
              <Form action="/logout" method="post">
                <button type="submit" className="text-sm text-gray-600 hover:underline">ログアウト</button>
              </Form>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-blue-600 hover:underline">ログイン</Link>
              <Link to="/register" className="text-sm text-blue-600 hover:underline">新規登録</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
