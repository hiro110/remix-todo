import React from "react";
import type { TodoInput } from "~/models/todo.types";

export type TodoFormProps = {
  defaultValues?: Partial<TodoInput>;
  submitLabel?: string;
  error?: string;
};

export function TodoForm({ defaultValues, submitLabel = "保存", error }: TodoFormProps) {
  return (
    <form method="post" className="max-w-lg mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-2">ToDo</h2>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2 mb-2 text-center">{error}</div>
      )}
      <div>
        <label className="block mb-1 text-gray-700">タイトル<span className="text-red-500">*</span></label>
        <input
          name="title"
          type="text"
          required
          maxLength={100}
          defaultValue={defaultValues?.title || ""}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-700">詳細</label>
        <textarea
          name="detail"
          maxLength={1000}
          defaultValue={defaultValues?.detail || ""}
          className="w-full border rounded px-3 py-2 min-h-[80px]"
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-700">期限</label>
        <input
          name="dueDate"
          type="date"
          defaultValue={defaultValues?.dueDate ? String(defaultValues.dueDate).slice(0, 10) : ""}
          className="border rounded px-3 py-2"
        />
      </div>
      <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
        {submitLabel}
      </button>
    </form>
  );
}
