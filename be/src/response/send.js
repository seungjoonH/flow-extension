import { STATUS } from "#src/response/status";

function sendResponse(res, ok, status, data, error) {
  return res.status(status).json({
    ok, status,
    data: ok ? (data ?? null) : null,
    error: ok ? null : error,
  });
}

// ERROR
export function sendError(res, status, message) {
  return sendResponse(res, false, status, null, { message });
}



// SUCCESS
export function sendSuccess(res, data, status = 200) {
  return sendResponse(res, true, status, data, null);
}

export function sendOk(res, data) {
  return sendResponse(res, true, STATUS.OK, data, null);
}

export function sendCreated(res, data) {
  return sendResponse(res, true, STATUS.CREATED, data, null);
}