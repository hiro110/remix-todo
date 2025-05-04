import React from "react";

export type AuthFormProps = {
	title: string;
	children: React.ReactNode;
	submitLabel: string;
	error?: string;
};

export function AuthForm({
	title,
	children,
	submitLabel,
	error,
}: AuthFormProps) {
	return (
		<form
			method="post"
			className="max-w-md mx-auto p-6 bg-white rounded shadow"
		>
			<h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
			{error && <AuthErrorMessage message={error} />}
			<div className="space-y-4">{children}</div>
			<button
				type="submit"
				className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
			>
				{submitLabel}
			</button>
		</form>
	);
}

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function PasswordInput(props: PasswordInputProps) {
	const [show, setShow] = React.useState(false);
	return (
		<div className="relative">
			<input
				{...props}
				type={show ? "text" : "password"}
				className="w-full border rounded px-3 py-2 pr-10"
				autoComplete="current-password"
			/>
			<button
				type="button"
				tabIndex={-1}
				className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
				onClick={() => setShow((v) => !v)}
			>
				{show ? "非表示" : "表示"}
			</button>
		</div>
	);
}

export function AuthErrorMessage({ message }: { message: string }) {
	return (
		<div className="mb-2 text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded p-2">
			{message}
		</div>
	);
}
