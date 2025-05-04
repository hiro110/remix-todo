import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { TodoForm } from "~/components/TodoForm";
import { createTodo } from "~/models/todo.server";
import { TodoInputSchema } from "~/models/todo.types";
import { requireUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request);
	return json({});
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request);
	const formData = Object.fromEntries(await request.formData());
	const parse = TodoInputSchema.safeParse(formData);
	if (!parse.success) {
		return json({ error: parse.error.errors[0]?.message }, { status: 400 });
	}
	await createTodo(parse.data, userId);
	return redirect("/");
}

export default function TodoNewPage() {
	const actionData = useActionData<typeof action>();
	return (
		<div className="max-w-xl mx-auto py-8">
			<h1 className="text-2xl font-bold mb-4">ToDo新規作成</h1>
			<TodoForm submitLabel="作成" error={actionData?.error} />
			<div className="mt-4">
				<Link to="/" className="text-blue-600 hover:underline">
					一覧に戻る
				</Link>
			</div>
		</div>
	);
}
