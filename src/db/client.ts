import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const useSsl =
  process.env.DRIZZLE_SSL === "true" ||
  /sslmode=require/i.test(connectionString);

const client =
  globalThis.__postgresClient ??
  postgres(connectionString, {
    ssl: useSsl ? "require" : undefined,
  });

export const db = drizzle(client, { schema });

if (process.env.NODE_ENV !== "production") {
  globalThis.__postgresClient = client;
}

declare global {
  // eslint-disable-next-line no-var
  var __postgresClient:
    | ReturnType<typeof postgres>
    | undefined;
}
