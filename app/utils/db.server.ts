import { Pool } from "pg";

export const db = new Pool({
	connectionString:
		process.env.DATABASE_URL ||
		`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db:5432/${process.env.POSTGRES_DB}`,
});
