import type { Response, NextFunction } from 'express';
import * as recepcionService from '../services/recepcion.service';
import type { AuthRequest } from '../middleware/auth.middleware';
import type { RecepcionCreateInput, RecepcionUpdateInput, RecepcionFilters } from '../types/recepciones.types';

export const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filters: RecepcionFilters = {
      search: req.query.search as string | undefined,
      estado: req.query.estado as RecepcionFilters['estado'],
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    };
    const result = await recepcionService.getAll(filters);
    res.status(200).json({
      success: true,
      ...result,
    });
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
    const recepcion = await recepcionService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: recepcion,
    });
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
    const data = req.body as RecepcionCreateInput;
    const recepcion = await recepcionService.create(data, req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Recepción registrada exitosamente',
      data: recepcion,
    });
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
    const data = req.body as RecepcionUpdateInput;
    const recepcion = await recepcionService.update(req.params.id, data, req.user?.id);
    res.status(200).json({
      success: true,
      message: 'Recepción actualizada exitosamente',
      data: recepcion,
    });
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
    const result = await recepcionService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
