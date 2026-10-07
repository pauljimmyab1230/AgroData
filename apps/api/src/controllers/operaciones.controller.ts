import type { Response, NextFunction } from 'express';
import * as operacionesService from '../services/operaciones.service';
import type { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await operacionesService.getAll({
      search: req.query.search as string | undefined,
      activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 100,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getActivas = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await operacionesService.getActivas();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await operacionesService.getById(Number(req.params.id));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await operacionesService.create(req.body);
    res.status(201).json({ success: true, message: 'Operación creada exitosamente', data });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await operacionesService.update(Number(req.params.id), req.body);
    res.status(200).json({ success: true, message: 'Operación actualizada exitosamente', data });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await operacionesService.remove(Number(req.params.id));
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
