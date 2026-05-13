import { beforeEach } from "@jest/globals";
import { db } from "@flow/db";

// 메모리 DB 사용
beforeEach(() => {
  db.exec("DELETE FROM exts WHERE fixed = 0");
  db.exec("UPDATE exts SET checked = 0 WHERE fixed = 1");
});
