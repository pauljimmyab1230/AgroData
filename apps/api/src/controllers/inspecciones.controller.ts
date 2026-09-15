import type { Response, NextFunction } from 'express';
import * as inspeccionesService from '../services/inspecciones.service';
import type { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await inspeccionesService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      cultivo_id: req.query.cultivo_id as string | undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const inspeccion = await inspeccionesService.getById(req.params.id);
    res.status(200).json({ success: true, data: inspeccion });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const inspeccion = await inspeccionesService.create(req.body, req.user?.id);
    res.status(201).json({ success: true, message: 'Inspección registrada exitosamente', data: inspeccion });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const inspeccion = await inspeccionesService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({ success: true, message: 'Inspección actualizada exitosamente', data: inspeccion });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await inspeccionesService.remove(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getGlobalStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const stats = await inspeccionesService.getGlobalStats({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      cultivo_id: req.query.cultivo_id as string | undefined,
    });
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
