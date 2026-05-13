import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const defaultPath = path.join(dir, "data", "app.db");

export function openDb(filePath = defaultPath) {
  return new Database(filePath);
}

export { Database };