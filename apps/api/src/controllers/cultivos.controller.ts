import { Response, NextFunction } from 'express';
import * as cultivosService from '../services/cultivos.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await cultivosService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      campania_id: req.query.campania_id as string | undefined,
      productor_id: req.query.productor_id as string | undefined,
      parcela_id: req.query.parcela_id as string | undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cultivo = await cultivosService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: cultivo,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cultivo = await cultivosService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Cultivo registrado exitosamente',
      data: cultivo,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cultivo = await cultivosService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Cultivo actualizado exitosamente',
      data: cultivo,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await cultivosService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
