import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { createError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    rol: string;
  };
  familiarId?: string;
  parcelaId?: string;
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Token de acceso no proporcionado', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      rol: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Token inválido o expirado', 401));
    } else {
      next(error);
    }
  }
};

export const adminMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (req.user?.rol !== 'ADMIN') {
    return next(createError('Acceso denegado. Se requiere rol de administrador', 403));
  }
  next();
};
