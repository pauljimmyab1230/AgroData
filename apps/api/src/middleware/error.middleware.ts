import type { Request, Response, NextFunction } from 'express';

// ─── AppError (Typed) ───────────────────────────────────────
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  type?: string;
  errors?: Array<{ field: string; message: string }>;
}

// ─── Type Guard ─────────────────────────────────────────────
function isAppError(error: unknown): error is AppError {
  return error instanceof Error && 'statusCode' in error;
}

// ─── Factory ────────────────────────────────────────────────
export const createError = (message: string, statusCode: number, type?: string): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  error.type = type ?? `https://api.agrodata.com/errors/${statusCodeToType(statusCode)}`;
  return error;
};

const statusCodeToType = (code: number): string => {
  switch (code) {
    case 400: return 'bad-request';
    case 401: return 'unauthorized';
    case 403: return 'forbidden';
    case 404: return 'not-found';
    case 409: return 'conflict';
    case 422: return 'validation-error';
    case 429: return 'too-many-requests';
    default: return 'internal-error';
  }
};

// ─── Error Handler Middleware ────────────────────────────────
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = isAppError(err) ? err.statusCode : 500;
  const message = isAppError(err) ? err.message : 'Error interno del servidor';
  const type = isAppError(err)
    ? err.type
    : `https://api.agrodata.com/errors/internal-error`;

  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${statusCode}: ${message}`);
    if (err instanceof Error) {
      console.error(err.stack);
    }
  } else if (statusCode >= 500) {
    console.error(`[ERROR] ${statusCode}: ${message}`);
  }

  const problemResponse = {
    type,
    title: message,
    status: statusCode,
    detail: message,
    instance: req.originalUrl,
    ...(isAppError(err) && err.errors ? { errors: err.errors } : {}),
  };

  res.status(statusCode).json(problemResponse);
};
