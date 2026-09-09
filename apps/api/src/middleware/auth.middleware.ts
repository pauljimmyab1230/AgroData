import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { createError } from './error.middleware';
import type { JwtPayload, UserRole } from '../types/auth.types';

// ─── AuthRequest Type ───────────────────────────────────────
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ─── Helpers ────────────────────────────────────────────────
const extractToken = (authHeader: string | undefined): string => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError('Token de acceso no proporcionado', 401);
  }
  return authHeader.split(' ')[1];
};

const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

  if (!decoded.id || !decoded.email || !decoded.rol) {
    throw createError('Token inválido: payload incompleto', 401);
  }

  const validRoles: UserRole[] = ['ADMIN', 'USER'];
  if (!validRoles.includes(decoded.rol)) {
    throw createError('Token inválido: rol no reconocido', 401);
  }

  return decoded;
};

// ─── Middleware ──────────────────────────────────────────────
export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const token = extractToken(req.headers.authorization);
    req.user = verifyToken(token);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(createError('Token expirado. Inicie sesión nuevamente', 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Token inválido', 401));
    } else {
      next(error);
    }
  }
};

export const adminMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.user?.rol !== 'ADMIN') {
    next(createError('Acceso denegado. Se requiere rol de administrador', 403));
    return;
  }
  next();
};
