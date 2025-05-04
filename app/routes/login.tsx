import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, Link } from "@remix-run/react";
import { LoginSchema } from "~/models/user.types";
import { createUserSession, getUser } from "~/utils/session.server";
import { AuthForm, PasswordInput } from "~/components/AuthForm";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) return redirect("/");
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  const parse = LoginSchema.safeParse(formData);
  if (!parse.success) {
    return json({ error: parse.error.errors[0]?.message }, { status: 400 });
  }
  const { authenticateUser } = await import("~/models/user.server");
  const user = await authenticateUser(parse.data.email, parse.data.password);
  if (!user) {
    return json({ error: "メールアドレスまたはパスワードが正しくありません" }, { status: 400 });
  }
  return await createUserSession({ request, userId: user.id, redirectTo: "/" });
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <AuthForm title="ログイン" submitLabel="ログイン" error={actionData?.error}>
        <label className="block">
          <span className="text-gray-700">メールアドレス</span>
          <input name="email" type="email" required className="w-full border rounded px-3 py-2 mt-1" />
        </label>
        <label className="block">
          <span className="text-gray-700">パスワード</span>
          <PasswordInput name="password" required minLength={8} />
        </label>
      </AuthForm>
      <p className="mt-4 text-sm text-gray-600">
        アカウントをお持ちでない方は <Link to="/register" className="text-blue-600 hover:underline">新規登録</Link>
      </p>
    </div>
  );
}
