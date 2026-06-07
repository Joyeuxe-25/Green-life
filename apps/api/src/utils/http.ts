import type { Context } from "hono";

type JsonRecord = Record<string, unknown>;
type ApiStatus = 200 | 201 | 400 | 404 | 500;

export function success(c: Context, data: unknown = {}, status: ApiStatus = 200) {
  return c.json({ ok: true, data }, status);
}

export function errorResponse(
  c: Context,
  message = "Request failed",
  status: ApiStatus = 500,
  details?: JsonRecord
) {
  return c.json(
    {
      ok: false,
      error: {
        message,
        ...(details ? { details } : {})
      }
    },
    status
  );
}

export function validationError(
  c: Context,
  message = "Validation failed",
  details?: JsonRecord
) {
  return errorResponse(c, message, 400, details);
}

export function notFound(c: Context, message = "Not found") {
  return errorResponse(c, message, 404);
}

export function placeholder(c: Context, moduleName: string) {
  return success(c, {
    module: moduleName,
    status: "placeholder",
    message: "This backend module will be implemented in a later phase."
  });
}
