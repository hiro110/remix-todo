import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, Link } from "@remix-run/react";
import { RegisterSchema } from "~/models/user.types";
import { createUserSession, getUser } from "~/utils/session.server";
import { AuthForm, PasswordInput } from "~/components/AuthForm";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) return redirect("/");
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  const parse = RegisterSchema.safeParse(formData);
  if (!parse.success) {
    return json({ error: parse.error.errors[0]?.message }, { status: 400 });
  }
  const { createUser } = await import("~/models/user.server");
  try {
    const user = await createUser(parse.data);
    return await createUserSession({ request, userId: user.id, redirectTo: "/" });
  } catch (e: any) {
    return json({ error: e.message }, { status: 400 });
  }
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <AuthForm title="新規登録" submitLabel="登録" error={actionData?.error}>
        <label className="block">
          <span className="text-gray-700">メールアドレス</span>
          <input name="email" type="email" required className="w-full border rounded px-3 py-2 mt-1" />
        </label>
        <label className="block">
          <span className="text-gray-700">ユーザー名</span>
          <input name="username" type="text" required className="w-full border rounded px-3 py-2 mt-1" />
        </label>
        <label className="block">
          <span className="text-gray-700">パスワード</span>
          <PasswordInput name="password" required minLength={8} />
        </label>
        <label className="block">
          <span className="text-gray-700">パスワード（確認）</span>
          <PasswordInput name="confirmPassword" required minLength={8} />
        </label>
      </AuthForm>
      <p className="mt-4 text-sm text-gray-600">
        すでにアカウントをお持ちですか？ <Link to="/login" className="text-blue-600 hover:underline">ログイン</Link>
      </p>
    </div>
  );
}
