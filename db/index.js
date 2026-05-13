import fs from "node:fs";
import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const defaultPath = path.join(dir, "data", "app.db");

export function initDb(db) {
  const schemaSql = fs.readFileSync(path.join(dir, "schema.sql"), "utf8");
  const initSql = fs.readFileSync(path.join(dir, "init.sql"), "utf8");
  db.exec(schemaSql);
  db.exec(initSql);
}

export function openDb(filePath = defaultPath) {
  const database = new Database(filePath);
  initDb(database);
  return database;
}

export const db = openDb();

export { Database };
export { FIXED_EXT_NAMES } from "./fixed-catalog.js";
