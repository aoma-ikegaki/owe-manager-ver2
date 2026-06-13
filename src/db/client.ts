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
    max: 1,
  });

globalThis.__postgresClient = client;

export const db = drizzle(client, { schema });

declare global {
  // eslint-disable-next-line no-var
  var __postgresClient:
    | ReturnType<typeof postgres>
    | undefined;
}
