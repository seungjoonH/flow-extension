export const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  OK: "OK",
  CREATED: "Created",
  BAD_REQUEST: "Bad Request",
  NOT_FOUND: "Not Found",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
};

export const EXT_MESSAGES = {
  NAME_REQUIRED: "Extension name is required",
  CHECKED_REQUIRED: "Checked is required",
  NAME_TOO_LONG: "Extension name must be at most 20 characters",
  LIST_FULL: "Custom extensions cannot exceed 200 items",
  NOT_FOUND: "Extension not found",
};