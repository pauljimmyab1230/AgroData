import { Response, NextFunction } from 'express';
import * as campaniasService from '../services/campanias.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await campaniasService.getAll({
      search: req.query.search as string | undefined,
      estado: req.query.estado as string | undefined,
      anio_agricola: req.query.anio_agricola as string | undefined,
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
    const campania = await campaniasService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: campania,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const campania = await campaniasService.create(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Campaña registrada exitosamente',
      data: campania,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const campania = await campaniasService.update(req.params.id, req.body, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Campaña actualizada exitosamente',
      data: campania,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await campaniasService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
