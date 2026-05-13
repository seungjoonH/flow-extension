import { db } from "@flow/db";

/* 조회 관련 */

// 확장자 조회
const getExts = (fixed) => {
  return db.prepare("SELECT * FROM exts WHERE fixed = ?").all(fixed);
};

export const getFixedExts = () => getExts(1);  // 고정 확장자 조회
export const getCustomExts = () => getExts(0); // 커스텀 확장자 조회


/* 추가 관련 */

// 커스텀 확장자 추가
export const createCustomExt = (name) => {
  return db
    .prepare("INSERT INTO exts (name, fixed) VALUES (?, 0)")
    .run(name);
};


/* 수정 관련 */

// 고정 확장자 수정
export const updateFixedExt = (name, checked) => {
  return db
    .prepare("UPDATE exts SET checked = ? WHERE name = ?")
    .run(checked ? 1 : 0, name);
};


/* 삭제 관련 */

// 커스텀 확장자 삭제
export const deleteCustomExt = (name) => {
  return db.prepare("DELETE FROM exts WHERE name = ?").run(name);
};