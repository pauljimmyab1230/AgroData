import type { Response, NextFunction } from 'express';
import * as recetasService from '../services/recetas.service';
import type { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await recetasService.getAll({
      search: req.query.search as string | undefined,
      etapa: req.query.etapa as string | undefined,
      producto_base: req.query.producto_base as string | undefined,
      activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 50,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getActivas = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await recetasService.getActivas(req.query.etapa as string | undefined);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await recetasService.getById(Number(req.params.id));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await recetasService.create(req.body);
    res.status(201).json({ success: true, message: 'Receta creada exitosamente', data });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await recetasService.update(Number(req.params.id), req.body);
    res.status(200).json({ success: true, message: 'Receta actualizada exitosamente', data });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await recetasService.remove(Number(req.params.id));
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
