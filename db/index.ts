import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// En local (sin TURSO_DATABASE_URL) usa un archivo SQLite en disco.
// En producción (Vercel) usa Turso, una base SQLite alojada en la nube.
const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:agrogestion.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await client.execute("PRAGMA foreign_keys = ON");

export const db = drizzle(client, { schema });
