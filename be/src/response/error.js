import { STATUS, MESSAGES } from "#src/response/status";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.statusCode = status;
  }
}

// 404
export class NotFoundError extends HttpError {
  constructor(message) { super(STATUS.NOT_FOUND, message ?? MESSAGES.NOT_FOUND); }
}