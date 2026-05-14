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
  NAME_INVALID_CHARS: "확장자는 영문자/숫자 이외의 문자를 사용할 수 없습니다",
  NAME_TOO_LONG: "확장자는 최대 20자까지 입력할 수 있습니다",
  LIST_FULL: "커스텀 확장자는 최대 200개까지 추가할 수 있습니다",
  ALREADY_BLOCKED: "이미 차단되어 있습니다",
  NOT_FOUND: "확장자를 찾을 수 없습니다",
};