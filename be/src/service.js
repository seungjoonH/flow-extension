import * as repo from "#src/repository";
import * as error from "#src/response/error";
import { EXT_MESSAGES } from "#src/response/status";
import { CUSTOM_MAX, CUSTOM_NAME_MAX } from "#src/rules";

/* 조회 관련 */

// 확장자 조회
export const getExts = () => {
  const fixed = repo.getFixedExts().map((row) => ({ name: row.name, checked: Boolean(row.checked) }));
  const custom = repo.getCustomExts().map((row) => ({ name: row.name }));
  return { fixed, custom };
};

/* 추가 관련 */

// 커스텀 확장자 추가
export const postExtsCustom = (body) => {
  const { name } = body;
  
  const row = repo.getExt(name);

  // conditions
  const INVALID_NAME_CHARS = name && !/^[a-zA-Z0-9]+$/.test(name);
  const LONG_NAME = name && name.length > CUSTOM_NAME_MAX;
  const COUNT_EXCEEDED = !row && repo.getCustomExts().length >= CUSTOM_MAX;
  const ALREADY_BLOCKED = row && !row.fixed || row && row.fixed && row.checked;

  // 사전 throws
  if (!name) throw new error.BadRequestError(EXT_MESSAGES.NAME_REQUIRED);
  if (INVALID_NAME_CHARS) throw new error.BadRequestError(EXT_MESSAGES.NAME_INVALID_CHARS);
  if (LONG_NAME) throw new error.BadRequestError(EXT_MESSAGES.NAME_TOO_LONG);
  if (COUNT_EXCEEDED) throw new error.BadRequestError(EXT_MESSAGES.LIST_FULL);
  if (ALREADY_BLOCKED) throw new error.ConflictError(EXT_MESSAGES.ALREADY_BLOCKED);


  // 고정 확장자를 커스텀 확장자로 승격
  if (row && row.fixed && !row.checked) {
    const { changes } = repo.updateFixedExt(name, { checked: true });
    if (!changes) throw new error.InternalServerError();
    return { name, checked: true };
  }

  // 메인 로직
  const { changes: created } = repo.createCustomExt(name);
  
  // 사후 throws
  if (!created) throw new InternalServerError();

  return { name };
};

/* 수정 관련 */

// 고정 확장자 수정
export const patchExtsFixed = (name, body) => {

  // conditions
  const CHECKED_NOT_PROVIDED = body.checked === undefined || body.checked === null;

  // 사전 throws
  if (!name) throw new error.BadRequestError(EXT_MESSAGES.NAME_REQUIRED);
  if (CHECKED_NOT_PROVIDED) throw new error.BadRequestError(EXT_MESSAGES.CHECKED_REQUIRED);

  // 메인 로직
  const { changes: updated } = repo.updateFixedExt(name, body.checked);

  // 사후 throws
  if (!updated) throw new error.NotFoundError(EXT_MESSAGES.NOT_FOUND);

  return { name, checked: Boolean(body.checked) };
};

/* 삭제 관련 */

// 커스텀 확장자 삭제
export const deleteExtsCustom = (name) => {

  // 사전 throws
  if (!name) throw new error.BadRequestError(EXT_MESSAGES.NAME_REQUIRED);

  // 메인 로직
  const { changes: deleted } = repo.deleteCustomExt(name);

  // 사후 throws
  if (!deleted) throw new error.NotFoundError(EXT_MESSAGES.NOT_FOUND);

  return { name };
};
