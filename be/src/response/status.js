export const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  OK: "OK",
  CREATED: "Created",
  BAD_REQUEST: "Bad Request",
  NOT_FOUND: "Not Found",
  CONFLICT: "Conflict",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
};

export const EXT_MESSAGES = {
  NAME_REQUIRED: "확장자는 필수 입력 항목입니다",
  CHECKED_REQUIRED: "체크 여부는 필수 입력 항목입니다",
  NAME_TOO_LONG: "확장자는 최대 20자까지 입력할 수 있습니다",
  LIST_FULL: "커스텀 확장자는 최대 200개까지 추가할 수 있습니다",
  NAME_ALREADY_EXISTS: "이미 존재하는 확장자입니다",
  NOT_FOUND: "확장자를 찾을 수 없습니다",
};