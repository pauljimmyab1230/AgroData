import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

// AppError (Typed)
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  type?: string;
  errors?: Array<{ field: string; message: string }>;
}

// Type Guard
function isAppError(error: unknown): error is AppError {
  return error instanceof Error && 'statusCode' in error && 'isOperational' in error;
}

// Factory
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

// Mapea errores conocidos de Prisma a códigos HTTP semánticos.
function mapearErrorPrisma(err: unknown): AppError | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const campos = Array.isArray(err.meta?.target)
          ? (err.meta.target as string[]).join(', ')
          : 'el campo indicado';
        return createError(`Ya existe un registro con ${campos} duplicado`, 409);
      }
      case 'P2025':
        return createError('Registro no encontrado', 404);
      case 'P2003':
        return createError('La operación viola una restricción de relación', 400);
      case 'P2014':
        return createError('La relación indicada no es válida', 400);
      case 'P2021':
        return createError('La tabla indicada no existe', 500);
      case 'P2022':
        return createError('La columna indicada no existe', 500);
      default:
        return createError('Error de base de datos', 500);
    }
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    return createError('Datos inválidos para la operación', 400);
  }
  return null;
}

// Error Handler Middleware
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Errores de Prisma primero: no deben filtrarse como 500 genéricos.
  const errorPrisma = mapearErrorPrisma(err);
  const appErr = errorPrisma ?? (isAppError(err) ? err : null);

  const statusCode = appErr ? appErr.statusCode : 500;
  const message = appErr ? appErr.message : 'Error interno del servidor';
  const type = appErr
    ? appErr.type
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
    ...(appErr?.errors ? { errors: appErr.errors } : {}),
  };

  res.status(statusCode).json(problemResponse);
};
