import fs from "node:fs";
import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const defaultPath = path.join(dir, "data", "app.db");

// 데이터베이스 파일 경로 해석
function resolveDbFilePath() {
  // 테스트 환경에서 메모리 데이터베이스를 사용하기 위함
  if (process.env.JEST_WORKER_ID != null) return ":memory:";
  return defaultPath;
}

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

export const db = openDb(resolveDbFilePath());

export { Database };
export { FIXED_EXT_NAMES } from "./fixed-catalog.js";
