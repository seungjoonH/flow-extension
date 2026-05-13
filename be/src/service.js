import * as repo from "#src/repository";
import { BadRequestError, NotFoundError } from "#src/response/error";
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

  // conditions
  const LONG_NAME = name && name.length > CUSTOM_NAME_MAX;
  const COUNT_EXCEEDED = repo.getCustomExts().length >= CUSTOM_MAX;

  // 사전 throws
  if (!name) throw new BadRequestError(EXT_MESSAGES.NAME_REQUIRED);
  if (LONG_NAME) throw new BadRequestError(EXT_MESSAGES.NAME_TOO_LONG);
  if (COUNT_EXCEEDED) throw new BadRequestError(EXT_MESSAGES.LIST_FULL);

  // 메인 로직
  const { changes: created } = repo.createCustomExt(name);
  
  // 사후 throws
  if (!created) throw new BadRequestError();

  return { name };
};

/* 수정 관련 */

// 고정 확장자 수정
export const patchExtsFixed = (name, body) => {

  // conditions
  const CHECKED_NOT_PROVIDED = body.checked === undefined || body.checked === null;

  // 사전 throws
  if (!name) throw new BadRequestError(EXT_MESSAGES.NAME_REQUIRED);
  if (CHECKED_NOT_PROVIDED) throw new BadRequestError(EXT_MESSAGES.CHECKED_REQUIRED);

  // 메인 로직
  const { changes: updated } = repo.updateFixedExt(name, body.checked);

  // 사후 throws
  if (!updated) throw new NotFoundError(EXT_MESSAGES.NOT_FOUND);

  return { name, checked: Boolean(body.checked) };
};

/* 삭제 관련 */

// 커스텀 확장자 삭제
export const deleteExtsCustom = (name) => {

  // 사전 throws
  if (!name) throw new BadRequestError(EXT_MESSAGES.NAME_REQUIRED);

  // 메인 로직
  const { changes: deleted } = repo.deleteCustomExt(name);

  // 사후 throws
  if (!deleted) throw new NotFoundError(EXT_MESSAGES.NOT_FOUND);

  return { name };
};
