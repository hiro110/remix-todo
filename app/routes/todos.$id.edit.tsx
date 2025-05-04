import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Link } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { getTodoById, updateTodo } from "~/models/todo.server";
import { TodoForm } from "~/components/TodoForm";
import { TodoInputSchema } from "~/models/todo.types";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const todo = await getTodoById(params.id as string, userId);
  if (!todo) throw new Response("Not Found", { status: 404 });
  return json({ todo });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const todoId = params.id as string;
  const formData = Object.fromEntries(await request.formData());
  const parse = TodoInputSchema.safeParse(formData);
  if (!parse.success) {
    return json({ error: parse.error.errors[0]?.message }, { status: 400 });
  }
  const updated = await updateTodo(todoId, userId, parse.data);
  if (!updated) {
    return json({ error: "更新できませんでした" }, { status: 400 });
  }
  return redirect("/");
}

export default function TodoEditPage() {
  const { todo } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">ToDo編集</h1>
      <TodoForm
        defaultValues={{
          title: todo.title,
          detail: todo.detail ?? undefined,
          dueDate: todo.dueDate ? String(todo.dueDate).slice(0, 10) : undefined,
        }}
        submitLabel="更新"
        error={actionData?.error}
      />
      <div className="mt-4">
        <Link to="/" className="text-blue-600 hover:underline">一覧に戻る</Link>
      </div>
    </div>
  );
}
