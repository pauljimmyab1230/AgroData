import { Response, NextFunction } from 'express';
import * as inspeccionesService from '../services/inspecciones.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await inspeccionesService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      campania_id: req.query.campania_id as string | undefined,
      productor_id: req.query.productor_id as string | undefined,
      parcela_id: req.query.parcela_id as string | undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const inspeccion = await inspeccionesService.getById(req.params.id);
    res.status(200).json({ success: true, data: inspeccion });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const inspeccion = await inspeccionesService.create(req.body, req.user?.id);
    res.status(201).json({ success: true, message: 'Inspección registrada exitosamente', data: inspeccion });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const inspeccion = await inspeccionesService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({ success: true, message: 'Inspección actualizada exitosamente', data: inspeccion });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await inspeccionesService.remove(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
